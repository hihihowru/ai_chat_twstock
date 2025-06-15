// /app/api/news/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { stockId } = await req.json()

  console.log('[API] 收到 stockId:', stockId)

  const url = `https://www.cmoney.tw/MobileService/ashx/GetDtnoData.ashx?action=getdtnodata&DtNo=105567992&ParamStr=AssignID=${stockId};MTPeriod=0;DTMode=0;DTRange=5;DTOrder=1;MajorTable=M173;&AssignSPID=&KeyMap=&FilterNo=0;`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://www.cmoney.tw/',
        'Accept': 'application/json',
      },
    })

    const text = await res.text()

    try {
      const json = JSON.parse(text)
      console.log('[API] 成功取得 CMoney 資料')
      return NextResponse.json(json)
    } catch {
      console.warn('[API] 回傳非 JSON:', text)
      return NextResponse.json({ error: '資料格式錯誤', raw: text }, { status: 500 })
    }
  } catch (err: any) {
    console.error('[API] fetch CMoney error:', err)
    return NextResponse.json({ error: '無法取得資料' }, { status: 500 })
  }
}
