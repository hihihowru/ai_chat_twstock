import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const authHeader = request.headers.get('authorization');
    
    // 使用 API_BASE_URL，production 必須是 https:// 開頭
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // 轉發到後端 API
    const backendResponse = await fetch(`${API_BASE_URL}/api/proxy_custom_group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: body,
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in proxy_custom_group API:', error);
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        error_description: '取得自選股群組時發生錯誤'
      },
      { status: 500 }
    );
  }
} 