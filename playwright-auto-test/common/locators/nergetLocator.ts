import { UIType } from '@common/types/platform-types';

export const nergetLocator = {
  // 너겟 서브메인
  nergetPage: {
    PC: '.submain-section',
    MOBILE: '',
    APP: '',
  },

  kvImg: {
    PC: '',
    MOBILE: '',
    APP: 'div.direct-kv > .visual-area > img',
  },

  // 너겟 서브메인 > USIM 신규가입 버튼
  usimSignBtn: {
    PC: '.direct-floating .floating-right a:nth-of-type(2)',
    MOBILE: 'div.direct-floating a:nth-of-type(2)',
    APP: 'div.direct-floating a:nth-of-type(2)',
  },

  usimBackBtn: {
    PC: '',
    MOBILE: '',
    APP: '.y0up0h2 > button',
  },

  usimJoinText: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-click-text="LG U+ 유심을 갖고 있어요"]',
  },

  // 너겟 서브메인 > USIM 신규가입 > 유심카드 소지 여부 선택(갖고있음)
  usimCard: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(1) .radio-wrap li:nth-of-type(1)',
    APP: 'input[data-gtm-click-text="LG U+ 유심을 갖고 있어요"]',
  },

  // 너겟 서브메인 > USIM 신규가입 > 가입 유형 선택(신규가입)
  usimSignType: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(2) .radio-wrap li:nth-of-type(1)',
    APP: 'input[data-gtm-click-text="신규가입"]',
  },

  // 너겟 서브메인 > USIM 신규가입 > 가입 방법(스스로)
  usimSignWay: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(3) .radio-wrap li:nth-of-type(1)',
    APP: 'input[data-gtm-click-text="스스로 개통"]',
  },

  // 너겟 서브메인 > USIM 신규가입 > 요금제 선택(첫번째)
  usimSignPlan: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(5) > div > div > ul > li:nth-of-type(1)',
    APP: '.p-simcard__inner > div:nth-of-type(5) > div > div > ul > li:nth-of-type(1) input',
  },

  // 너겟 서브메인 > USIM 신규가입 > 할인 방법(첫번째)
  usimSignDiscount: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(6) .radio-wrap li:nth-of-type(1)',
    APP: '.p-simcard__inner > div:nth-of-type(6) .radio-wrap li:nth-of-type(1) input',
  },
  usimNergetVIP: '.p-simcard__inner > div:nth-of-type(7) .radio-wrap li:nth-of-type(1) input',
  // 너겟 서브메인 > USIM 신규가입 > 요금제명
  usimPlanName: {
    PC: '.calcu-list li:nth-of-type(2) strong',
    MOBILE: '.p-simcard__inner > div:nth-of-type(5) > div > div > ul > li:nth-of-type(1) a',
    APP: '.p-simcard__inner > div:nth-of-type(5) > div > div > ul > li:nth-of-type(1) a',
  },

  // 너겟 서브메인 > USIM 신규가입 > 월 납부금액
  usimPayment: {
    PC: '.white-box .month-total span',
    MOBILE: '.price em',
    APP: '.simcard-fixed-box__info--price',
  },
  usimMembershipBenefit: {
    PC: 'tr:nth-of-type(5) .coupon-gifts-list li:nth-of-type(1)',
    MOBILE: '.p-simcard__inner > div:nth-of-type(7) li li:nth-of-type(1)',
    APP: '',
  },

  // 너겟 서브메인 > USIM 신규가입 > 너겟 쿠폰(특별한 혜택))
  usimNergetCoupon: {
    PC: '.gift-list .coupon-gifts-list li:nth-of-type(1)',
    MOBILE: '.p-simcard__inner > div:nth-of-type(9) li:nth-of-type(1)',
    APP: '',
  },
  usimNergetBenetfit: '.p-simcard__inner > div:nth-of-type(9) li:nth-of-type(3) input',
  // 너겟 서브메인 > USIM 신규가입 > 상세내역 확인
  usimSignCheckBtn: {
    PC: '',
    MOBILE: '.p-simcard .c-btn-group button',
    APP: '.p-simcard .c-btn-group button',
  },

  // 너겟 서브메인 > USIM 신규가입 > 가입 신청하기 버튼
  usimSignApplyBtn: {
    PC: '.btn-area button',
    MOBILE: '',
    APP: '',
  },

  // 너겟 서브메인 > USIM 신규가입 > 가입 신청하기 > 가입신청서 요금제명
  signApplyPlanName: {
    PC: '.c-benefit-list li:nth-of-type(2)',
    MOBILE: '.result-wrap__product',
    APP: '',
  },

  // 너겟 서브메인 > USIM 신규가입 > 가입 신청하기 > 가입신청서 월 납부금액
  signApplyPayment: {
    PC: '.month-total span',
    MOBILE: '.result-bill__info--data em',
    APP: '.result-bill__info li:first-child .result-bill__info--data',
  },

  // 너겟 서브메인 > 너겟 둘러보기
  nergetMore: {
    PC: '.direct-usim .direct-btn',
    MOBILE: 'div.visual-area .btn-area a',
    APP: 'div.btn-area > a.direct-btn',
  },

  // 너겟 서브메인 > 요금제 > 요금제명
  planName: {
    PC: '',
    MOBILE: '.bo-modules-plan-list .swiper-wrapper > div .plan-name',
    APP: '',
  },

  // 너겟 서브메인 > 요금제 > 요금제 가격
  planPrice: {
    PC: '.bo-modules-plan-list .plan-price',
    MOBILE: '.bo-modules-plan-list .plan-price',
    APP: '',
  },

  // 너겟 서브메인 > 요금제 > 월 최대 혜택
  planBenefitPrice: {
    PC: '.bo-modules-plan-list .plan-origin-price em',
    MOBILE: '.bo-modules-plan-list .plan-origin-price em',
    APP: '',
  },

  // 너겟 서브메인 > 요금제 > 가입하기 버튼
  planSignBtn: {
    PC: '.bo-modules-plan-list li .btn-area a',
    MOBILE: '.bo-modules-plan-list .swiper-wrapper > div .btn-area a',
    APP: '',
  },

  // 너겟 서브메인 > 요금제 > 전체보기 버튼
  planAllBtn: {
    PC: '.bo-modules-plan-list .section > .btn-area a',
    MOBILE: '',
    APP: 'div[moduleid="PlanCombineCarousel03"] .btn-view-all',
  },

  // 너겟 서브메인 > 요금제 > 가입하기 > 기기 선택(첫번째)
  planSelectPhone: {
    PC: '',
    MOBILE: '.p-simcard__inner > div:nth-of-type(4) > div > div:nth-of-type(2) li:nth-of-type(1)',
    APP: '',
  },

  // 너겟 서브메인 > 혜택
  benefit: {
    PC: 'div.direct-benefit-info li',
    MOBILE: 'ul.direct-benefit-list li',
    APP: 'a[data-gtm-event-label="컨텐츠 : 너겟 47 가입하기"]',
  },
  iosBenefit: 'ul.direct-benefit-list li',

  // 너겟 서브메인 > 고객 리뷰
  review: {
    PC: 'div.direct-review img',
    MOBILE: 'div.direct-review .direct-review-list:nth-of-type(2) img',
    APP: 'div.direct-review .direct-review-list img',
  },

  // 너겟 서브메인 > 꿀혜택
  event: {
    PC: '.bo-modules-event-list img',
    MOBILE: 'ul.event-list img',
    APP: 'ul.event-list img',
  },

  // 너겟 서브메인 > 꼭 확인하세요
  notice: {
    PC: 'div.direct-notice .toggle-box',
    MOBILE: 'div.direct-notice .toggle-box',
    APP: 'div.direct-notice .toggle-box',
  },
  // 너겟 서브메인 > 참 쉬운 가족 결합
  family: {
    PC: '',
    MOBILE: '',
    APP: 'a[aria-controls="toggle-box5"]',
  },

  familyIn: {
    PC: '',
    MOBILE: '',
    APP: 'a[data-gtm-event-label="컨텐츠 : 결합할인을 신청할게요"]',
  },
  hamburger: 'button[data-gtm-click-text="전체메뉴"]',
  nergetGnb: 'button[data-gtm-click-text="너겟"]',
  nergetSubMain: 'a[data-gtm-click-text="너겟"]',
  nergetUsim: 'div.direct-usim',
  nergetUsimPlan: 'div[moduleid="PlanCombineCarousel03"]',
  nergetBenefit: '.direct-benefit-info',
  nergetPlanSlide: '.bo-modules-plan-list div.swiper-wrapper',
  nergetPlanSections: 'div[moduleid="PlanCombineCarousel03"] .btn-view-all',
  nergetReview: 'div.direct-review',
  nergetReviewMore: '.direct-review a.btn-more',
  nergetEvent: 'div[moduleid="BannerImageList01"]',
  nergetEventMore: 'div[moduleid="BannerImageList01"] a.btn-more',
  nergetPlanUrl: 'direct/plan',
  nergetEventUrl: '/benefit-event',
  nergetUsimJoinUrl: '/usim-detail',
  nergetUsimView: '.direct-usim a[data-gtm-click-text="너겟 둘러보기"]',
  nergetUsimPlanJoin: '.plan-card a[data-gtm-click-text="너겟 47 가입하기"]',
} as const;

// 전체 타입
export type UILocator = typeof nergetLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
