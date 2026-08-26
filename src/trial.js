export const TRIAL_STORAGE_KEY = 'campuskit-free-trial-applications'
export const TRIAL_LATEST_KEY = 'campuskit-latest-free-trial'

export function validateTrialApplication(form) {
  const required = ['director', 'academy', 'students', 'address', 'detail']
  if (required.some((key) => !String(form[key] ?? '').trim())) return '필수 정보를 모두 입력해 주세요.'
  if (form.phone && !/^01[016789]-?\d{3,4}-?\d{4}$/.test(form.phone.replace(/\s/g, ''))) return '연락처를 정확히 입력해 주세요.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return '이메일을 정확히 입력해 주세요.'
  const students = Number(form.students)
  if (!Number.isInteger(students) || students < 1 || students > 300) return '고3 학생 수는 1명부터 300명까지 입력해 주세요.'
  if (!form.agreed) return '개인정보 수집·이용에 동의해 주세요.'
  return ''
}

export function createTrialApplication(form, now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = String(now.getTime()).slice(-5)
  return {
    ...form,
    students: Number(form.students),
    copies: Number(form.students),
    applicationId: `FREE0_${date}_${suffix}`,
    status: '접수 완료',
    submittedAt: now.toISOString(),
  }
}

export function saveTrialApplication(application, storage = window.localStorage) {
  const previous = JSON.parse(storage.getItem(TRIAL_STORAGE_KEY) || '[]')
  storage.setItem(TRIAL_STORAGE_KEY, JSON.stringify([...previous, application]))
  storage.setItem(TRIAL_LATEST_KEY, JSON.stringify(application))
}

export function loadLatestTrialApplication(storage = window.localStorage) {
  try { return JSON.parse(storage.getItem(TRIAL_LATEST_KEY) || 'null') } catch { return null }
}
