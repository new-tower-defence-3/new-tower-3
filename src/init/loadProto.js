// loadProto.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../protobuf');

/**
 * 지정된 디렉토리에서 모든 .proto 파일을 재귀적으로 찾습니다.
 * @param {string} dir - 탐색할 디렉토리 경로
 * @param {string[]} fileList - 누적된 파일 경로 리스트
 * @returns {string[]} 모든 .proto 파일의 경로 리스트
 */
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

/**
 * 모든 .proto 파일을 로드하고, protoMessages 객체에 모든 타입을 매핑합니다.
 */
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    // 모든 .proto 파일을 비동기적으로 로드
    await Promise.all(protoFiles.map((file) => root.load(file)));

    // 모든 타입을 해석
    root.resolveAll();

    /**
     * 재귀적으로 모든 네임스페이스를 탐색하여 타입을 protoMessages에 추가합니다.
     * @param {protobuf.Namespace} namespace - 현재 탐색 중인 네임스페이스
     */
    const processNamespace = (namespace) => {
      for (const [typeName, type] of Object.entries(namespace.nested)) {
        if (type instanceof protobuf.Type || type instanceof protobuf.Enum) {
          protoMessages[typeName] = type;
        } else if (type instanceof protobuf.Namespace) {
          processNamespace(type);
        }
      }
    };

    processNamespace(root);

    console.log('Protobuf 파일이 모두 로드되었습니다.');
  } catch (e) {
    console.error('Protobuf 파일 로드 중 오류가 발생하였습니다.', e);
  }
};

/**
 * 로드된 모든 Protobuf 메시지 타입을 반환합니다.
 * @returns {Object} 로드된 모든 메시지 타입
 */
export const getProtoMessages = () => {
  return { ...protoMessages };
};
