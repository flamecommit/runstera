export interface IErrorObject {
  [code: number]: {
    message: string;
    alert: string;
  };
}

export const ERROR_TYPE: IErrorObject = {
  50101: {
    message: 'Internal Server Error',
    alert: '내부 서버 오류',
  },
  50102: {
    message: 'Database connection error',
    alert: '데이터베이스 연결 오류',
  },
  50103: {
    message: 'Post not found',
    alert: '데이터를 찾을 수 없음',
  },
  50104: {
    message: 'Required information missing',
    alert: '필수 정보 누락',
  },
  50105: {
    message: 'Permission denied',
    alert: '권한이 없음',
  },
  50106: {
    message: 'Request too large',
    alert: '요청이 너무 큼',
  },
  50107: {
    message: 'Invalid data format',
    alert: '유효하지 않은 데이터 형식',
  },
  59999: {
    message: 'Undefined error',
    alert: '정의되지 않은 오류',
  },
};
