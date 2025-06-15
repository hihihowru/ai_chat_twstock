import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { question, stockId, keyword } = await req.json()

    const cmoneyRes = await fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}/proxy-news?stockId=${stockId}`
    )
    const cmoneyData = await cmoneyRes.json()
    const cmoneyText = (cmoneyData.Data || [])
      .slice(0, 5)
      .map((d: string[]) => `[CMoney] ${d[1]} - ${d[2]}`)
      .join('\n')

    const mnewsRes = await fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}/proxy-news?stockId=${stockId}`
    )
    const mnewsData = await mnewsRes.json()
    const mnewsText = (mnewsData.items || [])
      .slice(0, 5)
      .map((d: any) => `[MNews] ${d.title}`)
      .join('\n')

    const newsSummary = cmoneyText + '\n' + mnewsText

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: '你是一位專業投資研究員，擅長根據新聞推理股票異動原因',
      },
      {
        role: 'user',
        content: `使用者問：「${question}」，以下是今天的新聞摘要：\n${newsSummary}\n請幫我整理出可能主因與分析`,
      },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    })

    const answer = completion.choices[0].message.content
    return NextResponse.json({ answer })
  } catch (err) {
    console.error('[ask-llm] error:', err)
    return NextResponse.json({ error: 'LLM 回答失敗' }, { status: 500 })
  }
}
