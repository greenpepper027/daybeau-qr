import { google } from 'googleapis';

function getAuth() {
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
  // Vercel may expand \n escape sequences into real newlines inside the JSON string.
  // Since the service account JSON is always single-line, any real \n must be inside
  // string values — re-escape them so JSON.parse succeeds.
  if (raw.includes('\n')) {
    raw = raw.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');
  }
  const key = JSON.parse(raw);
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

// ── Pages ──────────────────────────────────────────────────────────────────
// Pages sheet columns: A:id | B:code | C:title | D:subtitle | E:theme_color | F:items_json | G:config_json | H:created_at | I:bg_image
// config_json: { logo_url, logo_size, title_color, subtitle_color, bg_color, lang }
// bg_image (column I): base64 data URL stored separately to avoid cell size limits

function parseJson(str, fallback) {
  try { return JSON.parse(str || JSON.stringify(fallback)); } catch { return fallback; }
}

export async function getPages() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Pages!A2:I',
  });
  const rows = res.data.values || [];
  return rows.map((r) => {
    const config = parseJson(r[6], {});
    // bg_image_url is stored in column I; merge into config for backward compat
    if (r[8]) config.bg_image_url = r[8];
    return {
      id: r[0] || '',
      code: r[1] || '',
      title: r[2] || '',
      subtitle: r[3] || '',
      theme_color: r[4] || '#f43f5e',
      items: parseJson(r[5], []),
      config,
      created_at: r[7] || '',
    };
  });
}

export async function getPageByCode(code) {
  const pages = await getPages();
  return pages.find((p) => p.code === code) || null;
}

export async function appendPage({ id, code, title, subtitle, theme_color, items, config }) {
  const sheets = await getSheets();
  const { bg_image_url, ...configWithoutBg } = config || {};
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Pages!A:I',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[id, code, title, subtitle, theme_color, JSON.stringify(items || []), JSON.stringify(configWithoutBg), new Date().toISOString(), bg_image_url || '']],
    },
  });
}

export async function updatePage(code, { title, subtitle, theme_color, items, config }) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Pages!B2:B',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === code);
  if (rowIndex === -1) return;
  const sheetRow = rowIndex + 2;
  const { bg_image_url, ...configWithoutBg } = config || {};
  console.log('[updatePage] row:', sheetRow, 'bg_image_url len:', bg_image_url?.length || 0);
  // update C:G (title~config) and I (bg_image) separately to keep H (created_at) intact
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Pages!C${sheetRow}:G${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[title, subtitle, theme_color, JSON.stringify(items || []), JSON.stringify(configWithoutBg)]] },
  });
  console.log('[updatePage] C:G done, writing bg to I', sheetRow);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Pages!I${sheetRow}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[bg_image_url || '']] },
  });
  console.log('[updatePage] I done');
}

export async function deletePage(code) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Pages!B2:B',
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === code);
  if (rowIndex === -1) return;
  const sheetRow = rowIndex + 2;
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find((s) => s.properties.title === 'Pages');
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

// ── Links ───────────────────────────────────────────────────────────────────
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
