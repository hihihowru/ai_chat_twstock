import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stockListParam = searchParams.get('stock_list');
  
  if (!stockListParam) {
    return new Response('Missing stock_list parameter', { status: 400 });
  }

  // 使用環境變數，預設為 localhost:8000
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
  
  // 直接 proxy 到新的 SSE endpoint
  const backendResponse = await fetch(`${API_BASE_URL}/api/watchlist-summary-sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stock_list: JSON.parse(stockListParam),
      userId: 'default'
    }),
  });

  // 直接 pipe 後端 SSE stream
  return new Response(backendResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
} 