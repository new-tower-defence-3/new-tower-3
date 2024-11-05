import { createUser, findUserId } from '../../db/user/user.db.js';
import JoiUtils from '../../utils/joi.util.js';
import bcrypt from 'bcrypt';

const registerRequestHandler = async ({ socket, payload, sequence }) => {
  try {
    console.log('registerRequestHandler Called');
    console.log(socket);
    console.log(payload);
    console.log(sequence);

    const { id, email, password } = await JoiUtils.validateSignUp(payload);

    console.log(id);
    console.log(password);
    console.log(email);

    const checkExistId = await findUserId(id);
    if (checkExistId) {
      console.log('이미 존재하는 ID');
      return 1;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await createUser(id, email, hashedPassword);

    return 1;
  } catch (e) {
    console.error(e);
  }
};

export default registerRequestHandler;
