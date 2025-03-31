import { getGoogleSheets, SPREADSHEET_ID } from '@/app/api/utils';
import { RUN_TABLE, USER_TABLE } from '@/constants/table';
import { ResponseError, ResponseSuccess } from '@/utils/response';
import { NextRequest } from 'next/server';

type IParams = Promise<{
  uuid: string;
}>;

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
    if (!uuid) return ResponseError(50104); // uuid 없음

    const sheets = await getGoogleSheets();

    // [ [table명, uuid컬럼명] ]
    const targets: [string, string][] = [
      [RUN_TABLE, 'user_uuid'],
      [USER_TABLE, 'uuid'],
    ];

    const deleteRequests: any[] = [];

    for (const [table, uuidColumnName] of targets) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${table}!A:Z`,
      });

      const rows = response.data.values;
      if (!rows || rows.length <= 1) continue;

      const headers = rows[0];
      const uuidIndex = headers.indexOf(uuidColumnName);
      if (uuidIndex === -1) continue;

      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const sheet = sheetInfo.data.sheets?.find(
        (s) => s.properties?.title === table,
      );

      if (!sheet || sheet.properties?.sheetId === undefined) {
        return ResponseError(50101); // 시트 ID를 찾을 수 없음
      }

      const sheetId = sheet.properties.sheetId;
      const dataRows = rows.slice(1);

      // UUID 일치하는 행의 실제 index 수집 (index 보정 필요: +1)
      const matchedIndexes = dataRows
        .map((row, i) => (row[uuidIndex] === uuid ? i + 1 : -1))
        .filter((idx) => idx !== -1)
        .sort((a, b) => b - a); // 역순 정렬 (삭제 인덱스 밀림 방지)

      for (const rowIndex of matchedIndexes) {
        deleteRequests.push({
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        });
      }
    }

    if (deleteRequests.length === 0) {
      return ResponseError(50003); // 삭제할 행 없음
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: deleteRequests,
      },
    });

    return ResponseSuccess({ deleted: true });
  } catch (e) {
    console.error('DELETE /user/[id]/route.ts error:', e);
    return ResponseError(59999);
  }
}
