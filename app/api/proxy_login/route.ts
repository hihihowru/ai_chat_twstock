import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    
    // 轉發到後端 API
    const backendResponse = await fetch('http://localhost:8000/api/proxy_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
    console.error('Error in proxy_login API:', error);
    return NextResponse.json(
      { 
        error: 'internal_server_error',
        error_description: '登入處理時發生錯誤'
      },
      { status: 500 }
    );
  }
} 