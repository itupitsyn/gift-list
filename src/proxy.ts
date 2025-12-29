import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Если в запросе есть заголовок Next-Action, а вы их не используете — это фрод
  if (request.headers.has('next-action')) {
    return new NextResponse('Not Allowed', { status: 403 });
  }
}
