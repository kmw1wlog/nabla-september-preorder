export const PARTS = [
  { id: 1, label: 'PART 1', rounds: '1~8회차', orderBy: '5월 20일까지 주문', ship: '5월 25일', shortShip: '5/25' },
  { id: 2, label: 'PART 2', rounds: '9~16회차', orderBy: '6월 13일까지 주문', ship: '6월 23일', shortShip: '6/23' },
  { id: 3, label: 'PART 3', rounds: '17~24회차', orderBy: '7월 11일까지 주문', ship: '7월 21일', shortShip: '7/21' },
]

export const PRICE_TIERS = [
  { min: 1, max: 10, label: '1~10명 이하', discount: '—', unit: 6000 },
  { min: 11, max: 20, label: '11~20명', discount: '10%', unit: 5400 },
  { min: 21, max: 30, label: '21~30명', discount: '15%', unit: 5100 },
  { min: 31, max: 40, label: '31~40명', discount: '20%', unit: 4800 },
  { min: 41, max: 50, label: '41~50명', discount: '25%', unit: 4500 },
  { min: 51, max: Infinity, label: '51명 이상', discount: '30%', unit: 4200 },
]

export function getUnitPrice(students) {
  if (!Number.isFinite(students) || students < 1) return 0
  return PRICE_TIERS.find((tier) => students >= tier.min && students <= tier.max)?.unit ?? 0
}

export function getOrderTotals(students, selectedParts, paymentType = '') {
  const count = Math.max(0, Math.floor(Number(students) || 0))
  const parts = selectedParts.length
  const unit = getUnitPrice(count)
  const base = count * unit * 8 * parts
  const bundleRate = paymentType === 'director' ? (parts === 3 ? 0.1 : parts === 2 ? 0.05 : 0) : 0
  const supply = Math.round(base * (1 - bundleRate))
  const shipping = parts > 0 && count > 0 ? (count <= 10 ? 5000 * parts : 0) : 0
  return { count, parts, unit, bundleRate, supply, shipping, total: supply + shipping, rounds: parts * 8 }
}

export const formatWon = (value) => new Intl.NumberFormat('ko-KR').format(value)
