import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { stockId } = await req.json()

  const url = `https://www.cmoney.tw/MobileService/ashx/GetDtnoData.ashx?action=getdtnodata&DtNo=105567992&ParamStr=AssignID=${stockId};MTPeriod=0;DTMode=0;DTRange=5;DTOrder=1;MajorTable=M173;`
  console.log('[API] POST /api/news triggered', stockId)

  try {
    const res = await fetch(url)
    const data = await res.json()

    const titleIndex = data.Title.indexOf('新聞標題')
    const timeIndex = data.Title.indexOf('發布日期時間')

    const parsed = data.Data.slice(0, 3).map((row: string[]) => ({
      title: row[titleIndex],
      time: row[timeIndex],
    }))

    return NextResponse.json(parsed)
  } catch (err) {
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 })
  }
}
