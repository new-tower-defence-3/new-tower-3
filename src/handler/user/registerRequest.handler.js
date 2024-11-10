// src/handler/user/registerRequest.handler.js

import { createUser, findUserId } from '../../db/user/user.db.js';
import CustomError from '../../utils/error/customError.js';
import JoiUtils from '../../utils/joi.util.js';
import bcrypt from 'bcrypt';
import { createResponse } from '../../utils/response/createResponse.js';
import { PacketType } from '../../constants/header.js';

const registerRequestHandler = async ({ socket, payload, sequence }) => {
  try {
    const { id, email, password } = await JoiUtils.validateSignUp(payload);

    const checkExistId = await findUserId(id);
    if (checkExistId) {
      const responsePayload = {
        success: false,
        message: '이미 존재하는 ID',
        failCode: 2,
      };

      const registerResponse = createResponse(PacketType.REGISTER_RESPONSE, responsePayload);
      socket.write(registerResponse);

      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '이미 존재하는 ID');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await createUser(id, email, hashedPassword);

    const responsePayload = {
      success: true,
      message: 'Register Success',
      failCode: 0,
    };

    const registerResponse = createResponse(PacketType.REGISTER_RESPONSE, responsePayload);
    socket.write(registerResponse);
  } catch (e) {
    console.error(e);
  }
};

export default registerRequestHandler;
