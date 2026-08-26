import test from 'node:test'
import assert from 'node:assert/strict'
import { createTrialNotificationPayload, sendTrialNotification } from './trial-notification.js'

const application = {
  applicationId: 'FREE0_20260826_12345',
  academy: '테스트수학학원',
  director: '',
  phone: '010-1234-5678',
  email: 'director@example.com',
  students: 12,
  copies: 12,
  postcode: '41950',
  address: '대구광역시 중구 명륜로23길 89',
  detail: '남산동',
  request: '',
  submittedAt: '2026-08-26T00:00:00.000Z',
}

test('무료배송 신청 내용을 운영자 이메일용 표로 변환한다', () => {
  const payload = createTrialNotificationPayload(application)
  assert.equal(payload.academy, '테스트수학학원')
  assert.equal(payload.copies, '12부')
  assert.equal(payload.director, '미입력')
  assert.equal(payload.address, '대구광역시 중구 명륜로23길 89 남산동')
  assert.equal(payload._replyto, 'director@example.com')
})

test('이메일 발송 성공 응답을 확인한다', async () => {
  let request
  const fetcher = async (url, options) => {
    request = { url, options }
    return { ok: true, json: async () => ({ success: 'true' }) }
  }
  await sendTrialNotification(application, fetcher)
  assert.match(request.url, /formsubmit\.co/)
  assert.equal(JSON.parse(request.options.body).application_id, application.applicationId)
})

test('발송 실패 시 접수 완료로 처리하지 않는다', async () => {
  const fetcher = async () => ({ ok: false, json: async () => ({ success: false }) })
  await assert.rejects(() => sendTrialNotification(application, fetcher), /전송하지 못했습니다/)
})
