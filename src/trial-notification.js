export const TRIAL_NOTIFICATION_ENDPOINT = 'https://formsubmit.co/ajax/nabla1mock@gmail.com'

export function createTrialNotificationPayload(application) {
  return {
    _subject: `[SLATIQ MOCK 00] 무료배송 신청 · ${application.academy}`,
    _template: 'table',
    _replyto: application.email || '',
    _honey: '',
    application_id: application.applicationId,
    academy: application.academy,
    director: application.director || '미입력',
    phone: application.phone || '미입력',
    email: application.email || '미입력',
    students: `${application.students}명`,
    copies: `${application.copies}부`,
    postcode: application.postcode,
    address: `${application.address} ${application.detail}`.trim(),
    request: application.request || '없음',
    privacy_consent: '동의',
    application_source: 'SLATIQ MOCK 00 학원 무료배송 홈페이지',
    submitted_at: application.submittedAt,
  }
}

export async function sendTrialNotification(application, fetcher = fetch) {
  const response = await fetcher(TRIAL_NOTIFICATION_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createTrialNotificationPayload(application)),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !(result.success === true || result.success === 'true')) {
    throw new Error('신청 정보를 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }
  return result
}
