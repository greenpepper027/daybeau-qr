import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
    const key = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Pages!A2:I3',
    });
    return NextResponse.json({ ok: true, rows: res.data.values });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message, stack: e.stack?.slice(0, 500) });
  }
}
