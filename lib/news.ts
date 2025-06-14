export async function fetchCmoneyNews(stockId: string) {
  const url = `https://www.cmoney.tw/MobileService/ashx/GetDtnoData.ashx?action=getdtnodata&DtNo=105567992&ParamStr=AssignID=${stockId};MTPeriod=0;DTMode=0;DTRange=5;DTOrder=1;MajorTable=M173;`
  const res = await fetch(url)
  const data = await res.json()

  if (!data?.Data || !Array.isArray(data.Data)) return []

  const titleIndex = data.Title.indexOf('新聞標題')
  const timeIndex = data.Title.indexOf('發布日期時間')

  return data.Data.map((row: any[]) => ({
    time: row[timeIndex],
    title: row[titleIndex],
  }))
}
