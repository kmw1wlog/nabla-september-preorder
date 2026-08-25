import test from 'node:test'
import assert from 'node:assert/strict'
import { getOrderTotals, getUnitPrice, SECTIONS } from './order.js'

test('SECTION별 주문 마감일과 출고일을 적용한다', () => {
  assert.deepEqual(
    SECTIONS.map(({ label, orderBy, ship }) => ({ label, orderBy, ship })),
    [
      { label: 'SECTION 1', orderBy: '9월 9일까지 주문', ship: '9월 14일' },
      { label: 'SECTION 2', orderBy: '9월 30일까지 주문', ship: '10월 5일' },
      { label: 'SECTION 3', orderBy: '10월 21일까지 주문', ship: '10월 26일' },
    ],
  )
})

test('학생 수 구간별 단가를 적용한다', () => {
  assert.equal(getUnitPrice(1), 5500)
  assert.equal(getUnitPrice(20), 4950)
  assert.equal(getUnitPrice(30), 4675)
  assert.equal(getUnitPrice(40), 4400)
  assert.equal(getUnitPrice(50), 4125)
  assert.equal(getUnitPrice(51), 3850)
})

test('1명, SECTION 1 결제 금액은 49,000원이다', () => {
  assert.deepEqual(getOrderTotals(1, [1]), {
    count: 1, parts: 1, unit: 5500, bundleRate: 0,
    supply: 44000, shipping: 5000, total: 49000, rounds: 8,
  })
})

test('3명, SECTION 1 결제 금액은 137,000원이다', () => {
  assert.equal(getOrderTotals(3, [1]).total, 137000)
})

test('원장 직접 결제의 SECTION 묶음 할인을 적용한다', () => {
  assert.equal(getOrderTotals(10, [1, 2], 'director').bundleRate, 0.05)
  assert.equal(getOrderTotals(10, [1, 2, 3], 'director').bundleRate, 0.1)
})
