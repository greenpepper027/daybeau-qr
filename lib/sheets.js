import { google } from 'googleapis';

function getAuth() {
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  return new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheets() {
  const auth = await getAuth();
  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Links sheet columns: id | code | title | original_url | created_at | clicks
export async function getLinks() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Links!A2:F',
  });
  const rows = res.data.values || [];
  return rows.map((r) => ({
    id: r[0] || '',
    code: r[1] || '',
    title: r[2] || '',
    original_url: r[3] || '',
    created_at: r[4] || '',
    clicks: parseInt(r[5] || '0', 10),
  }));
}

export async function getLinkByCode(code) {
  const links = await getLinks();
  return links.find((l) => l.code === code) || null;
}

export async function appendLink({ id, code, title, original_url }) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Links!A:F',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[id, code, title, original_url, new Date().toISOString(), 0]],
    },
  });
}

export async function updateLinkClicks(code, clicks) {
  const sheets = await getSheets();
  // find row index
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Links!B2:B',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === code);
  if (rowIndex === -1) return;
  const sheetRow = rowIndex + 2; // 1-indexed + header
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Links!F${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[clicks]] },
  });
}

export async function deleteLink(code) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Links!B2:B',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === code);
  if (rowIndex === -1) return;
  const sheetRow = rowIndex + 2;

  // get sheet id for Links tab
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find((s) => s.properties.title === 'Links');
  if (!sheet) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties.sheetId,
            dimension: 'ROWS',
            startIndex: sheetRow - 1,
            endIndex: sheetRow,
          },
        },
      }],
    },
  });
}

export async function updateLink(code, { title, original_url }) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Links!B2:B',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === code);
  if (rowIndex === -1) return;
  const sheetRow = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Links!C${sheetRow}:D${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[title, original_url]] },
  });
}
