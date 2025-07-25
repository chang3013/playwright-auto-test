import { UIType } from '@common/types/platform-types';

import { searchLocator } from './searchLocator';

/**
 * UI 관련 로케이터
 */
export const mainLocator = {
  // 메인 > KV 섹션
  kvSection: {
    PC: 'div[data-id="KV"] .visual-section',
    MOBILE: '//section[@section-group-id="WebMainKVSection"]',
    APP: 'section[section-group-id="AppMainKVSection"]',
  },

  // 메인 > KV > 링크
  kvLink: {
    PC: '',
    MOBILE: '//section[contains(@class,"kv-section")]//a/preceding-sibling::a',
    APP: '//section[contains(@class,"kv-section")]//a/preceding-sibling::a',
  },

  // 메인 > KV > 이미지
  kvImg: {
    PC: '.visual-bg-area img',
    MOBILE: '.swiper-wrapper > div .info-visual > div p:nth-of-type(2) img',
    APP: '.swiper-wrapper > div .info-visual > div p:nth-of-type(2) img',
  },

  // 메인 > KV > 이미지2
  kvImg2: {
    PC: '',
    MOBILE: '.swiper-wrapper > div .info-sub-visual > div p:nth-of-type(2) img',
    APP: '.swiper-wrapper > div .info-sub-visual > div p:nth-of-type(2) img',
  },

  // 메인 > 기기추천 > 타이틀
  deviceTitle: {
    PC: '.l-sub-main .device-section .section-title',
    MOBILE: '//section[contains(@class, "popular-section")]//header//a',
    APP: 'section[section-group-id="MainMobileSectionAOS"] header a',
  },
  iosDeviceTitle: '//section[contains(@class, "popular-section")]//header//a',

  // 메인 > 기기추천 > 탭(추천)
  deviceTab: {
    PC: '.l-sub-main .device-section .tab-wrap li:nth-of-type(1)',
    MOBILE: '',
    APP: 'h2.header-title',
  },

  // 메인 > 기기추천 > 이미지
  deviceImg: {
    PC: '.l-sub-main .device-section .recomm-tabcon[style="display: block;"] img',
    MOBILE: '',
    APP: '',
  },

  // 메인 > 기기추천 > 기기명
  deviceName: {
    PC: '',
    MOBILE:
      '//section[contains(@class, "popular-section")]//div[contains(@class, "swiper-slide")]//p[@class="title"]',
    APP: '',
  },

  // 메인 > 기기추천 > 기기상세 > 기기명
  detailDeviceName: {
    PC: '',
    MOBILE: '//div[@class="device-kv-wrap__info"]//p[contains(@class, "info--title")]',
    APP: '',
  },

  // 메인 > 기기추천 > 전체보기
  deviceAllBtn: {
    PC: '.l-sub-main .device-section .c-btn-group a',
    MOBILE: '',
    APP: '',
  },

  // 메인 > 유독 > 타이틀
  udocTitle: {
    PC: '.l-sub-main .blurb-section .blurb-title',
    MOBILE: '//section[@location="메인|유독|이벤트"]//h3',
    APP: 'header.title.fade-up > h3',
  },

  // 메인 > 유독 > 이미지
  udocImg: {
    PC: '.l-sub-main .blurb-section img',
    MOBILE: '//section[@location="메인|유독|이벤트"]//img',
    APP: 'div[class="info-img"] > img[alt="넷플릭스+유튜브 프리미엄 월 11,900원 "]',
  },

  // 메인 > 인기모바일
  planMobile: {
    PC: '',
    MOBILE: '',
    APP: 'a[data-gtm-click-text="추천! 지금 인기 모바일 타이틀 영역"]',
  },

  planMobileImg: {
    PC: '',
    MOBILE: '',
    APP: 'div.info-img > img[alt="갤럭시 S25 엣지 티타늄실버 컬러 후면/전면 겹쳐진 이미지"]',
  },

  // 메인 > 요금제 혜택 > 타이틀
  planBenefitTitle: {
    PC: '.l-sub-main .payment-section .section-title',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]//header//a',
    APP: 'a[data-gtm-event-action="메인|추천|상품|요금제 영역 - 링크 클릭"]',
  },

  // 메인 > 요금제 혜택 > 이미지
  planBenefitImg: {
    PC: '.l-sub-main .payment-section img',
    MOBILE: '',
    APP: 'a[data-gtm-event-action="메인|추천|상품|요금제 영역 - 링크 클릭"]',
  },

  // 메인 > 요금제 혜택 > 요금제명
  planName: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainPricePlanSection"]//p[@class="sub-title"]',
    APP: '',
  },

  // 메인 > 요금제 혜택 > 요금제 상세 > 요금제명
  detailPlanName: {
    PC: '',
    MOBILE: '//p[@class="h1"]',
    APP: '',
  },

  // 메인 > 유잼 > 타이틀
  ujamTitle: {
    PC: '.l-sub-main .promotion-section .section-title .h1',
    MOBILE: '//section[@section-group-id="MainRecommendSection"]//header//h3',
    APP: 'h3[data-v-4073bea3]:has-text("추천 콘텐츠! 잼과 이득이 가득가득")',
  },
  iosUjamTitle: '//section[@section-group-id="MainRecommendSection"]//header//h3',

  // 메인 > 유잼 > 이미지
  ujamImg: {
    PC: '.l-sub-main .promotion-section img',
    MOBILE: '//section[@section-group-id="MainRecommendSection"]/div//a//img',
    APP: 'a[data-gtm-click-location="메인|추천|콘텐츠 영역"] > div >img',
  },
  iosUjamImg: '//section[@section-group-id="MainRecommendSection"]/div//a//img',

  // 메인 > 유잼 > 바로가기
  ujamBtn: {
    PC: '.l-sub-main .promotion-section .app-btn-area a',
    MOBILE: '',
    APP: 'a[data-gtm-click-location="메인|추천|콘텐츠 영역"]',
  },

  // 메인 > 하단 커스텀 영역 > 타이틀
  customTitle: {
    PC: '.l-sub-main .custom-section .section-title',
    MOBILE: '',
    APP: '.link-bottom .c-btn-solid-full ',
  },

  // 메인 > 하단 커스텀 영역 > 이미지
  customImg: {
    PC: '.l-sub-main .custom-section img',
    MOBILE: '',
    APP: '',
  },

  // 진행 중 이벤트 >
  mainEvent: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="MainEventSection"]//header//a',
  },

  // 지금 바로! 이 모든 혜택 놓치지 않게! 앱 다운받기 >
  appDownload: {
    PC: '',
    MOBILE: '//a[@data-gtm-click-location="앱 다운받기 영역"]',
    APP: '',
  },

  // 요금/혜택 정보를 한눈에 확인하세요 섹션 타이틀
  mainMyPage: {
    PC: '',
    MOBILE: '//a[contains(@data-gtm-click-text, "마이페이지")]/span[2]',
    APP: '',
  },

  // 요금/혜택 정보를 한눈에 확인하세요 섹션 - 닷컴만의 혜택 바로 확인하기 >
  benefit: {
    PC: '',
    MOBILE: '//a[contains(@data-gtm-click-text, "혜택 확인")]',
    APP: '',
  },

  // 메인 > 인터넷/IPTV > 타이틀
  iptvTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]//header//a',
    APP: '',
  },

  // 메인 > 인터넷/IPTV > 요금제명
  iptvName: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainHomeSection"]//p[@class="brand-payment"]',
    APP: '',
  },

  // 메인 > 인터넷/IPTV > 요금제 상세 > 요금제명
  detailIptvName: {
    PC: '',
    MOBILE: '//div[contains(@class, "product-info__item")]//strong[@class="product-name"]',
    APP: '',
  },

  // 메인 > 유플닷컴 이용 가이드 > 타이틀
  guideTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainUseGuideSection"]//header//h3',
    APP: '',
  },

  // 메인 > 유플닷컴 이용 가이드 > 리스트
  guideList: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainUseGuideSection"]//li//a',
    APP: '',
  },

  // 진행 중 이벤트 타이틀
  eventTitle: {
    PC: '.l-sub-main .benefits-section .section-title',
    MOBILE: '//section[@section-group-id="MainEventSection"]//header//a',
    APP: 'section[section-group-id="MainEventSection"] header a',
  },
  eventSlide: 'sections[section-group-id="MainEventSection"] .slide-wrap',
  // 메인 > 이벤트 > 이미지
  eventImg: {
    PC: '.l-sub-main .benefits-section img',
    MOBILE: '//section[@section-group-id="MainEventSection"]/div//a//img',
    APP: 'section[section-group-id="MainEventSection"] div a img',
  },
  pogSection: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="MainPoggSection"]',
  },
  pogSlide: 'section[section-group-id="MainPoggSection"] .slide-wrap',
  pogATag:
    '.practical-slide .swiper-slide a[data-gtm-event-action="메인|유독|이벤트 영역 - 링크 클릭"]',
  pogImg: 'section[section-group-id="MainPoggSection"] .info-img img',
  // 메인 > 유플닷컴 통신 생활 > 타이틀
  ourLifeTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainOurlifeSection"]//header//h3',
    APP: '',
  },

  // 메인 > 유플닷컴 통신 생활 > 이미지
  ourLifeImg: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainOurlifeSection"]//li//a//img',
    APP: '',
  },

  // 메인 > 이럴 땐 U렇게 > 타이틀
  suggestTitle: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainSuggestSection"]//header/h3',
    APP: '',
  },
  //메인 > 혜택 리스트 섹션
  benefitSection: {
    PC: '',
    MOBILE: '',
    APP: 'section[section-group-id="AppMainBenefitListSection"]',
  },
  benefitButton: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="AppMainBenefitListSection"]//div/a',
  },
  // 메인 > 인기 모바일
  mobileSection: {
    PC: '',
    MOBILE: '',
    APP: 'section[section-group-id="MainMobileSectionIOS"]',
  },
  mobileSlide: 'section[section-group-id="MainMobileSectionIOS"] .slide-wrap',
  mobileATag: '.popular-slide .swiper-slide a[data-gtm-click-location="메인|추천|상품|기기 영역"]',
  mobileUrl: 'device/phone',
  mobileBtn: 'a[data-gtm-click-text="기기 더보기"]',

  // 메인 > 이럴 땐 U렇게 > 이미지
  suggestImg: {
    PC: '',
    MOBILE: '//section[@section-group-id="MainSuggestSection"]/div//a//img',
    APP: '',
  },

  // 개인화 영역 > 펼치기 버튼
  toggle: {
    PC: '.layer-toggle',
    MOBILE: '',
    APP: '.btn-extra-service button',
  },
  PhoneNumber: '.payment-line',
  //개인화 부가서비스
  MyValueAddedService: '.extra-service__box',
  // 개인화 영역 > 정보
  myInfo: {
    PC: '.my-data-layer .my-data-group',
    MOBILE: '',
    APP: '',
  },

  // 개인화 영역 > 데이터
  myData: {
    PC: '.use-data',
    MOBILE: '',
    APP: 'p.data-box__volume',
  },

  // 개인화 영역 > 청구요금
  myCharge: {
    PC: '.flex-inner .txt-price',
    MOBILE: '',
    APP: 'div.billing-box > div.counter > span',
  },

  // 추천! 지금 인기 모바일 타이틀
  popularDeviceTitle: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="MainMobileSectionAOS"]//header//a',
  },

  // 주목! 혜택 좋은 요금제 타이틀
  pricePlanTitle: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="MainPricePlanSection"]//header//a',
  },

  // 절약! 인터넷/IPTV 가입 >
  homeProductSection: {
    PC: '',
    MOBILE: '',
    APP: '//section[@section-group-id="MainHomeSection"]//header//a',
  },
  // 개인화 영역 > 퀵메뉴
  quickMenu: {
    PC: '',
    MOBILE: '',
    APP: 'section[section-group-id="AppMainMobileRecommendMenuSection"]',
  },
  uage_info: 'button[data-gtm-click-text="결합/부가서비스/약정/할부보기"]',
  uage_Quick: [
    '내 가입정보',
    '해외로밍',
    '데이터 선물',
    '휴대폰 구매',
    '인터넷/IPTV',
    '일시정지/해제',
    '실시간 요금',
    '납부요금 조회',
    '요금 바로 납부',
    '너겟',
    '요금제 변경',
    '휴대폰 결제',
  ],
  //요금제
  pricePlanSection: 'section[section-group-id="MainPricePlanSection"]',
  priceSlide: 'section[section-group-id="MainPricePlanSection"] .slide-wrap',
  priceATag: '.hot-slide > div > a:nth-of-type(1)',
  priceUrl: 'plan/mplan',
  priceBtn: 'a[data-gtm-click-text="요금제 더보기"]',

  homeSection: 'section[section-group-id="MainHomeSection"]',
  homeATag: 'section[section-group-id="MainHomeSection"] .products-box__list a',
  homePriceUrl: '/signup/step1',

  recommendSection: 'section[section-group-id="MainRecommendSection"]',
  recommendSlide: 'section[section-group-id="MainRecommendSection"] .slide-wrap',
  recommendATag: 'section[section-group-id="MainRecommendSection"] .slide-wrap a',
  recommendUrl: '/ujam',

  //ios main Case 정리하면서 사용/미사용
  //유플투뿔배너
  uptpBanner: 'section-group-id="MobileWebMainUpTpBannerSection"',
  //ixi(ai추천 혜택) - 컨텐츠 확인 및 전체보기
  ixiBenefitUrl: 'benefit/report',
  //KV
  //이벤트URL
  eventUrl: 'benefit-event/ongoing',
  //유잼URL
  ujamUrl: '/ujam',
} as const;

// 전체 타입
export type UILocator = typeof mainLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
