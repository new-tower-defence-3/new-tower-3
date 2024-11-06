import { findUserId } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import JoiUtils from '../../utils/joi.util.js';
import { ACCESS_TOKEN_SECRET_KEY } from '../../constants/env.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

const loginRequestHandler = async ({ socket, payload, sequence }) => {
  try {
    console.log('loginRequestHandler Called', payload);
    const { id, password } = await JoiUtils.validateSignIn(payload);

    const checkExistId = await findUserId(id);

    if (!checkExistId) {
      checkFail(socket);
    }

    const checkPassword = await bcrypt.compare(password, checkExistId.password);

    if (!checkPassword) {
      checkFail(socket);
    }

    // 토큰 생성
    const accessToken = jwt.sign(
      {
        userName: checkExistId.userName,
      },
      ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '1h' },
    );

    const totalToken = `Bearer ${accessToken}`;

    const responsePayload = {
      success: true,
      message: ' Login Success',
      token: totalToken,
      failCode: 0,
    };

    const loginResponse = createResponse(PacketType.LOGIN_RESPONSE, responsePayload);
    socket.write(loginResponse);
  } catch (e) {
    console.error(e);
  }
};

const checkFail = (socket) => {
  const responsePayload = {
    success: false,
    message: 'Login fail: 아이디 또는 비밀번호가 잘못되었습니다.',
    token: '',
    failCode: 2,
  };
  const loginResponse = createResponse(PacketType.LOGIN_RESPONSE, responsePayload);
  socket.write(loginResponse);

  throw new CustomError(ErrorCodes.USER_NOT_FOUND, '아이디 또는 비밀번호가 잘못되었습니다.');
};

export default loginRequestHandler;
