import {
  getGoogleSheets,
  SPREADSHEET_ID,
  TDatabaseValue,
} from '@/app/api/utils';
import { USER_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';

const RANGE = `${USER_TABLE}!A:Z`;

// 이메일 존재 확인용
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const email = searchParams.get('email');

    if (!email) {
      return ResponseError(50104); // 필수 필드 누락
    }

    const sheets = await getGoogleSheets();

    // 1. 기존 데이터 불러오기 (email 중복 체크용)
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = getResponse.data.values || [];
    const headers = rows[0] || [];
    const emailIndex = headers.indexOf('email');

    const userData = rows.slice(1).find((row) => row[emailIndex] === email);

    if (userData) {
      const jsonData: Record<string, TDatabaseValue>[] = [userData].map(
        (row: string[]) => {
          const obj: Record<string, TDatabaseValue> = {};
          headers.forEach((header: string, index: number) => {
            const value: TDatabaseValue = row[index] || '';

            obj[header] = value;
          });
          return obj;
        },
      );

      return ResponseSuccess(jsonData[0]);
    }

    return ResponseSuccess(null);
  } catch (error) {
    console.error('Error adding person:', error);
    return ResponseError(59999);
  }
}
