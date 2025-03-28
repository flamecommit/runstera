import { google } from 'googleapis';

const SPREADSHEET_JSON_KEY = JSON.parse(
  process.env.SPREADSHEET_JSON_KEY as string,
);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export type TDatabaseValue = string | string[] | boolean;

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID as string;

export const getGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: SPREADSHEET_JSON_KEY,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
};
