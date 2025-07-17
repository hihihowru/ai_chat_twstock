import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headers = Object.fromEntries(req.headers.entries());
    console.log('proxy_custom_group: received body:', body);
    console.log('proxy_custom_group: received headers:', headers);

    // Debug: 檢查環境變數
    console.log('CMONEY_API_BASE_URL:', process.env.CMONEY_API_BASE_URL);
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('CMONEY')));

    // 準備完整 URL
    const url = process.env.CMONEY_API_BASE_URL + '/CustomGroup.ashx';
    console.log('即將 fetch CMoney API，完整 URL:', url);
    console.log('即將 fetch CMoney API，headers:', {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': headers['authorization'] || ''
    });
    console.log('即將 fetch CMoney API，body:', body);

    // 轉發到 CMoney API
    const cmoneyRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': headers['authorization'] || ''
      },
      body
    });
    const text = await cmoneyRes.text();
    console.log('CMoney API 回傳原始內容:', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('proxy_custom_group: CMoney API response not JSON:', text);
      data = { error: 'CMoney API response not JSON', raw: text };
    }
    console.log('proxy_custom_group: CMoney API response:', data);
    return NextResponse.json(data);
  } catch (e) {
    console.error('proxy_custom_group error:', e);
    return NextResponse.json({ error: 'proxy error', detail: String(e) }, { status: 500 });
  }
} 