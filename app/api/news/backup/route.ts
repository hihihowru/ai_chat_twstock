import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { stockId: rawInput } = await req.json()
    console.log('[API] 收到使用者輸入:', rawInput)

    // 讀入 stock alias map
    const jsonPath = path.join(process.cwd(), 'data/stock_alias_dict.json')
    const fileContent = await fs.readFile(jsonPath, 'utf-8')
    const aliasMap = JSON.parse(fileContent) as Record<string, string[]>
    console.log('[API] 成功載入 aliasMap，共有項目數:', Object.keys(aliasMap).length)

    // 利用 alias map 解析 stockId
    let resolvedId: string | null = null
    for (const [stockId, aliases] of Object.entries(aliasMap)) {
      if (Array.isArray(aliases) && aliases.some(alias => rawInput.includes(alias))) {
        resolvedId = stockId
        console.log('[API] 成功解析為 stockId:', resolvedId)
        break
      }
    }

    if (!resolvedId) {
      console.warn('[API] 無法解析輸入為股票代號:', rawInput)
      return NextResponse.json([], { status: 200 })
    }

    // 正確 URL
    const url = `https://www.cmoney.tw/MobileService/ashx/GetDtnoData.ashx?action=getdtnodata&DtNo=105567992&ParamStr=AssignID=${resolvedId};MTPeriod=0;DTMode=0;DTRange=5;DTOrder=1;MajorTable=M173;&AssignSPID=&KeyMap=&FilterNo=0;`
    console.log('[API] 發送請求至 CMoney API:', url)

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://www.cmoney.tw/',
        'Accept': 'application/json',
      },
    })

    const data = await res.json()
    console.log('[API] 從 CMoney 回傳的原始資料樣本:', JSON.stringify(data?.Data?.[0] ?? '無資料'))

    if (!data?.Data || !Array.isArray(data.Data)) {
      console.error('[API] 資料格式錯誤或為空，回傳資料:', data)
      return NextResponse.json([], { status: 200 })
    }

    const titleIndex = data.Title.indexOf('新聞標題')
    const timeIndex = data.Title.indexOf('發布日期時間')

    if (titleIndex === -1 || timeIndex === -1) {
      console.error('[API] 找不到欄位 index，Title:', data.Title)
      return NextResponse.json([], { status: 200 })
    }

    const parsed = data.Data.slice(0, 3).map((row: string[]) => ({
      title: row[titleIndex],
      time: row[timeIndex],
    }))
    console.log('[API] 成功解析出新聞摘要:', parsed)

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('[API] 發生錯誤:', err)
    return NextResponse.json({ error: '伺服器錯誤', detail: err.message }, { status: 500 })
  }
}
