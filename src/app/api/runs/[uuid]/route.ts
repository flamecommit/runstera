import {
  getGoogleSheets,
  SPREADSHEET_ID,
  TDatabaseValue,
} from '@/app/api/utils';
import { RUN_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';

const RANGE = `${RUN_TABLE}!A:Z`;

// Runs 상세 조회
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { uuid: string };
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
