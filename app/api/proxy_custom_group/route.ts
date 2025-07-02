import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const authHeader = request.headers.get('authorization');
    
    // 使用環境變數，預設為 localhost:8000
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    
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