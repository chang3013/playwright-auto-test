import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const mobileLocator = {
  /// 모바일 서브메인
  mobileSubMain: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainMobileThemeSection"]',
    APP: '//div[@section-group-id="MoSubMainMobileThemeSection"]',
  },

  // 모바일 서브메인 > KV 섹션
  kvSection: {
    PC: 'div[location="모바일 서브메인|빌보드 배너_PC"]',
    MOBILE: '//div[@section-group-id="MoSubMainMobileKVSection"]',
    APP: '//div[@section-group-id="MoSubMainMobileKVSection"]',
  },

  // 모바일 서브메인 > KV > 이미지
  kvImg: {
    PC: 'div[location="모바일 서브메인|빌보드 배너_PC"] a div:nth-of-type(2) img',
    MOBILE: 'div[location="모바일 서브메인|빌보드 배너_MO"] a div:nth-of-type(2) img',
    APP: 'div[section-group-id="MoSubMainMobileKVSection"] div a',
  },
  iosKvImg: 'div[location="모바일 서브메인|빌보드 배너_MO"] a div:nth-of-type(2) img',
  // 모바일 서브메인 > 테마배너
  banner: {
    PC: 'div[location="모바일 서브메인|테마배너"]',
    MOBILE: 'div[location="모바일 서브메인|테마배너"]',
    APP: 'div[section-group-id="MoSubMainMobileThemeSection"]',
  },
  iosBanner: 'div[location="모바일 서브메인|테마배너"]',
  // 모바일 서브메인 > 테마배너 > 링크
  bannerLink: {
    PC: 'div[location="모바일 서브메인|테마배너"] a',
    MOBILE: 'div[location="모바일 서브메인|테마배너"] a',
    APP: 'div[location="모바일 서브메인|테마배너"] a',
  },

  // 모바일 서브메인 > 이벤트 > 타이틀
  eventTitle: {
    PC: 'div[location="모바일 서브메인|이벤트 배너_PC"] .section-title',
    MOBILE: 'div[location="모바일 서브메인|이벤트 배너_MO"] > div > a',
    APP: 'div[location="모바일 서브메인|이벤트 배너_MO"] > div > a',
  },

  // 모바일 서브메인 > 이벤트 > 이미지
  eventImg: {
    PC: 'div[location="모바일 서브메인|이벤트 배너_PC"] img',
    MOBILE: 'div[location="모바일 서브메인|이벤트 배너_MO"] img',
    APP: 'div[location="모바일 서브메인|이벤트 배너_MO"] img',
  },

  // 모바일 서브메인 > 이벤트 > 전체보기
  eventAllBtn: {
    PC: 'div[location="모바일 서브메인|이벤트 배너_PC"] > div > a',
    MOBILE: 'div[location="모바일 서브메인|이벤트 배너_MO"] > div > a',
    APP: 'div[location="모바일 서브메인|이벤트 배너_MO"] > div > a',
  },
  phoneSection: 'div[location="모바일 서브메인|휴대폰"]',
  // 모바일 서브메인 > 휴대폰 > 타이틀
  phoneTitle: {
    PC: 'div[location="모바일 서브메인|휴대폰"] .section-title',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] > div > a',
    APP: 'div[location="모바일 서브메인|휴대폰"] > div > a',
  },

  // 모바일 서브메인 > 휴대폰 > 탭 리스트
  phoneTabList: {
    PC: 'div[location="모바일 서브메인|휴대폰"] ul[role="tablist"] a',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] ul[role="tablist"] a',
    APP: 'div[location="모바일 서브메인|휴대폰"] ul[role="tablist"] a',
  },

  // 모바일 서브메인 > 휴대폰 > 상품 이미지
  phoneImg: {
    PC: 'div[location="모바일 서브메인|휴대폰"] .slick-track > div[aria-hidden="false"] img',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide img',
    APP: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide img',
  },

  // 모바일 서브메인 > 휴대폰 > 상품 가격
  phonePrice: {
    PC: 'div[location="모바일 서브메인|휴대폰"] .slick-track > div[aria-hidden="false"] .total-price',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide .total-price',
    APP: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide .total-price',
  },

  // 모바일 서브메인 > 휴대폰 > 상품 이름
  phoneName: {
    PC: 'div[location="모바일 서브메인|휴대폰"] .slick-track > div[aria-hidden="false"] .big-title',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide .big-title',
    APP: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide .big-title',
  },
  phoneContainerList: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-container',
  // 모바일 서브메인 > 휴대폰 > 주문하기 버튼
  phoneOrderBtn: {
    PC: 'div[location="모바일 서브메인|휴대폰"] .slick-track > div[aria-hidden="false"] .btn-wrap button',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-slide .btn-wrap button',
    APP: 'div.btn-wrap > button.detail-btn',
  },

  // 모바일 서브메인 > 휴대폰 > 주문하기 > 상품 이름
  detailPhoneName: {
    PC: '.device-detail-v2-info .title-main',
    MOBILE: '//div[@class="device-kv-wrap__info"]//p[contains(@class, "info--title")]',
    APP: 'div.device-kv-wrap__info p.device-kv-wrap__info--title',
  },
  iosDetailPhoneName: '.device-kv-wrap__info--title',
  // 모바일 서브메인 > 휴대폰 > 전체보기
  phoneAllBtn: {
    PC: 'div[location="모바일 서브메인|휴대폰"] > div > a',
    MOBILE: 'div[location="모바일 서브메인|휴대폰"] > div > a',
    APP: 'div[location="모바일 서브메인|휴대폰"] > div > a',
  },
  planSection: 'section[location="모바일 서브메인|추천 요금제"]',
  planSwipe: 'section[section-group-id="MoSubMainMobileRecommendPlan"] .slide-wrap',
  // 모바일 서브메인 > 추천 요금제 > 타이틀
  planTitle: {
    PC: 'div[location="모바일 서브메인|추천 요금제"] .section-title',
    MOBILE: 'section[location="모바일 서브메인|추천 요금제"] h3 a',
    APP: 'section[location="모바일 서브메인|추천 요금제"] h3 a',
  },
  planSubTitle: 'section[section-group-id="MoSubMainMobileRecommendPlan"] .slide-wrap a .sub-title',
  // 모바일 서브메인 > 추천 요금제 > 월정액
  planPrice: {
    PC: 'div[location="모바일 서브메인|추천 요금제"] .plan-price dd',
    MOBILE: 'section[location="모바일 서브메인|추천 요금제"] .price-info div:nth-of-type(1) dd',
    APP: 'section[location="모바일 서브메인|추천 요금제"] .price-info div:nth-of-type(1) dd',
  },
  planMoreButton: 'section[section-group-id="MoSubMainMobileRecommendPlan"] .slide-wrap .btn-more',
  // 모바일 서브메인 > 추천 요금제 > 더보기
  planMoreBtn: {
    PC: 'div[location="모바일 서브메인|추천 요금제"] > div > a',
    MOBILE: 'section[location="모바일 서브메인|추천 요금제"] h3 a',
    APP: 'section[location="모바일 서브메인|추천 요금제"] h3 a',
  },
  subMainPlanUrl: '/mplan/plan-all',
  deviceSection: 'div[section-group-id="MoSubMainMobile2ndDeviceSection"]',
  // 모바일 서브메인 > 태블릿/스마트워치 > 타이틀
  deviceTitle: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] .section-title',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] > div > a',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] > div > a',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 탭 리스트
  deviceTabList: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] ul[role="tablist"] a',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] ul[role="tablist"] a',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] ul[role="tablist"] a',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 상품 이미지
  deviceImg: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] .slick-track > div[aria-hidden="false"] img',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide img',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide img',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 상품 가격
  devicePrice: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] .slick-track > div[aria-hidden="false"] .total-price',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .total-price',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .total-price',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 상품 이름
  deviceName: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] .slick-track > div[aria-hidden="false"] .big-title',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .big-title',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .big-title',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 주문하기 버튼
  deviceOrderBtn: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] .slick-track > div[aria-hidden="false"] .btn-wrap button',
    MOBILE:
      'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .btn-wrap button',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-slide .btn-wrap button',
  },

  // 모바일 서브메인 > 태블릿/스마트워치 > 주문하기 > 상품 이름
  detailDeviceName: {
    PC: '.device-detail-v2-info .title-main',
    MOBILE: '//div[@class="device-kv-wrap__info"]//p[contains(@class, "info--title")]',
    APP: '//div[@class="device-kv-wrap__info"]//p[contains(@class, "info--title")]',
  },
  iosDetailDeviceName: '.device-kv-wrap__info--title',
  // 모바일 서브메인 > 태블릿/스마트워치 > 전체보기
  deviceAllBtn: {
    PC: 'div[location="모바일 서브메인|2nd 디바이스"] > div > a',
    MOBILE: 'div[location="모바일 서브메인|2nd 디바이스"] > div > a',
    APP: 'div[location="모바일 서브메인|2nd 디바이스"] > div > a',
  },

  // 모바일 서브메인 > 하위 메뉴
  subMenu: {
    PC: 'div[location="모바일 서브메인|하위메뉴"]',
    MOBILE: 'div[location="모바일 서브메인|하위메뉴"]',
    APP: 'div[location="모바일 서브메인|하위메뉴"]',
  },

  // 모바일 서브메인 > 하위 메뉴 > 탭 리스트
  subMenuTabList: {
    PC: 'div[location="모바일 서브메인|하위메뉴"] ul[role="tablist"]',
    MOBILE: 'div[location="모바일 서브메인|하위메뉴"] ul[role="tablist"] a',
    APP: 'div[location="모바일 서브메인|하위메뉴"] ul[role="tablist"] a',
  },

  // 모바일 서브메인 > 하위 메뉴 > text 이미지
  subMenuTextImg: {
    PC: '',
    MOBILE: 'div[location="모바일 서브메인|하위메뉴"] .tab-panel .info-txt img',
    APP: 'div[location="모바일 서브메인|하위메뉴"] ul[role="tablist"] a',
  },

  이벤트list: '.event-section-ul > li >a',

  이벤트_전체보기: '.bo-modules-mobile-event-list a.all-view-btn',
  이벤트상세_전체영역: 'div.p-benefit-event',
  휴대폰_tab: 'div[location="모바일 서브메인|휴대폰"] .c-tab-default ul[role="tablist"]>li a',
  eventUrl: '/benefit-event',
  mobileGnb: 'button[data-gtm-click-text="모바일"]',
  mobileSub: 'a[data-gtm-click-text="모바일"]',
  mobilePhone: 'div[location="모바일 서브메인|휴대폰"] .tab-panel .swiper-wrapper',
  mobileDevice: 'div[location="모바일 서브메인|2nd 디바이스"] .tab-panel .swiper-wrapper',
} as const;

// 전체 타입
export type UILocator = typeof mobileLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
