import {
  getGoogleSheets,
  SPREADSHEET_ID,
  TDatabaseValue,
} from '@/app/api/utils';
import { RUN_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { v4 as uuidv4 } from 'uuid';

const RANGE = `${RUN_TABLE}!A:Z`;

// Runs 목록 조회
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const user_uuid = searchParams.get('user_uuid');
    const sheets = await getGoogleSheets();
    // 스프레드시트 ID 및 범위 설정

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
    const filtered = jsonData.filter((item) => item.user_uuid === user_uuid);

    const sorted = filtered.sort((a, b) =>
      b.started_at.toString().localeCompare(a.started_at.toString()),
    );

    return ResponseSuccess(sorted);
  } catch {
    return ResponseError(59999);
  }
}

// Runs 신규 등록
export async function POST(req: Request) {
  try {
    const {
      user_uuid,
      startedAt,
      endedAt,
      duration,
      title = '',
      route = [],
      distance,
    } = await req.json();

    const sheets = await getGoogleSheets();

    // 현재 시간 (created_at, updated_at)
    const now = new Date().toISOString();
    const uuid = uuidv4();

    // Google Sheets API를 사용하여 데이터 추가
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [
            uuid,
            user_uuid,
            title,
            startedAt,
            endedAt,
            duration,
            JSON.stringify(route),
            distance,
            now,
            now,
          ],
        ],
      },
    });

    return ResponseSuccess(response.data);
  } catch (error) {
    console.error('Error adding person:', error);
    return ResponseError(59999);
  }
}
