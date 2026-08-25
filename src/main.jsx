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
          <p><b>대표자</b>&nbsp; 진주환　 <b>개인정보보호책임자</b>&nbsp; 진주환</p>
          <p><b>주소</b>&nbsp; 서울특별시 강남구 논현로30길 7, 4층</p>
          <p><b>전화</b>&nbsp; 010-3099-6400　·　<b>E-mail</b>&nbsp; ceo@qulup.co.kr</p>
          <p><b>사업자등록번호</b>&nbsp; 285-88-02854</p>
          <p><b>통신판매업</b>&nbsp; 2024-서울강남-05785</p>
          <small>© 2026 QULUP · Specialized in Mathematic contents</small>
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
    <Field label="학원명" required placeholder="퀄럽수학학원" value={form.academy} onChange={update('academy')} />
    <Field label="이메일" required type="email" placeholder="name@example.com" value={form.email} onChange={update('email')} />
  </section>
}

function AddressSection({ form, setForm }) {
  const update = (key) => (event) => setForm((old) => ({ ...old, [key]: event.target.value }))
  const search = () => setForm((old) => ({ ...old, address: '서울특별시 강남구 논현로30길 7', postcode: '06296' }))
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
      <button className={method === 'bank' ? 'selected' : ''} onClick={() => { setPaymentType('director'); setMethod('bank') }}><Building2 size={20} /><p><b>계좌이체</b><span>계산서 발급 가능</span></p></button>
    </div>
  </section>
}

function RequestSection({ request, setRequest, method, onInvoice, invoice }) {
  return <section className="panel request-panel"><StepHeader number="5" title="요청사항 · 계산서" note={method === 'bank' ? '계좌이체 · 계산서 발급 가능' : ''} />
    <label>요청사항 <span>(선택)</span><textarea placeholder="배송 시기 협의 · 기타 요청사항" value={request} onChange={(event) => setRequest(event.target.value)} /></label>
    <label>계산서 <span>({method === 'bank' ? '필수' : '계좌이체 시'})</span></label>
    <button className={`invoice-box ${method === 'bank' ? 'enabled' : ''}`} disabled={method !== 'bank'} onClick={onInvoice}>
      {method === 'bank' ? invoice ? <><CheckCircle2 size={22} /><span><b>{invoice.company}</b> 계산서 정보 입력 완료</span></> : <><span>＋</span> 계산서 정보 입력 (필수)</> : '결제 방식 선택 후 이용 가능'}
    </button>
  </section>
}

function InvoiceModal({ initial, onClose, onSave }) {
  const [data, setData] = useState(initial || { company: '', registration: '', ceo: '', taxEmail: '', business: '', category: '' })
  const update = (key) => (event) => setData((old) => ({ ...old, [key]: event.target.value }))
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal invoice-modal" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-title"><h2>계산서 정보</h2><button onClick={onClose}><X /></button></div>
    <div className="invoice-body"><p>SLATIQ MOCK은 <b>주식회사 퀄럽이 정식 출판하는 출판물</b>로, 부가가치세법 제26조 제1항 제8호에 따라 면세 대상입니다. 따라서 <b>세금계산서가 아닌 (면세) 계산서</b>가 발행됩니다.</p>
      <div className="invoice-fields">
        <Field label="상호" required placeholder="주식회사 퀄럽" value={data.company} onChange={update('company')} />
        <Field label="사업자등록번호" required placeholder="000-00-00000" value={data.registration} onChange={update('registration')} />
        <Field label="대표자명" required placeholder="홍길동" value={data.ceo} onChange={update('ceo')} />
        <Field label="수신 이메일" required placeholder="tax@example.com" value={data.taxEmail} onChange={update('taxEmail')} />
        <Field label="업태 (선택)" placeholder="교육 서비스업" value={data.business} onChange={update('business')} />
        <Field label="종목 (선택)" placeholder="학원" value={data.category} onChange={update('category')} />
      </div>
    </div>
    <div className="modal-actions"><button onClick={onClose}>취소</button><button className="primary" onClick={() => onSave(data)}>저장</button></div>
  </div></div>
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

function BankComplete({ amount, form, onClose }) {
  const copy = (value) => navigator.clipboard?.writeText(value)
  return <div className="modal-backdrop bank-backdrop"><div className="bank-receipt">
    <div className="receipt-head"><span>1</span><div><h2>주문이 접수되었습니다</h2><p>입금 확인 후 지정 발송일에 배송을 시작합니다.</p></div><div><small>주문번호</small><b>MOCK{form.director || 'Order'}_20260824</b></div></div>
    <hr />
    <div className="bank-title"><span>2</span><h3>입금 계좌 안내</h3><em>💡 08월 25일까지 입금</em></div>
    <div className="bank-table">
      <div><span>입금 계좌</span><p><b>IBK기업은행</b><strong>448-055537-04-014</strong><button onClick={() => copy('448-055537-04-014')}>복사</button></p></div>
      <div><span>예금주</span><p>주식회사 퀄럽</p></div>
      <div><span>입금자명</span><p className="payer"><b>◉ 학원명 <strong>{form.academy || '퀄럽수학학원'}</strong></b><b>○ 원장 성함 <strong>{form.director || '홍길동'}</strong></b></p></div>
      <div><span>입금액</span><p><strong className="bank-amount">{formatWon(amount)}원</strong><button onClick={() => copy(String(amount))}>복사</button></p></div>
    </div>
    <div className="bank-title guide"><span>3</span><h3>입금 안내 받기</h3><small>나중에 확인할 수 있도록 알림을 받아보세요</small></div>
    <div className="notify-options"><button><i>💬</i><b>카카오 알림톡<small>{form.phone || '010-****-4352'}</small></b><CheckCircle2 /></button><button><i>✉️</i><b>이메일로 받기<small>{form.email || 'ab***@gmail.com'}</small></b><CheckCircle2 /></button></div>
    <div className="next-guide"><h4>📅 앞으로의 진행 순서</h4><ol><li>원장님이 위 계좌로 입금 (선택하신 알림으로도 계좌 정보 발송)</li><li>QULUP에서 <b>입금 확인</b> (영업일 1일 이내)</li><li>인쇄 준비 후 지정 <b>발송일에 발송</b></li><li>배송 출발 시 <b>운송장 번호 알림톡 발송</b></li><li>계산서는 발송 완료 후 <b>이메일로 전송</b></li></ol></div>
    <button className="receipt-close" onClick={onClose}>접수 확인</button>
  </div></div>
}

function StatusModal({ onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal status-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-title"><h2>내 주문 상태 확인</h2><button onClick={onClose}><X /></button></div><div className="status-body"><ClipboardList size={40} /><h3>주문번호 또는 연락처로 확인하세요</h3><input placeholder="주문번호 입력" /><input placeholder="원장님 연락처 입력" /><button>주문 조회</button></div></div></div>
}

function TrialLanding({ onApply }) {
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

  return <main className="trial-page">
    <section className="trial-hero">
      <div className="trial-circles" aria-hidden="true">
        <i className="trial-circle tc-1" /><i className="trial-circle tc-2" />
        <i className="trial-circle tc-3" /><i className="trial-circle tc-4" />
        <i className="trial-circle tc-5" /><i className="trial-circle tc-6" />
      </div>
      <div className="trial-top-logo">
        <img src="/assets/slatiq-logo.png" alt="SLATIQ" />
      </div>
      <div className="trial-copy">
        <p className="trial-eyebrow">FREE TRIAL · 0회차 무료 체험</p>
        <h1>2027 수능 대비<br /><em>SLATIQ MOCK 0회차</em><br />무료로 받아보세요</h1>
        <p className="trial-description"><strong>0회차 체험본</strong>을 무료로 보내드립니다.<br />선택 27번 포함 4점 전체 문제지 + 해설지 + 모의고사로 구성되어<br />받는 즉시 수업에 활용하실 수 있습니다.</p>
        <p className="trial-limit">⚡ 1,800부 한정판　·　8.21–8.30 선착순　·　학원 원장님 전용</p>
      </div>
      <div className="trial-bottom-logo"><img src="/assets/slatiq-logo.png" alt="SLATIQ" /></div>
    </section>
    <section className="trial-form-side">
      {submitted ? <div className="trial-success">
        <div className="success-icon"><Check size={28} /></div>
        <span className="success-kicker">FREE TRIAL APPLICATION</span>
        <h2>0회차 무료배송 신청이<br />접수되었습니다.</h2>
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
          <h2>0회차 무료 체험 신청</h2>
          <p>고3 학생 수만큼 체험본을 학원으로 보내드립니다.</p>
        </div>
        <form className="trial-application-form" onSubmit={submit}>
          <div className="trial-form-grid">
            <Field label="원장님" required placeholder="홍길동" value={form.director} onChange={update('director')} />
            <Field label="연락처" required placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
          </div>
          <Field label="학원명" required placeholder="퀄럽수학학원" value={form.academy} onChange={update('academy')} />
          <Field label="이메일" required type="email" placeholder="name@example.com" value={form.email} onChange={update('email')} />
          <label className="field trial-students"><span>고3 학생 수 <b>*</b><small>신청 부수와 동일</small></span><div><input type="number" min="1" max="300" placeholder="예: 25" value={form.students} onChange={update('students')} /><strong>{Number(form.students) > 0 ? `${form.students}부 무료` : '0부'}</strong></div></label>
          <label className="field"><span>배송지 <b>*</b><small>학원 주소로 무료배송</small></span><div className="trial-address-search"><input readOnly placeholder="주소 검색 버튼을 눌러주세요" value={form.address} /><button type="button" onClick={searchAddress}><MapPin size={15} /> 주소 검색</button></div></label>
          <div className="trial-form-grid address-row"><input readOnly placeholder="우편번호" value={form.postcode} /><input placeholder="상세 주소 (동, 호수)" value={form.detail} onChange={update('detail')} /></div>
          <label className="field trial-request"><span>요청사항 <small>선택</small></span><textarea placeholder="배송 관련 요청사항을 입력해 주세요." value={form.request} onChange={update('request')} /></label>
          <div className="part1-preview"><div><span>체험 후 바로 이어지는 과정</span><b>SECTION 1 · 1~8회차</b></div><p>0회차 수업 후 정규 모의고사를<br />간편하게 도입할 수 있습니다.</p></div>
          <label className="trial-consent"><input type="checkbox" checked={form.agreed} onChange={(event) => setForm((old) => ({ ...old, agreed: event.target.checked }))} /><span>무료 체험 배송을 위한 개인정보 수집·이용에 동의합니다. <u>자세히</u></span></label>
          {error && <p className="trial-error">{error}</p>}
          <button className="trial-submit" type="submit">0회차 무료배송 신청하기 <ArrowRight size={17} /></button>
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
  const [invoice, setInvoice] = useState(null)
  const [notice, setNotice] = useState('')
  const totals = useMemo(() => getOrderTotals(Number(students), selectedParts, paymentType), [students, selectedParts, paymentType])

  const pay = () => {
    if (!totals.count || !totals.parts) return setNotice('학생 수와 SECTION을 먼저 선택해 주세요.')
    if (!paymentType || !method) return setNotice('결제 방식과 결제 수단을 선택해 주세요.')
    if (!agreed) return setNotice('개인정보 수집·이용 및 결제에 동의해 주세요.')
    if (method === 'bank' && !invoice) return setModal('invoice')
    setModal(method === 'card' ? 'card' : 'bank')
  }

  return <div className="app-shell">
    <Sidebar totals={totals} selectedParts={selectedParts} paymentType={paymentType} onStatus={() => setModal('status')} />
    <main className="main-area">
      <header className="page-header"><div><h1>MOCK 결제 신청</h1><p>SECTION별 일괄 출고일에 맞춰 발송되며, 계산서는 계좌이체 시 이메일로 발송됩니다.</p></div><div><span>1,800부 한정 · 8.21–8.30</span><b>8회차 묶음 배송</b></div></header>
      <div className="form-scroll"><div className="form-grid">
        <AcademySection form={form} setForm={setForm} />
        <AddressSection form={form} setForm={setForm} />
        <OrderSection students={students} setStudents={setStudents} selectedParts={selectedParts} setSelectedParts={setSelectedParts} totals={totals} />
        <PaymentSection students={students} paymentType={paymentType} setPaymentType={setPaymentType} method={method} setMethod={setMethod} />
        <RequestSection request={request} setRequest={setRequest} method={method} invoice={invoice} onInvoice={() => setModal('invoice')} />
      </div></div>
      <div className="checkout-bar"><div className="checkout-info"><span>결제 예정 금액</span><strong>{formatWon(totals.total)}<small>원</small></strong><em>{paymentType ? paymentType === 'director' ? '원장결제' : '개별결제' : '미선택'}</em><label><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /> 개인정보 수집·이용 및 결제에 동의합니다 <u>자세히</u></label></div><div className="checkout-actions"><button className="kakao" onClick={() => setNotice('카카오톡 상담 연결 데모입니다.')}><MessageCircle size={18} /> 문의</button><button className="pay-button" onClick={pay}>결제하기 <ArrowRight size={18} /></button></div></div>
    </main>
    {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<button><X size={15} /></button></div>}
    {modal === 'invoice' && <InvoiceModal initial={invoice} onClose={() => setModal('')} onSave={(data) => { setInvoice(data); setModal('') }} />}
    {modal === 'card' && <CardModal amount={totals.total} onClose={() => setModal('')} onComplete={() => { setModal(''); setNotice('카드 결제가 완료되었습니다.') }} />}
    {modal === 'bank' && <BankComplete amount={totals.total} form={form} onClose={() => setModal('')} />}
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
