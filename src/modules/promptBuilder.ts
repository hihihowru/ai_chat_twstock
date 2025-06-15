export type PromptType = 'summary' | 'tech_analysis' | 'news_digest' | 'qa'

export function buildPrompt(type: PromptType, stockId: string, context: string): string {
  switch (type) {
    case 'summary':
      return `請用簡潔方式總結 ${stockId} 的最新重點資訊。\n${context}`
    case 'tech_analysis':
      return `根據以下資料，請從技術分析角度解析 ${stockId} 的走勢與趨勢：\n${context}`
    case 'news_digest':
      return `請條列整理 ${stockId} 的最近新聞摘要：\n${context}`
    case 'qa':
    default:
      return `以下是關於 ${stockId} 的資訊，請根據此內容協助回答問題：\n${context}`
  }
}
