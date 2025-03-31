import {
  getGoogleSheets,
  SPREADSHEET_ID,
  TDatabaseValue,
} from '@/app/api/utils';
import { USER_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { v4 as uuidv4 } from 'uuid';

const RANGE = `${USER_TABLE}!A:Z`;

// Users 목록 조회
export async function GET() {
  try {
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
          const value: TDatabaseValue = row[index] || '';

          obj[header] = value;
        });
        return obj;
      });

    const person = jsonData.sort((a, b) =>
      a.name.toString().localeCompare(b.name.toString()),
    );

    return ResponseSuccess(person);
  } catch {
    return ResponseError(59999);
  }
}

// User 신규 등록
export async function POST(req: Request) {
  try {
    const { email, name, image } = await req.json();

    if (!email || !name) {
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

    const existing = rows.slice(1).find((row) => row[emailIndex] === email);

    if (existing) {
      const jsonData: Record<string, TDatabaseValue>[] = [existing].map(
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

    // 2. 등록
    const now = new Date().toISOString();
    const uuid = uuidv4();

    const newRow = [
      uuid, // B열: id
      email, // C열: email
      name, // D열: name
      image, // E열: image
      now, // F열: created_at
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [newRow],
      },
    });

    return ResponseSuccess({
      uuid,
      email,
      name,
      image,
      created_at: now,
    });
  } catch (error) {
    console.error('Error adding person:', error);
    return ResponseError(59999);
  }
}
