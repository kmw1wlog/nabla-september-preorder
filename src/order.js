export const SECTIONS = [
  { id: 1, label: 'SECTION 1', rounds: '1~8회차', orderBy: '9월 9일까지 주문', ship: '9월 14일', shortShip: '9/14' },
  { id: 2, label: 'SECTION 2', rounds: '9~16회차', orderBy: '9월 30일까지 주문', ship: '10월 5일', shortShip: '10/5' },
  { id: 3, label: 'SECTION 3', rounds: '17~24회차', orderBy: '10월 21일까지 주문', ship: '10월 26일', shortShip: '10/26' },
]

export const PRICE_TIERS = [
  { min: 1, max: 10, label: '1~10명 이하', discount: '—', unit: 5500 },
  { min: 11, max: 20, label: '11~20명', discount: '10%', unit: 4950 },
  { min: 21, max: 30, label: '21~30명', discount: '15%', unit: 4675 },
  { min: 31, max: 40, label: '31~40명', discount: '20%', unit: 4400 },
  { min: 41, max: 50, label: '41~50명', discount: '25%', unit: 4125 },
  { min: 51, max: Infinity, label: '51명 이상', discount: '30%', unit: 3850 },
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
