import { findUserId, updateUserLogin } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JoiUtils from '../../utils/joi.util.js';
import { ACCESS_TOKEN_SECRET_KEY } from '../../constants/env.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { addUser, findUser } from '../../sessions/user.session.js';
import User from '../../classes/models/user.class.js';

const loginRequestHandler = async ({ socket, payload, sequence }) => {
  try {
    const { id, password } = await JoiUtils.validateSignIn(payload);

    const checkExistId = await findUserId(id);

    if (!checkExistId) {
      makeResponse(socket, false, '아이디 또는 비밀번호가 잘못되었습니다.', '', 2);
    }

    const checkPassword = await bcrypt.compare(password, checkExistId.password);

    if (!checkPassword) {
      makeResponse(socket, false, '아이디 또는 비밀번호가 잘못되었습니다.', '', 2);
    }

    // 중복 로그인 방지를 위한
    const findSession = await findUser(id);

    if (findSession) {
      makeResponse(socket, false, '이미 접속중인 아이디', '', 2);
    }

    // 유저 클래스 생성
    const loginUser = new User(socket, id, 50, checkExistId.highScore);
    await addUser(loginUser);
    await updateUserLogin(id);

    // 토큰 생성
    const accessToken = jwt.sign(
      {
        userName: checkExistId.userName,
      },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '1h' },
    );

    const totalToken = `Bearer ${accessToken}`;
    makeResponse(socket, true, 'Login Success', totalToken, 0);
  } catch (e) {
    console.error(e);
  }
};

const makeResponse = (socket, success, message, token, failCode) => {
  const responsePayload = {
    success: success,
    message: message,
    token: token,
    failCode: failCode,
  };
  const loginResponse = createResponse(PacketType.LOGIN_RESPONSE, responsePayload);

  socket.write(loginResponse);

  if (failCode > 0) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, message);
  }
};

export default loginRequestHandler;
