export const PREORDER_NOTIFICATION_ENDPOINT = '/api/preorder'

export function createPreorderNotificationPayload(application) {
  return {
    _subject: `[NABLA 사전예약] ${application.academy} · ${application.quantity}부`,
    _template: 'table',
    _replyto: application.email,
    _honey: '',
    reservation_id: application.id,
    academy: application.academy,
    quantity: `${application.quantity}부`,
    email: application.email,
    director: application.name || '미입력',
    phone: application.phone || '미입력',
    campaign: application.variant === 'a' ? '결제 없는 수량 확보' : application.variant,
    reservation_status: '사전예약 접수',
    submitted_at: application.createdAt,
    source: 'NABLA 9모 반영 사전예약 홈페이지',
  }
}

export async function sendPreorderNotification(application, fetcher = fetch) {
  const response = await fetcher(PREORDER_NOTIFICATION_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !(result.success === true || result.success === 'true')) {
    throw new Error('사전예약 정보를 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }
  return result
}
