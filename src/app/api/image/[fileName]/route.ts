import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

type RouteParams = { params: { fileName: string } };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const buffer = fs.readFileSync(path.join(process.env.PATH_TO_FILES || '', params.fileName));
    const blob = new Blob([buffer]);
    const response = new NextResponse(blob);
    response.headers.append('Content-Type', blob.type);
    return response;
  } catch {
    return new NextResponse('', { status: 404 });
  }
}
