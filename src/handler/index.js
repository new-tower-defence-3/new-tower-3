import { HANDLER_IDS } from '../constants/handlerids.js';
import registerUser from './user/register.handler.js';

const handlers = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    handler: registerUser,
    protoType: 'request.C2SRegisterRequest',
  },
  //   [HANDLER_IDS.LOCATION_UPDATE]: {
  //     handler: locationUpdateHandler,
  //     protoType: 'game.LocationUpdatePayload',
  //   },
};

export const getHandlerById = (packetType) => {
  if (!handlers[packetType]) {
    throw Error();
  }

  return handlers[packetType].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    throw Error();
  }

  return handlers[handlerId].protoType;
};
