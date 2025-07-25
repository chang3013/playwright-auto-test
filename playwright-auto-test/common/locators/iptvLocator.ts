import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const iptvLocator = {
  // IPTV 서브메인 > KV 섹션
  kvSection: {
    PC: 'div[location="인터넷/IPTV 서브메인|KV배너"]',
    MOBILE: '',
    APP: 'div[section-group-id="MoSubMainInternetIptvKVSection"] a',
  },
  // IPTV 서브메인 > KV > 이미지
  kvImg: {
    PC: 'div[location="인터넷/IPTV 서브메인|KV배너"] a div:nth-of-type(2) img',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|KV배너"] a div:nth-of-type(2) img',
    APP: 'div[section-group-id="MoSubMainInternetIptvKVSection"]',
  },
  iosKvImg: 'div[location="인터넷/IPTV 서브메인|KV배너"] a div:nth-of-type(2) img',
  // IPTV 서브메인 > 테마배너
  banner: {
    PC: 'div[location="인터넷/IPTV 서브메인|테마배너"]',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|테마배너"]',
    APP: 'div[location="인터넷/IPTV 서브메인|테마배너"] > ul > li > a',
  },
  iosBanner: 'div[location="인터넷/IPTV 서브메인|테마배너"]',
  // IPTV 서브메인 > 다양한 혜택(추천 이벤트) > 이미지
  benefitImg: {
    PC: 'div[location="인터넷/IPTV 서브메인|이벤트"] img',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|이벤트"] img',
    APP: 'div[location="인터넷/IPTV 서브메인|이벤트"] img',
  },

  recommPlanPaymentBTN: {
    PC: '',
    MOBILE: '',
    APP: 'button.toggle-option-btn[onclick="togglesClick(this)"',
  },
  recommendPlanSection: 'div[section-group-id="MoSubMainInternetIptvRecommendPlan"]',
  // IPTV 서브메인 > 추천 결합 상품 > 총 납부금액
  recommPlanPayment: {
    PC: 'section[location="인터넷/IPTV 서브메인|추천 요금제"] .plus-total-price span:nth-of-type(2)',
    MOBILE:
      'div[location="인터넷/IPTV 서브메인|추천 요금제"]  .plus-total-price span:nth-of-type(2)',
    APP: 'button.toggle-option-btn[onclick="togglesClick(this)"]',
  },
  iosRecommPlanPayment:
    'div[location="인터넷/IPTV 서브메인|추천 요금제"]  .plus-total-price span:nth-of-type(2)',
  // IPTV 서브메인 > 추천 결합 상품 > 상담예약하기 버튼
  counselReserveBtn: {
    PC: 'section[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group button',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group button',
    APP: 'div.c-btn-group button.c-btn-solid-1-m',
  },
  iosCounselReserveBtn: 'div[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group button',
  reserveModalTitle: '.modal-content .header-title',
  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 버튼
  onlineSignBtn: {
    PC: 'section[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group a:nth-of-type(1)',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group a:nth-of-type(1)',
    APP: 'a.c-btn-solid-1-m',
  },
  iosOnlineSignBtn:
    'div[location="인터넷/IPTV 서브메인|추천 요금제"] .c-btn-group a:nth-of-type(1)',
  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 버튼
  onlineSignBtnIn: {
    PC: '',
    MOBILE: '',
    APP: '//button[@data-gtm-click-text="가입 혜택 선택하기"]',
  },

  onlineSignText: {
    PC: '',
    MOBILE: '',
    APP: '.component > .title-wrap > p.title-wrap__desc',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 버튼 > 가입ㅎ택을 선택해주세여
  onlineSignJoin: {
    PC: '',
    MOBILE: '',
    APP: 'div.card-info',
  },
  onlineSignJoin2: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-event-name="button_click"',
  },
  planDiscount: '.card-info input[id="discount"]',
  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 납부금액 정보
  onlineSignPaymentData: {
    PC: '.inner-wrap .calcu-list:first-child li:nth-child(2)',
    MOBILE: '',
    APP: '',
  },
  benefitGift: '.card-benefit .c-card-list li:first-child .c-card-radio input[tabindex="0"]',
  addBenefit: '.select-benefit-add .c-card-list li:first-child input[tabindex="0"]',
  setTopBox: '.select-settopbox .c-card-list li:first-child input[tabindex="0"]',
  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 혜택 선택하기 버튼
  onlineSignBenefitBtn: {
    PC: '',
    MOBILE: '.p-signup-gift .c-btn-group button',
    APP: '.p-signup-gift .c-btn-group button',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 혜택 선택하기 > 혜택 항목
  onlineSignBenefit: {
    PC: '',
    MOBILE: '.benefit__wrap > div',
    APP: '.select-options > ul > li:nth-of-type(1) input[id="discount"]',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 혜택 선택하기 > 가입 혜택 선택 > 상품권 선택(첫번째)
  onlineSignBenefitGift: {
    PC: '',
    MOBILE: '.select-options > ul > li:nth-of-type(1) li:nth-of-type(1)',
    APP: '.select-options > ul > li:nth-of-type(1) li:nth-of-type(1)',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 혜택 선택하기 > 각 혜택 리스트
  onlineSignBenefitList: {
    PC: '',
    MOBILE: '.select-options > ul > li:nth-of-type(1)',
    APP: '',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 혜택 선택하기 > 항목 선택 > U+ 휴대폰 결합 할인 받기
  onlineSignDiscountBtn: {
    PC: '',
    MOBILE: '.c-btn-group button:nth-of-type(1)',
    APP: '.c-btn-group button:nth-of-type(1)',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입 상품 선택 타이틀
  onlineSignTitle: {
    PC: '.c-form-area h2',
    MOBILE: '',
    APP: '',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 납부금액(매달 내는 요금)
  onlineSignPayment: {
    PC: '.cal-area .calcu-list:nth-of-type(3) div span',
    MOBILE: '.result-bill em',
    APP: '.result-bill em',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입신청 버튼
  onlineSignApplyBtn: {
    PC: '.cal-area button',
    MOBILE: '//button[contains(text(), "신청서 작성")]',
    APP: '//button[contains(text(), "신청서 작성")]',
  },

  // IPTV 서브메인 > 추천 결합 상품 > 온라인 가입 > 가입신청 > 가입신청서 납부금액
  signApplyPayment: {
    PC: 'span.won',
    MOBILE: '',
    APP: '',
  },

  // IPTV 서브메인 > 더 나은 일상
  benefitImg2: {
    PC: 'div[location="인터넷/IPTV 서브메인|혜택1"] img',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|혜택1"] img',
    APP: 'a[data-gtm-click-text="핵심만 콕! 요금 납부 TIP"]',
  },
  iosBenefitImg2: 'div[location="인터넷/IPTV 서브메인|혜택1"] img',
  iosBenefit1Section: 'div[section-group-id="MoSubMainInternetIptvBenefit1Section"]',
  iosBenefit2Section: 'div[section-group-id="MoSubMainInternetIptvBenefit2Section"]',
  // IPTV 서브메인 > 하단 혜택
  benefitImg3: {
    PC: 'div[location="인터넷/IPTV 서브메인|혜택2"] img',
    MOBILE: 'div[location="인터넷/IPTV 서브메인|혜택2"] img',
    APP: 'div[location="인터넷/IPTV 서브메인|혜택2"] img',
  },
  //ios 셀렉터
  iptvGnb: 'button[data-gtm-click-text="인터넷/IPTV"]',
  iptvSub: 'a[data-gtm-click-text="인터넷/IPTV"]',
  eventSection: 'div[section-group-id="MoSubMainInternetIptvEventSection"]',
  combineProductSection: 'div[section-group-id="MoSubMainInternetIptvRecommendPlan"]',
  combineTotalPrice: 'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] .plus-total-price',
  combineSwiperSel:
    'div[section-group-id="MoSubMainInternetIptvRecommendPlan"] .c-wrap-plus-product .swiper-container',
  signUrl: '/signup/',
} as const;

// 전체 타입
export type UILocator = typeof iptvLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
