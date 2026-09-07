import test from 'node:test'
import assert from 'node:assert/strict'
import { createPreorderNotificationPayload, sendPreorderNotification } from './preorder-notification.js'

const reservation = {
  id: 'SEP-TEST01', academy: '테스트 수학학원', quantity: '8',
  email: 'director@example.com', name: '홍길동', phone: '010-1234-5678',
  variant: 'a', createdAt: '2026-09-07T07:30:00.000Z',
}

test('사전예약 신청 내용을 운영자 이메일용 표로 변환한다', () => {
  const payload = createPreorderNotificationPayload(reservation)
  assert.equal(payload._subject, '[NABLA 사전예약] 테스트 수학학원 · 8부')
  assert.equal(payload.reservation_id, 'SEP-TEST01')
  assert.equal(payload.quantity, '8부')
  assert.equal(payload._replyto, 'director@example.com')
})

test('사전예약 이메일 발송 성공 응답을 확인한다', async () => {
  let sent
  const fetcher = async (url, options) => {
    sent = { url, options }
    return { ok: true, json: async () => ({ success: 'true' }) }
  }
  await sendPreorderNotification(reservation, fetcher)
  assert.match(sent.url, /nabla1mock@gmail\.com$/)
  assert.equal(JSON.parse(sent.options.body).academy, '테스트 수학학원')
})

test('사전예약 이메일 발송 실패 시 접수 완료로 처리하지 않는다', async () => {
  const fetcher = async () => ({ ok: true, json: async () => ({ success: 'false' }) })
  await assert.rejects(() => sendPreorderNotification(reservation, fetcher), /전송하지 못했습니다/)
})
