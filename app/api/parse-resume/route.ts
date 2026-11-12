import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const pwd = req.headers.get('x-admin-password');
  const validPwd = process.env.ADMIN_PASSWORD || 'nikhil@admin2026';
  if (pwd !== validPwd) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileBase64, mimeType } = await req.json();

  const prompt = `Extract portfolio data from this resume/document. Return ONLY valid JSON with this exact structure:
{
  "name": "Full Name",
  "title": "Job Title/Role",
  "bio": "Short 1-2 sentence bio",
  "bioExtended": ["paragraph 1", "paragraph 2"],
  "location": "City, Country",
  "email": "email@example.com",
  "phone": "phone number or empty string",
  "github": "github username or URL",
  "linkedin": "linkedin URL or username",
  "skills": {
    "frontend": ["React", "TypeScript"],
    "backend": ["Node.js", "Express"],
    "tools": ["Git", "Docker"]
  },
  "experiences": [
    {
      "period": "Jan 2024 — Present",
      "role": "Job Title",
      "company": "Company Name",
      "location": "City",
      "desc": "Description of work",
      "tags": ["React", "Node.js"]
    }
  ],
  "education": {
    "degree": "B.Tech in CS&E",
    "institution": "University Name",
    "location": "City, State",
    "period": "2020 — 2024",
    "cgpa": "7.6/10.0",
    "desc": "Description"
  },
  "projects": [
    {
      "num": "01",
      "title": "PROJECT NAME",
      "tags": ["Tag1", "Tag2"],
      "desc": "Project description",
      "link": "https://...",
      "year": "2024"
    }
  ]
}`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured in .env.local' }, { status: 500 });
  }
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: prompt }];

  if (fileBase64 && mimeType) {
    parts.push({ inlineData: { mimeType, data: fileBase64 } });
  }

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  const geminiData = await response.json();
  const text: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || [null, text];
  const jsonStr = jsonMatch[1] ? jsonMatch[1].trim() : text.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    return NextResponse.json({ success: true, data: parsed });
  } catch {
    return NextResponse.json({ success: false, raw: text });
  }
}
