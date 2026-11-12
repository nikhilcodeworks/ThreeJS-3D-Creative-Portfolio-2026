import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'lib', 'portfolio-data.json');

export async function GET() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password');
  const validPwd = process.env.ADMIN_PASSWORD || 'nikhil@admin2026';
  if (pwd !== validPwd) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  writeFileSync(DATA_PATH, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
