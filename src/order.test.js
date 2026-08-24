import test from 'node:test'
import assert from 'node:assert/strict'
import { getOrderTotals, getUnitPrice } from './order.js'

test('학생 수 구간별 단가를 적용한다', () => {
  assert.equal(getUnitPrice(1), 6000)
  assert.equal(getUnitPrice(20), 5400)
  assert.equal(getUnitPrice(30), 5100)
  assert.equal(getUnitPrice(51), 4200)
})

test('캡처의 1명, PART 1 결제 금액은 53,000원이다', () => {
  assert.deepEqual(getOrderTotals(1, [1]), {
    count: 1, parts: 1, unit: 6000, bundleRate: 0,
    supply: 48000, shipping: 5000, total: 53000, rounds: 8,
  })
})

test('캡처의 3명, PART 1 결제 금액은 149,000원이다', () => {
  assert.equal(getOrderTotals(3, [1]).total, 149000)
})

test('원장 직접 결제의 PART 묶음 할인을 적용한다', () => {
  assert.equal(getOrderTotals(10, [1, 2], 'director').bundleRate, 0.05)
  assert.equal(getOrderTotals(10, [1, 2, 3], 'director').bundleRate, 0.1)
})
