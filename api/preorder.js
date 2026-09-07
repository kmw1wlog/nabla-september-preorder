import { createPreorderNotificationPayload } from '../src/preorder-notification.js'

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/nabla1mock@gmail.com'
const ACTIVATED_SITE = 'https://slatiq-mock-academy-concepts.vercel.app'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ success: false, message: 'Method not allowed' })

  const application = request.body || {}
  if (!application.academy || !application.email || !application.quantity || !application.id) {
    return response.status(400).json({ success: false, message: '필수 예약 정보가 없습니다.' })
  }

  const payload = createPreorderNotificationPayload(application)

  try {
    const mailResponse = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: ACTIVATED_SITE,
        Referer: `${ACTIVATED_SITE}/`,
      },
      body: JSON.stringify(payload),
    })
    const result = await mailResponse.json().catch(() => ({}))
    if (!mailResponse.ok || !(result.success === true || result.success === 'true')) {
      return response.status(502).json({ success: false, message: '메일 발송에 실패했습니다.' })
    }
    return response.status(200).json({ success: true })
  } catch {
    return response.status(502).json({ success: false, message: '메일 발송에 실패했습니다.' })
  }
}
