import React, { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { sendPreorderNotification } from './preorder-notification.js'

const products = [
  { id: '1000', name: '1,000제', regular: 990000, price: 690000 },
  { id: '2000', name: '2,000제', regular: 1490000, price: 990000 },
]
const won = (value) => `${value.toLocaleString('ko-KR')}원`

export default function QuestionBank() {
  const [selected, setSelected] = useState('1000')
  const [form, setForm] = useState({ academy: '', email: '', name: '', phone: '', agreed: false })
  const [sending, setSending] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const product = products.find((item) => item.id === selected)
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }))
  async function submit(event) {
    event.preventDefault()
    if (!form.agreed) return setError('사전예약 안내를 위한 개인정보 수집·이용에 동의해 주세요.')
    setSending(true)
    setError('')
    try {
      await sendPreorderNotification({ ...form, id: `BANK-${Date.now().toString(36).toUpperCase()}`, variant: 'question-bank', quantity: product.id, product: product.name, price: product.price, createdAt: new Date().toISOString() })
      setComplete(true)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSending(false)
    }
  }
  return <main className="bank-page">
    <header className="bank-header"><a href="/">∇ NABLA</a><a href="/order">모의고사 단체 구매 <ArrowRight size={16} /></a></header>
    <section className="bank-intro"><span>NABLA QUESTION BANK</span><h1>수학 문제은행<br />사전예약</h1><p>필요한 문항 수를 선택하고, 사전예약가로 준비하세요.</p></section>
    <section className="bank-products" aria-label="문제은행 상품 선택">{products.map((item) => <button type="button" key={item.id} className={`bank-product ${selected === item.id ? 'selected' : ''}`} onClick={() => { setSelected(item.id); setComplete(false) }} aria-pressed={selected === item.id}>
      <span>문제은행</span><h2>{item.name}</h2><p>정가 <del>{won(item.regular)}</del></p><small>사전예약가</small><strong>{won(item.price)}</strong><b>{won(item.regular - item.price)} 할인 · 약 {Math.round((1 - item.price / item.regular) * 100)}%</b><em>{selected === item.id ? '선택됨' : '이 상품 선택'} <ArrowRight size={16} /></em>
    </button>)}</section>
    <section className="bank-reservation">{complete ? <div className="bank-complete"><CheckCircle2 size={36} /><h2>{product.name} 사전예약이 접수되었습니다.</h2><p>입력하신 이메일로 후속 안내를 드립니다. 현재 결제된 금액은 없습니다.</p><button className="campaign-link" onClick={() => setComplete(false)}>다시 신청하기</button></div> : <>
      <h2>선택한 문제은행 예약하기</h2><div className="bank-summary"><b>{product.name}</b><strong>{won(product.price)}</strong></div>
      <form className="campaign-form" onSubmit={submit}>
        <label className="campaign-field"><span>학원·강사명 *</span><input required value={form.academy} onChange={update('academy')} placeholder="학원명 또는 강사명" /></label>
        <label className="campaign-field"><span>안내받을 이메일 *</span><input required type="email" value={form.email} onChange={update('email')} placeholder="name@example.com" /></label>
        <div className="campaign-two"><label className="campaign-field"><span>담당자 성함 <small>선택</small></span><input value={form.name} onChange={update('name')} /></label><label className="campaign-field"><span>연락처 <small>선택</small></span><input type="tel" value={form.phone} onChange={update('phone')} /></label></div>
        <label className="campaign-consent"><input type="checkbox" checked={form.agreed} onChange={(event) => setForm((old) => ({ ...old, agreed: event.target.checked }))} /><span>사전예약 안내를 위해 학원·강사명, 이메일 및 선택 입력 정보를 수집·이용하는 데 동의합니다. 안내 종료 또는 삭제 요청 시 파기합니다.</span></label>
        {error && <p className="campaign-error" role="alert">{error}</p>}
        <button className="campaign-primary" disabled={sending}>{sending ? '예약을 접수하는 중...' : `${product.name} 사전예약 신청`} <ArrowRight size={17} /></button>
        <p className="campaign-note">지금 결제되지 않습니다. 제공 형식·이용 범위·출시 일정은 확정 후 안내드립니다.</p>
      </form>
    </>}</section>
  </main>
}
