import { UIType } from '@common/types/platform-types';

export const mobileCartLocator = {
  // 모바일 > 모바일 기기 > 휴대폰
  kvSection: {
    PC: '.slick-track',
    MOBILE: '',
    APP: '',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 상품 이미지
  phoneImg: {
    PC: '.product-list .filter-card img',
    MOBILE: '.card-top .card-img',
    APP: '.card-top .card-img',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 상품 가격
  phonePrice: {
    PC: '.product-list .filter-card .price > span',
    MOBILE: '.card-mid .data-info-total span span',
    APP: 'div.filter-card div.data-info-total txt-big',
  },
  iosPhonePrice: '.card-mid .data-info-total span span',

  // 모바일 > 모바일 기기 > 휴대폰 > 상품 이름
  phoneName: {
    PC: '.product-list .filter-card h3.big-title',
    MOBILE: '.card-top .big-title',
    APP: 'button.user-action-btn.point-color',
  },
  iosPhoneName: '.card-top .big-title',

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 버튼
  phoneOrderBtn: {
    PC: '.product-list .filter-card .point-btn button',
    MOBILE: '.card-bottom .btn-wrap:nth-of-type(2) button',
    APP: '.card-bottom .btn-wrap:nth-of-type(2) button',
  },
  signTypeSection:
    'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(3) li:nth-of-type(1)',
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 가입 유형(기기 변경)
  signType: {
    PC: '',
    MOBILE: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(3) li:nth-of-type(1)',
    APP: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(3) li:nth-of-type(1) input',
  },
  aosSignType: 'input[type="radio"][data-gtm-click-text="기기변경"]',

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 요금제 선택(첫번째)
  plan: {
    PC: '',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(4) > div > ul > li:nth-of-type(1)',
    APP: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(4) > div > ul > li:nth-of-type(1) input',
  },
  aosPlan: 'input[type="radio"][data-gtm-event-action="요금제 선택 영역 - 버튼 클릭"]',
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 요금제 특별 혜택
  benefit: {
    PC: '.benefit-list .benefit-item',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(4) > div > ul > li:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > ul li > div',
    APP: 'input[data-gtm-event-action="할인 방법 선택 영역 - 버튼 클릭"]',
  },
  iosBenefit:
    'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(4) > div > ul > li:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > ul li > div',

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > VIP멤버십 혜택
  benefit2: {
    PC: '.itemBenefit',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(8) > div > div > ul div ul li input',
    APP: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(8) > div > div > ul div ul li input[id="radio2_0"]',
  },
  iosBenefit2:
    'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(8) > div > div > ul div ul li input',

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 할인방법을 선택해 주세요
  benefit3: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-click-text="36개월"]',
  },
  // 모바일 > 모바일 기기 > 휴대폰 > 가입유형 버튼 > 기기변경선택
  phoneJoinType: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-event-label="컨텐츠 : 기기변경"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 가입유형 버튼 > 요금제를 선택해 주세요
  phoneValueType: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-event-label*="유쓰 5G 슬림+"][name="pp-radio-group"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 배송방법을 선택해주세요
  benefitMove: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-click-location="배송 방법 선택 영역"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 멤버십해택
  benefitVip: {
    PC: '',
    MOBILE: '',
    APP: 'input[data-gtm-click-text="유독"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 할인 방법(첫번째)
  discount: {
    PC: '',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(5) ul > li:nth-of-type(1)',
    APP: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(5) ul > li:nth-of-type(1) input',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 할부(즉시결제)
  monthlyPayment: {
    PC: '',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(6) > div > div:nth-of-type(2) > ul li:nth-of-type(1)',
    APP: 'input[data-gtm-click-text="24개월"]',
  },
  iosMonthlyPayment:
    'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(6) > div > div:nth-of-type(2) > ul li:nth-of-type(1) input',
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 배송 방법(첫번째)
  delivery: {
    PC: '',
    MOBILE:
      'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(7) ul li:nth-of-type(1)',
    APP: 'input[data-gtm-event-action="배송 방법 선택 영역 - 버튼 클릭"]',
  },
  iosDelivery:
    'div.tab-wrap .tab-wrap__content:nth-child(2) > div:nth-of-type(7) ul > li:nth-of-type(1) input',
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > (사은품/매월 이용할 혜택)
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > VIP멤버십 혜택

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 사은품
  gift: {
    PC: '.c-page-section > div > .gift-list',
    MOBILE: '.gift-wrap li',
    APP: 'input[type="radio"][data-gtm-event-action="사은품 선택 영역 - 버튼 클릭"]',
  },
  iosGift: '.gift-wrap li:first-child input',
  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 매월 이용할 혜택
  gift2: {
    PC: '',
    MOBILE: '.shopping-wrap li',
    APP: 'input[data-gtm-event-label*="팬톤 블루투스"][data-gtm-click-text*="팬톤 블루투스"]',
  },
  iosGift2: '.shopping-wrap li:first-child input',

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > (매월 이용할 혜택)
  giftMonth: {
    PC: '',
    MOBILE: '',
    APP: 'div.c-card-radio shopping-wrap__item',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 제휴카드
  partnerCard: {
    PC: '.c-page-section > div > div',
    MOBILE: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div',
    APP: 'input[type="radio"][data-gtm-click-text="신청하지 않을래요"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 추가 할인 혜택(첫번째)
  moreBenefit: {
    PC: '',
    MOBILE: 'div.tab-wrap .tab-wrap__content:nth-child(2) > div',
    APP: 'input[type="checkbox"][data-gtm-click-text="나중에 생각하고 결정할게요"]',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 장바구니 버튼
  cartBtn: {
    PC: '.btn-calc-btm-area__cart',
    MOBILE: '.p-mobile > div > .c-btn-group button:nth-of-type(1)',
    APP: 'i.simcard-calc__button--icon-cart',
  },

  // 모바일 > 모바일 기기 > 휴대폰 > 신청하기 > 장바구니 > 장바구니로 이동 버튼(바로가기)
  moveCartBtn: {
    PC: '.modal-footer button:nth-of-type(2)',
    MOBILE: '.toast-body button',
    APP: 'button.c-link-arr-1-s.cl-white[aria-label="장바구니 바로가기"]',
  },

  // 장바구니 > 상품 이미지
  cartImg: {
    PC: '.products-contianer img',
    MOBILE: '.c-card-cart img',
    APP: '.c-card-cart img',
  },

  // 장바구니 > 상품 가격
  cartPrice: {
    PC: '.products-contianer .price',
    MOBILE: '.c-card-cart .prod-price strong',
    APP: '.c-card-cart .prod-price strong',
  },

  // 장바구니 > 상품 이름
  cartName: {
    PC: '.products-contianer .tit',
    MOBILE: '.c-card-cart .prod-title',
    APP: '.c-card-cart .prod-title',
  },

  // 장바구니 > 상품 삭제 / 삭제 확인 버튼
  btnDel: {
    PC: '.btn-del',
    MOBILE: '.c-btn-del',
    APP: '.c-card-cart .cart-box .c-btn-del',
  },
  
  deviceList: '.filter-card',
  okBtn: '.c-btn-outline-1-m',
  delMessage: '.-ta-c',
  delSummitBtn: '.c-btn-solid-1-m',
  mobileGnb: 'button[data-gtm-click-text="모바일"]',
  mobileSub: 'a[data-gtm-click-text="모바일|모바일 기기"]',
  mobileDevice: 'a[data-gtm-click-text="모바일|모바일 기기|휴대폰"]',
  detailUrl: 'mobile/device',
  cartUrl: '/cart',
  giftMonth2: 'input[type="radio"][data-gtm-click-text="네이버페이"]',
  gift3: 'input[type="radio"][data-gtm-event-action="사은품 선택 영역 - 버튼 클릭"]',
  giftMonth3: 'input[type="radio"][data-gtm-event-action="쇼핑쿠폰팩 선택 영역 - 버튼 클릭"]',
  cartText: '.c-section .tit',
} as const;
// 전체 타입
export type UILocator = typeof mobileCartLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
