import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로
const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};
const protoEnums = {}; // 추가된 부분

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};
      protoEnums[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        // 타입이 메시지인지 열거형인지 확인
        const currentObject = root.lookup(typeName);
        if (currentObject instanceof protobuf.Type) {
          // 메시지 타입인 경우
          protoMessages[packageName][type] = currentObject;
        } else if (currentObject instanceof protobuf.Enum) {
          // 열거형 타입인 경우
          protoEnums[packageName][type] = currentObject;
        } else {
          console.warn(`알 수 없는 타입: ${typeName}`);
        }
      }
    }

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다: ', error);
  }
};

export const getProtoMessages = () => {
  return { ...protoMessages };
};

export const getProtoEnums = () => {
  return { ...protoEnums };
};
