import { NextResponse } from 'next/server';

export async function GET() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '';
  let parseError = null;
  let parsed = false;
  let fixedParseError = null;
  let fixedParsed = false;

  try {
    JSON.parse(raw);
    parsed = true;
  } catch (e) {
    parseError = e.message;
  }

  let fixed = raw;
  if (fixed.includes('\n')) {
    fixed = fixed.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');
  }
  try {
    JSON.parse(fixed);
    fixedParsed = true;
  } catch (e) {
    fixedParseError = e.message;
  }

  return NextResponse.json({
    raw_length: raw.length,
    has_real_newlines: raw.includes('\n'),
    first_100: raw.slice(0, 100),
    parse_ok: parsed,
    parse_error: parseError,
    fixed_parse_ok: fixedParsed,
    fixed_parse_error: fixedParseError,
  });
}
