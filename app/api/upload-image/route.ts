import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password');
  const validPwd = process.env.ADMIN_PASSWORD || 'nikhil@admin2026';
  if (pwd !== validPwd) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { fileBase64, fileName } = await req.json();
  const buffer = Buffer.from(fileBase64, 'base64');
  const dirPath = join(process.cwd(), 'public', 'projects');
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  const savePath = join(dirPath, fileName);
  writeFileSync(savePath, buffer);
  return NextResponse.json({ path: `/projects/${fileName}` });
}
