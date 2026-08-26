import test from 'node:test'
import assert from 'node:assert/strict'
import { createTrialApplication, validateTrialApplication } from './trial.js'

const valid = {
  director: '홍길동', phone: '010-1234-5678', academy: '퀄럽수학학원',
  email: 'hello@example.com', students: '12', postcode: '06296',
  address: '서울특별시 강남구 논현로30길 7', detail: '4층', agreed: true,
}

test('무료 체험 신청 필수 정보를 검증한다', () => {
  assert.equal(validateTrialApplication(valid), '')
  assert.equal(validateTrialApplication({ ...valid, director: '', phone: '', email: '' }), '')
  assert.match(validateTrialApplication({ ...valid, address: '' }), /필수 정보/)
  assert.match(validateTrialApplication({ ...valid, students: '0' }), /학생 수/)
  assert.match(validateTrialApplication({ ...valid, phone: '1234' }), /연락처/)
})

test('학생 수와 동일한 무료 체험 부수로 접수번호를 생성한다', () => {
  const application = createTrialApplication(valid, new Date('2026-08-25T06:30:12.345Z'))
  assert.equal(application.copies, 12)
  assert.equal(application.applicationId, 'FREE0_20260825_12345')
  assert.equal(application.status, '접수 완료')
})
