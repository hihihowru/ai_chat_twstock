import aliasMap from '@/data/stock_alias_dict.json'

export function resolveStockId(input: string): string | null {
  const lowered = input.toLowerCase()
  for (const [stockId, aliases] of Object.entries(aliasMap)) {
    if (Array.isArray(aliases) && aliases.some(alias => lowered.includes(alias.toLowerCase()))) {
      return stockId
    }
  }
  return null
}
