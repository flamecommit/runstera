import {
  getGoogleSheets,
  SPREADSHEET_ID,
  TDatabaseValue,
} from '@/app/api/utils';
import { RUN_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

const RANGE = `${RUN_TABLE}!A:Z`;

type IParams = Promise<{
  uuid: string;
}>;

// Runs 상세 조회
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: IParams;
  },
) {
  try {
    const { uuid } = await params;
    if (!uuid) {
      return ResponseError(50104);
    }

    const sheets = await getGoogleSheets();

    // Google Sheets API 호출
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    // 데이터 반환
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error();
    }

    const headers = rows[0];

    const jsonData: Record<string, TDatabaseValue>[] = rows
      .slice(1)
      .map((row: string[]) => {
        const obj: Record<string, TDatabaseValue> = {};
        headers.forEach((header: string, index: number) => {
          let value: TDatabaseValue = row[index] || '';

          if (header === 'distance' || header === 'duration') {
            value = Number(row[index]);
          }

          if (header === 'route') {
            try {
              value = JSON.parse(row[index] || '[]');
            } catch {
              value = [];
            }
          }

          obj[header] = value;
        });
        return obj;
      });

    // user_uuid 일치하는 데이터만 필터링
    const filtered = jsonData.filter((item) => item.uuid === uuid);

    return ResponseSuccess(filtered[0]);
  } catch {
    return ResponseError(59999);
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: IParams;
  },
) {
  try {
    const { uuid } = await params;
    if (!uuid) {
      return ResponseError(50104);
    }

    const sheets = await getGoogleSheets();

    // 1. 전체 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return ResponseError(50001); // 데이터 없음
    }

    const headers = rows[0];

    // 2. uuid 컬럼의 인덱스 찾기
    const uuidIndex = headers.indexOf('uuid');
    if (uuidIndex === -1) {
      return ResponseError(50002); // uuid 컬럼 없음
    }

    const dataRowIndex = rows.findIndex((row) => row[uuidIndex] === uuid);

    console.log('dataRowIndex', dataRowIndex);

    if (dataRowIndex === -1) {
      return ResponseError(50003); // 해당 uuid 없음
    }

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheet = sheetInfo.data.sheets?.find(
      (s) => s.properties?.title === RUN_TABLE,
    );

    if (!sheet || sheet.properties?.sheetId === undefined) {
      return ResponseError(50101); // 시트 ID를 찾을 수 없음
    }

    const sheetId = sheet.properties.sheetId; // 시트 ID 가져오기

    // 5. 삭제 요청 (행 삭제)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId, // 기본값. 정확한 sheetId가 필요하면 별도 조회 필요
                dimension: 'ROWS',
                startIndex: dataRowIndex,
                endIndex: dataRowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return ResponseSuccess({ deleted: true });
  } catch (e) {
    console.error(e);
    return ResponseError(59999);
  }
}
