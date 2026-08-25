# SLATIQ MOCK Academy

## Landing

문제지·해설·패키지를 함께 보여주는 구성 중심안을 최종안으로 사용합니다.

이 저장소는 `slatiq-mock-academy`의 `slatiq-mock-v1-baseline-20260825` 백업 이후 분기한 비교용 작업본입니다.

학원·강사용 SLATIQ MOCK 무료 체험 및 단체 주문 페이지입니다.

## 보존 기준

- 원본 저장소: `kmw1wlog/campus-kit-backup`
- 원본 기준 커밋: `d10ab89`
- 신규 저장소는 원본 Git 이력을 유지하며 별도로 운영합니다.

## 확정 정보

- 한정 수량: 1,800부
- 신청 기간: 8월 21일~8월 30일 선착순
- SECTION 1: 9월 9일 주문 마감, 9월 14일 출고
- SECTION 2: 9월 30일 주문 마감, 10월 5일 출고
- SECTION 3: 10월 21일 주문 마감, 10월 26일 출고
- 기본 단가: 1인 5,500원
- 인원별 할인율: 10%, 15%, 20%, 25%, 30%

## 로컬 실행

```bash
npm ci
npm run dev -- --port 4175
```

- 무료 체험: `http://127.0.0.1:4175/`
- 단체 주문: `http://127.0.0.1:4175/order`

## 검증

```bash
npm test
npm run build
```
