import aliasMap from '../data/stock_alias_dict.json'

export function resolveStockCode(userInput: string): string | null {
  const lowerInput = userInput.toLowerCase()
  for (const [stockId, aliases] of Object.entries(aliasMap)) {
    if (aliases.some((name) => lowerInput.includes(name.toLowerCase()))) {
      return stockId
    }
  }
  return null
}
