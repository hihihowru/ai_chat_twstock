// Mock OHLCV 數據生成器
export function generateMockOHLCVData(days: number = 30, basePrice: number = 100): Array<{
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}> {
  const data = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    
    // 生成隨機價格變動
    const changePercent = (Math.random() - 0.5) * 0.1; // ±5%
    const newPrice = currentPrice * (1 + changePercent);
    
    const open = currentPrice;
    const close = newPrice;
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 1000000) + 100000;

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume
    });

    currentPrice = close;
  }

  return data;
}

// 自選股 Mock 數據
export const mockWatchlistData = {
  '自選股清單一': [
    {
      name: '長榮',
      code: '2603',
      price: 197.5,
      change: 4.5,
      changePercent: 2.3,
      industry: '航運業',
      chartData: generateMockOHLCVData(30, 197.5)
    },
    {
      name: '台積電',
      code: '2330',
      price: 580.0,
      change: 10.2,
      changePercent: 1.8,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 580.0)
    },
    {
      name: '聯發科',
      code: '2454',
      price: 890.0,
      change: -9.9,
      changePercent: -1.1,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 890.0)
    },
    {
      name: '長榮航',
      code: '2618',
      price: 32.5,
      change: 0.3,
      changePercent: 0.8,
      industry: '航運業',
      chartData: generateMockOHLCVData(30, 32.5)
    }
  ],
  '自選股清單二': [
    {
      name: '鴻海',
      code: '2317',
      price: 105.5,
      change: 2.1,
      changePercent: 2.0,
      industry: '電子業',
      chartData: generateMockOHLCVData(30, 105.5)
    },
    {
      name: '中華電',
      code: '2412',
      price: 125.0,
      change: 0.5,
      changePercent: 0.4,
      industry: '電信業',
      chartData: generateMockOHLCVData(30, 125.0)
    }
  ]
};

// 國際指數 Mock 數據
export const mockIndexData = [
  {
    name: '道瓊指數',
    code: 'DJI',
    price: 38790,
    change: 460,
    changePercent: 1.2,
    market: '美股',
    chartData: generateMockOHLCVData(30, 38790)
  },
  {
    name: '日經指數',
    code: 'N225',
    price: 33450,
    change: 267,
    changePercent: 0.8,
    market: '日股',
    chartData: generateMockOHLCVData(30, 33450)
  },
  {
    name: '上證指數',
    code: 'SSEC',
    price: 3120,
    change: 15.6,
    changePercent: 0.5,
    market: '陸股',
    chartData: generateMockOHLCVData(30, 3120)
  },
  {
    name: '台股指數',
    code: 'TWII',
    price: 17890,
    change: 195,
    changePercent: 1.1,
    market: '台股',
    chartData: generateMockOHLCVData(30, 17890)
  }
];

// 熱門股排行 Mock 數據
export const mockHotStocksData = {
  '強勢股': [
    {
      name: '智原',
      code: '3035',
      price: 245.0,
      change: 22.0,
      changePercent: 9.8,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 245.0)
    },
    {
      name: '世芯-KY',
      code: '3661',
      price: 1890,
      change: 127,
      changePercent: 7.2,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 1890)
    },
    {
      name: '創意',
      code: '3443',
      price: 1250,
      change: 76,
      changePercent: 6.5,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 1250)
    },
    {
      name: '聯詠',
      code: '3034',
      price: 445.0,
      change: 24.5,
      changePercent: 5.8,
      industry: '半導體業',
      chartData: generateMockOHLCVData(30, 445.0)
    }
  ],
  '弱勢股': [
    {
      name: '大立光',
      code: '3008',
      price: 2150,
      change: -71,
      changePercent: -3.2,
      industry: '光電業',
      chartData: generateMockOHLCVData(30, 2150)
    },
    {
      name: '玉晶光',
      code: '3406',
      price: 345,
      change: -10,
      changePercent: -2.8,
      industry: '光電業',
      chartData: generateMockOHLCVData(30, 345)
    },
    {
      name: '可成',
      code: '2474',
      price: 185,
      change: -4,
      changePercent: -2.1,
      industry: '電子業',
      chartData: generateMockOHLCVData(30, 185)
    }
  ]
}; 