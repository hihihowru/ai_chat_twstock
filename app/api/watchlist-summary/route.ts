import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stock_list, userId } = body;

    if (!stock_list || !Array.isArray(stock_list) || stock_list.length === 0) {
      return NextResponse.json(
        { success: false, error: '股票清單不能為空' },
        { status: 400 }
      );
    }

    // 調用後端 API
    const backendResponse = await fetch('http://localhost:8000/api/watchlist-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_list,
        userId
      }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend API error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in watchlist-summary API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '處理請求時發生錯誤',
        sections: [],
        logs: []
      },
      { status: 500 }
    );
  }
} 