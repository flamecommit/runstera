import { getGoogleSheets, SPREADSHEET_ID } from '@/app/api/utils';
import { RUN_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { v4 as uuidv4 } from 'uuid';

const RANGE = `${RUN_TABLE}!A:Z`;

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
