import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowRight, Box, Building2, CalendarDays, Check, CheckCircle2, ChevronRight,
  ClipboardList, Copy, CreditCard, Lightbulb, Mail, MapPin, MessageCircle,
  ReceiptText, Search, WalletCards, X,
} from 'lucide-react'
import { formatWon, getOrderTotals, SECTIONS, PRICE_TIERS } from './order.js'
import { createTrialApplication, loadLatestTrialApplication, saveTrialApplication, validateTrialApplication } from './trial.js'
import './styles.css'

const Field = ({ label, required, className = '', ...props }) => (
  <label className={`field ${className}`}>
    <span>{label}{required && <b> *</b>}</span>
    <input {...props} />
  </label>
)

const StepHeader = ({ number, title, note }) => (
  <div className="step-header">
    <div className="step-title"><span>{number}</span><h2>{title}</h2></div>
    {note && <p>{note}</p>}
  </div>
)

function Logo({ footer = false }) {
  return (
    <div className={footer ? 'slatiq-logo footer-logo' : 'slatiq-logo'} aria-label="SLATIQ MOCK">
      <img src="/assets/slatiq-logo.png" alt="SLATIQ" />
      {!footer && <strong>MOCK</strong>}
    </div>
  )
}

function Sidebar({ totals, selectedParts, paymentType, onStatus }) {
  return (
    <aside className="sidebar">
      <div className="deco deco-one" /><div className="deco deco-two" /><div className="grid-deco" />
      <div className="side-content">
        <Logo />
        <div className="summary-title"><span>◆&nbsp; ORDER SUMMARY</span><h1>결제 <em>내역 확인</em></h1></div>
        <section className="dark-card pay-summary">
          <h3>결제 금액</h3>
          <div className="pay-row"><span>적용 단가</span><strong>{totals.unit ? `${formatWon(totals.unit)}원` : '—'}</strong></div>
          <div className="pay-row"><span>고3 학생 수</span><strong>{totals.count ? `${totals.count}명` : '—'}</strong></div>
          <div className="pay-row"><span>선택 SECTION</span><strong>{totals.parts ? `${totals.parts}개` : '—'}</strong></div>
          <div className="pay-row"><span>총 회차</span><strong>{totals.rounds ? `${totals.rounds}회` : '—'}</strong></div>
          <div className="pay-row divided"><span>공급가액</span><strong>{formatWon(totals.supply)}원</strong></div>
          <div className="pay-row"><span>배송비</span><strong>{totals.shipping ? `${formatWon(totals.shipping)}원` : totals.parts ? '무료' : '—'}</strong></div>
        </section>
        <section className="dark-card deadlines">
          <h3><CalendarDays size={14} /> SECTION별 주문 마감일</h3>
          <div className="part-lines">
            {SECTIONS.map((part) => <div key={part.id} className={selectedParts.includes(part.id) ? 'active' : ''}>
              <b>{part.label}</b><span><strong>{part.orderBy}</strong><small>{part.rounds} · {part.ship} 일괄 배송</small></span>
            </div>)}
          </div>
          <p className="deadline-note">⚠ 각 SECTION별 마감일 이후 주문은 별도 문의 바랍니다</p>
        </section>
        <section className="total-card">
          <div><span>결제 예정 금액</span><small>{paymentType ? paymentType === 'director' ? '원장결제' : '개별결제' : '미선택'}</small></div>
          <strong>{formatWon(totals.total)}<em>원</em></strong>
          <p>{totals.parts ? `선택 ${totals.parts}개 SECTION 전체 금액` : 'SECTION과 결제 방식을 선택하면 최종 금액이 계산됩니다.'}</p>
        </section>
        <button className="status-link" onClick={onStatus}><span>📋</span><div><small>ORDER STATUS</small><b>내 주문 상태 확인하기</b></div><ChevronRight size={18} /></button>
        <footer>
          <Logo footer />
          <p><b>상호</b>&nbsp; RYUL　 <b>대표자</b>&nbsp; 허건행</p>
          <p><b>개인정보보호책임자</b>&nbsp; 허건행</p>
          <p><b>주소</b>&nbsp; 대구광역시 중구 명륜로23길 89 (남산동)</p>
          <small>© 2026 RYUL · SLATIQ MOCK</small>
        </footer>
      </div>
    </aside>
  )
}

function AcademySection({ form, setForm }) {
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }))
  return <section className="panel academy-panel"><StepHeader number="1" title="학원 정보" />
    <div className="two-col">
      <Field label="원장님" required placeholder="홍길동" value={form.director} onChange={update('director')} />
      <Field label="연락처" required placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
    </div>
    <Field label="학원명" required placeholder="SLATIQ 수학학원" value={form.academy} onChange={update('academy')} />
    <Field label="이메일" required type="email" placeholder="name@example.com" value={form.email} onChange={update('email')} />
  </section>
}

function AddressSection({ form, setForm }) {
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }))
  const search = () => setForm((old) => ({ ...old, address: '대구광역시 중구 명륜로23길 89', postcode: '41963' }))
  return <section className="panel address-panel"><StepHeader number="2" title="배송지" note="학원 직배송" />
    <div className="address-search"><input readOnly placeholder="도로명 주소를 검색해주세요 (버튼 클릭)" value={form.address} /><button onClick={search}><Search size={16} /> 주소 검색</button></div>
    <div className="address-detail"><input readOnly placeholder="우편번호" value={form.postcode} /><input placeholder="상세 주소 (동, 호수)" value={form.detail} onChange={update('detail')} /></div>
    <div className="info-alert"><Box size={18} /><span><b>정확한 배송을 위해 우편번호가 필요합니다.</b> 주소 검색 버튼을 이용해 주세요.</span></div>
    <div className="shipping-info">
      <div><span>배송 방식</span><p>택배 · 학원 주소 직배송</p></div>
      <div><span>배송비</span><p>10부 이하 <b>1회 5,000원</b> · <b>11부 이상 무료</b><small>제주·도서산간 +5,000원 (배송 1회당 10,000원)</small></p></div>
      <div><span>배송일</span><p>SECTION별 <b>일괄 출고일</b>에 맞춰 발송<small>SECTION 1 → 9/14 · SECTION 2 → 10/5 · SECTION 3 → 10/26</small></p></div>
    </div>
  </section>
}

function OrderSection({ students, setStudents, selectedParts, setSelectedParts, totals }) {
  const togglePart = (id) => setSelectedParts((current) => {
    if (current.includes(id)) return current.filter((item) => item < id)
    if (id > 1 && !current.includes(id - 1)) return current
    return [...current, id].sort()
  })
  const tier = PRICE_TIERS.find((item) => totals.count >= item.min && totals.count <= item.max)
  return <section className="panel order-panel"><StepHeader number="3" title="주문 내역" note="학생 수 구간별 단가 자동 적용" />
    <div className="order-grid">
      <div>
        <label className="field"><span>고3 학생 수 <b>*</b></span><input type="number" min="1" placeholder="예: 25" value={students} onChange={(event) => setStudents(event.target.value)} /></label>
        {tier && <div className="tier-current"><span>i</span><b>{tier.label}</b> · 기본 단가 · <strong>{formatWon(tier.unit)}원/부</strong></div>}
        <div className="price-table"><h3>학생 수별 단가표</h3>{PRICE_TIERS.map((row) => <div key={row.label} className={tier?.label === row.label ? 'active' : ''}><span>{row.label}</span><em>{row.discount}</em><b>{formatWon(row.unit)}원{row.max === Infinity ? '~' : ''}</b></div>)}</div>
      </div>
      <div className="parts-column">
        <h3>SECTION 선택 <b>*</b> <span>1 → 2 → 3 순서 · 추가 할인 적용</span></h3>
        <div className="part-select">{SECTIONS.map((part) => <button key={part.id} disabled={part.id > 1 && !selectedParts.includes(part.id - 1)} className={selectedParts.includes(part.id) ? 'selected' : ''} onClick={() => togglePart(part.id)}>
          <b>{part.label}</b><strong>{part.rounds}</strong><small>{part.ship} 발송</small>{selectedParts.includes(part.id) && <Check size={16} />}
        </button>)}</div>
        <div className="discount-tip"><Lightbulb size={18} /><p><b>SECTION 1+2 또는 2+3 일괄 구매 시 5%, SECTION 1+2+3 전체 일괄 구매 시 10%</b><small>추가 할인 (원장 직접 결제 한정)</small></p></div>
        <div className="selection-summary"><h4>선택 요약</h4><div><span>선택 SECTION<strong>{totals.parts}<small>개</small></strong></span><span>총 회차<strong>{totals.rounds}<small>회</small></strong></span><span>배송 횟수<strong>{totals.parts}<small>회</small></strong></span></div>
          {totals.parts ? <p>📦 예상 출고일: {selectedParts.map((id) => `${SECTIONS[id - 1].label} (${SECTIONS[id - 1].ship} 출고)`).join(' · ')}</p> : <p>SECTION을 선택하면 상세 스케줄이 표시됩니다.</p>}
        </div>
      </div>
    </div>
  </section>
}

function PaymentSection({ paymentType, setPaymentType, method, setMethod, students }) {
  return <section className="panel payment-panel"><StepHeader number="4" title="결제 방식" />
    <div className="payment-types">
      <button className={paymentType === 'director' ? 'selected' : ''} onClick={() => setPaymentType('director')}><b>원장 직접 결제</b><span>전체 금액 일괄 결제</span></button>
      <button disabled={Number(students) < 15} className={paymentType === 'student' ? 'selected' : ''} onClick={() => setPaymentType('student')}><b>학생 개별 결제 <small>15명 이상</small></b><span>보증금 + 학부모 링크</span></button>
    </div>
    <h3>결제 수단 <b>*</b></h3>
    <div className="methods">
      <button className={method === 'card' ? 'selected' : ''} onClick={() => { setPaymentType('director'); setMethod('card') }}><CreditCard size={20} /><p><b>카드 결제</b><span>즉시 결제 · 계산서 없음</span></p></button>
      <button disabled><Building2 size={20} /><p><b>무통장 입금</b><span>추후 오픈 예정</span></p></button>
    </div>
  </section>
}

function RequestSection({ request, setRequest }) {
  return <section className="panel request-panel"><StepHeader number="5" title="요청사항" />
    <label>요청사항 <span>(선택)</span><textarea placeholder="배송 시기 협의 · 기타 요청사항" value={request} onChange={(event) => setRequest(event.target.value)} /></label>
  </section>
}

function CardModal({ amount, onClose, onComplete }) {
  const [agreed, setAgreed] = useState(false)
  const [card, setCard] = useState('')
  const cards = ['비씨카드', '삼성카드', 'KB국민', '신한카드', '농협(NH페이)', '하나Pay(하나)', '현대카드', '롯데카드', '우리카드']
  return <div className="modal-backdrop pg-backdrop" onMouseDown={onClose}><div className="modal card-modal" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-title"><h2>카드 결제</h2><button onClick={onClose}><X /></button></div>
    <div className="pg-layout"><aside><button className="active">신용카드</button><div><b>통합인증</b><span>서비스</span></div></aside>
      <main><header><strong>KG 이니시스</strong><span>안전하고 편리한 이니시스결제입니다.</span></header>
        <label className="terms"><b>이용약관</b><span><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /> 전체동의</span></label>
        <div className="terms-lines">전자금융거래 이용약관　 □ 동의<br />개인정보의 수집 및 이용안내　 □ 동의</div>
        <div className="card-grid">{cards.map((name) => <button key={name} className={card === name ? 'selected' : ''} onClick={() => setCard(name)}>{name}</button>)}</div>
        <p className="pg-note">카드사별 무이자 할부 가능 개월 수 상이<br /><b>무이자 할부 제외 대상: 개인사업자, 법인, 체크, GIFT, 선불, 은행계열 카드</b></p>
      </main>
      <section><h3>KG 이니시스</h3><dl><dt>상품명</dt><dd>SLATIQ MOCK 결제</dd><dt>상품가격</dt><dd>{formatWon(amount)} 원</dd><dt>결제금액</dt><dd>{formatWon(amount)} 원</dd></dl><button disabled={!agreed || !card} onClick={onComplete}>다음</button></section>
    </div>
  </div></div>
}

function StatusModal({ onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal status-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-title"><h2>내 주문 상태 확인</h2><button onClick={onClose}><X /></button></div><div className="status-body"><ClipboardList size={40} /><h3>주문번호 또는 연락처로 확인하세요</h3><input placeholder="주문번호 입력" /><input placeholder="원장님 연락처 입력" /><button>주문 조회</button></div></div></div>
}

const CONCEPTS = {
  edition: {
    tab: 'A · EDITION', eyebrow: 'LIMITED ACADEMY EDITION · 00',
    title: <>수업 전에 먼저 펼쳐지는<br /><em>한 회의 설계.</em></>,
    description: <><strong>문제지·단계형 해설·강사용 자료</strong>를 한 패키지로 구성했습니다.<br />SLATIQ MOCK 00으로 정규 SECTION의 수업 흐름을 먼저 확인해 보세요.</>,
    visual: 'edition', caption: 'ORACLE 00 · PRELUDE', captionSub: '학원 체험용 패키지',
  },
  proof: {
    tab: 'B · PROOF', eyebrow: 'THE SOLUTION IS THE PRODUCT',
    title: <>정답이 아니라<br /><em>풀이의 구조를 제공합니다.</em></>,
    description: <>조건 해석에서 구조 발견, 계산 정리까지.<br /><strong>학생이 다시 따라갈 수 있는 단계형 해설</strong>을 실제 지면으로 확인하세요.</>,
    visual: 'proof', caption: 'STEP-BY-STEP SOLUTION', captionSub: '수업에 바로 쓰는 해설 설계',
  },
  system: {
    tab: 'C · SYSTEM', eyebrow: 'ONE MOCK · THREE LAYERS',
    title: <>시험지에서 수업까지<br /><em>한 번에 이어집니다.</em></>,
    description: <><strong>실전 문제지, 단계형 해설, 패키지 표지.</strong><br />한 회분의 경험을 세 개의 지면으로 먼저 살펴보세요.</>,
    visual: 'system', caption: 'PAPER · SOLUTION · PACKAGE', captionSub: 'SLATIQ MOCK 00 체험 구성',
  },
}

function ConceptVisual({ type }) {
  if (type === 'edition') return <div className="concept-visual edition-visual"><img src="/assets/oracle-00-cover.webp" alt="ORACLE 00 포장 표지" /></div>
  if (type === 'proof') return <div className="concept-visual proof-visual"><img src="/assets/solution-sample.jpg" alt="SLATIQ 단계형 해설 예시" /></div>
  return <div className="concept-visual system-visual">
    <img className="layer cover-layer" src="/assets/oracle-00-cover.webp" alt="ORACLE 00 포장 표지" />
    <img className="layer paper-layer" src="/assets/paper-sample.webp" alt="SLATIQ 모의고사 예시" />
    <img className="layer solution-layer" src="/assets/solution-sample.jpg" alt="SLATIQ 해설 예시" />
  </div>
}

function TrialLanding({ onApply }) {
  const initialConcept = new URLSearchParams(window.location.search).get('concept')
  const [conceptKey, setConceptKey] = useState(CONCEPTS[initialConcept] ? initialConcept : 'system')
  const concept = CONCEPTS[conceptKey]
  const [form, setForm] = useState({
    director: '', phone: '', academy: '', email: '', students: '',
    postcode: '', address: '', detail: '', request: '', agreed: false,
  })
  const [submitted, setSubmitted] = useState(null)
  const [error, setError] = useState('')
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }))

  const searchAddress = () => {
    if (!window.daum?.Postcode) {
      setError('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      return
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        const address = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress
        setForm((old) => ({ ...old, postcode: data.zonecode, address }))
        setError('')
      },
    }).open()
  }

  const submit = (event) => {
    event.preventDefault()
    const message = validateTrialApplication(form)
    if (message) return setError(message)
    const application = createTrialApplication(form)
    saveTrialApplication(application)
    setSubmitted(application)
    setError('')
    requestAnimationFrame(() => document.querySelector('.trial-form-side')?.scrollTo({ top: 0 }))
  }

  const selectConcept = (key) => {
    setConceptKey(key)
    const url = new URL(window.location.href)
    url.searchParams.set('concept', key)
    window.history.replaceState({}, '', url)
  }

  return <main className={`trial-page concept-${conceptKey}`}>
    <section className="trial-hero">
      <div className="trial-circles" aria-hidden="true">
        <i className="trial-circle tc-1" /><i className="trial-circle tc-2" />
        <i className="trial-circle tc-3" /><i className="trial-circle tc-4" />
        <i className="trial-circle tc-5" /><i className="trial-circle tc-6" />
      </div>
      <div className="trial-top-logo">
        <img src="/assets/slatiq-logo.png" alt="SLATIQ" />
      </div>
      <nav className="concept-switcher" aria-label="첫 화면 시안 선택">
        {Object.entries(CONCEPTS).map(([key, item]) => <button key={key} className={conceptKey === key ? 'active' : ''} onClick={() => selectConcept(key)}>{item.tab}</button>)}
      </nav>
      <ConceptVisual type={concept.visual} />
      <div className="trial-copy">
        <p className="trial-eyebrow">{concept.eyebrow}</p>
        <h1>{concept.title}</h1>
        <p className="trial-description">{concept.description}</p>
        <div className="visual-caption"><b>{concept.caption}</b><span>{concept.captionSub}</span></div>
        <p className="trial-limit">1,800부 한정 · 8.21–8.30 · 학원 원장님 대상</p>
      </div>
    </section>
    <section className="trial-form-side">
      {submitted ? <div className="trial-success">
        <div className="success-icon"><Check size={28} /></div>
        <span className="success-kicker">FREE TRIAL APPLICATION</span>
        <h2>SLATIQ MOCK 00 체험 신청이<br />접수되었습니다.</h2>
        <p>{submitted.academy}의 고3 학생 <b>{submitted.students}명</b>을 위한<br /><b>{submitted.copies}부</b>가 학원 주소로 무료배송됩니다.</p>
        <dl>
          <div><dt>접수번호</dt><dd>{submitted.applicationId}</dd></div>
          <div><dt>받는 분</dt><dd>{submitted.director} 원장님</dd></div>
          <div><dt>배송지</dt><dd>({submitted.postcode}) {submitted.address} {submitted.detail}</dd></div>
        </dl>
        <div className="part1-conversion">
          <span>0회차 다음 단계</span>
          <h3>SECTION 1 · 1~8회차 모의고사</h3>
          <p>체험 수업의 흐름을 그대로 이어가세요.<br />학생 수 구간별 할인과 묶음 배송이 자동 적용됩니다.</p>
        </div>
        <button className="trial-apply" onClick={() => onApply(submitted)}>SECTION 1 모의고사 도입하기 <ArrowRight size={17} /></button>
        <button className="trial-secondary" onClick={() => setSubmitted(null)}>신청 내용 다시 보기</button>
      </div> : <div className="trial-form-wrap">
        <div className="trial-form-heading">
          <div><span>학원 원장님 전용</span><b>0원 · 무료배송</b></div>
          <h2>SLATIQ MOCK 00 · 학원 체험 신청</h2>
          <p>실전 문제지와 단계형 해설을 학원에서 먼저 확인해 보세요.</p>
        </div>
        <form className="trial-application-form" onSubmit={submit}>
          <div className="trial-form-grid">
            <Field label="원장님" required placeholder="홍길동" value={form.director} onChange={update('director')} />
            <Field label="연락처" required placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
          </div>
          <Field label="학원명" required placeholder="SLATIQ 수학학원" value={form.academy} onChange={update('academy')} />
          <Field label="이메일" required type="email" placeholder="name@example.com" value={form.email} onChange={update('email')} />
          <label className="field trial-students"><span>고3 학생 수 <b>*</b><small>신청 부수와 동일</small></span><div><input type="number" min="1" max="300" placeholder="예: 25" value={form.students} onChange={update('students')} /><strong>{Number(form.students) > 0 ? `${form.students}부 무료` : '0부'}</strong></div></label>
          <label className="field"><span>배송지 <b>*</b><small>학원 주소로 무료배송</small></span><div className="trial-address-search"><input readOnly placeholder="주소 검색 버튼을 눌러주세요" value={form.address} /><button type="button" onClick={searchAddress}><MapPin size={15} /> 주소 검색</button></div></label>
          <div className="trial-form-grid address-row"><input readOnly placeholder="우편번호" value={form.postcode} /><input placeholder="상세 주소 (동, 호수)" value={form.detail} onChange={update('detail')} /></div>
          <label className="field trial-request"><span>요청사항 <small>선택</small></span><textarea placeholder="배송 관련 요청사항을 입력해 주세요." value={form.request} onChange={update('request')} /></label>
          <div className="part1-preview"><div><span>체험 다음의 정규 운영</span><b>SECTION 1 · 1~8회차</b></div><p>같은 해설 구조와 수업 흐름으로<br />정규 회차를 이어갈 수 있습니다.</p></div>
          <label className="trial-consent"><input type="checkbox" checked={form.agreed} onChange={(event) => setForm((old) => ({ ...old, agreed: event.target.checked }))} /><span>무료 체험 배송을 위한 개인정보 수집·이용에 동의합니다. <u>자세히</u></span></label>
          {error && <p className="trial-error">{error}</p>}
          <button className="trial-submit" type="submit">학원 체험본 신청하기 <ArrowRight size={17} /></button>
        </form>
      </div>}
    </section>
  </main>
}

function App() {
  const orderPrefill = new URLSearchParams(window.location.search).get('from') === 'trial' ? loadLatestTrialApplication() : null
  const [form, setForm] = useState(() => orderPrefill ? {
    director: orderPrefill.director, phone: orderPrefill.phone, academy: orderPrefill.academy,
    email: orderPrefill.email, address: orderPrefill.address, postcode: orderPrefill.postcode, detail: orderPrefill.detail,
  } : { director: '', phone: '', academy: '', email: '', address: '', postcode: '', detail: '' })
  const [students, setStudents] = useState(() => orderPrefill ? String(orderPrefill.students) : '')
  const [selectedParts, setSelectedParts] = useState(() => orderPrefill ? [1] : [])
  const [paymentType, setPaymentType] = useState('')
  const [method, setMethod] = useState('')
  const [request, setRequest] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [modal, setModal] = useState('')
  const [notice, setNotice] = useState('')
  const totals = useMemo(() => getOrderTotals(Number(students), selectedParts, paymentType), [students, selectedParts, paymentType])

  const pay = () => {
    if (!totals.count || !totals.parts) return setNotice('학생 수와 SECTION을 먼저 선택해 주세요.')
    if (!paymentType || !method) return setNotice('결제 방식과 결제 수단을 선택해 주세요.')
    if (!agreed) return setNotice('개인정보 수집·이용 및 결제에 동의해 주세요.')
    setModal('card')
  }

  return <div className="app-shell">
    <Sidebar totals={totals} selectedParts={selectedParts} paymentType={paymentType} onStatus={() => setModal('status')} />
    <main className="main-area">
      <header className="page-header"><div><h1>MOCK 결제 신청</h1><p>선택한 SECTION의 일괄 출고일에 맞춰 학원으로 배송됩니다.</p></div><div><span>1,800부 한정 · 8.21–8.30</span><b>8회차 묶음 배송</b></div></header>
      <div className="form-scroll"><div className="form-grid">
        <AcademySection form={form} setForm={setForm} />
        <AddressSection form={form} setForm={setForm} />
        <OrderSection students={students} setStudents={setStudents} selectedParts={selectedParts} setSelectedParts={setSelectedParts} totals={totals} />
        <PaymentSection students={students} paymentType={paymentType} setPaymentType={setPaymentType} method={method} setMethod={setMethod} />
        <RequestSection request={request} setRequest={setRequest} />
      </div></div>
      <div className="checkout-bar"><div className="checkout-info"><span>결제 예정 금액</span><strong>{formatWon(totals.total)}<small>원</small></strong><em>{paymentType ? paymentType === 'director' ? '원장결제' : '개별결제' : '미선택'}</em><label><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /> 개인정보 수집·이용 및 결제에 동의합니다 <u>자세히</u></label></div><div className="checkout-actions"><button className="kakao" onClick={() => setNotice('카카오톡 상담 연결 데모입니다.')}><MessageCircle size={18} /> 문의</button><button className="pay-button" onClick={pay}>결제하기 <ArrowRight size={18} /></button></div></div>
    </main>
    {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<button><X size={15} /></button></div>}
    {modal === 'card' && <CardModal amount={totals.total} onClose={() => setModal('')} onComplete={() => { setModal(''); setNotice('카드 결제가 완료되었습니다.') }} />}
    {modal === 'status' && <StatusModal onClose={() => setModal('')} />}
  </div>
}

function RootApp() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    document.title = path === '/order' ? 'SLATIQ MOCK 주문, 결제' : 'SLATIQ MOCK 0회차 무료 체험'
    return () => window.removeEventListener('popstate', handlePopState)
  }, [path])

  const openOrder = (application) => {
    window.history.pushState({}, '', application ? '/order?from=trial' : '/order')
    setPath('/order')
    window.scrollTo(0, 0)
  }

  return path === '/order' ? <App /> : <TrialLanding onApply={openOrder} />
}

createRoot(document.getElementById('root')).render(<RootApp />)
