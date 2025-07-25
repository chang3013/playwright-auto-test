import { UIType } from '@common/types/platform-types';

/**
 * UI 관련 로케이터
 */
export const benefitLocator = {
  // 혜택/멤버십 KV 링크
  kvLink: {
    PC: '',
    MOBILE: '//div[@section-group-id="MoSubMainBenefitKVSection"]//a',
    APP: 'div[section-group-id="MoSubMainBenefitKVSection"] a',
  },

  // 혜택/멤버십 서브메인 > KV > 이미지
  kvImg: {
    PC: 'div[location="혜택 서브메인|KV배너"] a div:nth-of-type(2) img',
    MOBILE: 'div[location="혜택 서브메인|KV배너"] a div:nth-of-type(2) img',
    APP: 'div[location="혜택 서브메인|KV배너"] a div:nth-of-type(2) img',
  },

  // 혜택/멤버십 서브메인 > 테마배너
  banner: {
    PC: 'div[location="혜택 서브메인|테마배너"]',
    MOBILE: 'div[location="혜택 서브메인|테마배너"]',
    APP: 'div[location="혜택 서브메인|테마배너"]',
  },

  // 혜택/멤버십 서브메인 > 멤버십(제휴사) 혜택
  benefit: {
    PC: 'div[location="혜택 서브메인|제휴사 안내"] ul[role="tablist"]',
    MOBILE: 'div[location="혜택 서브메인|제휴사 안내"] ul[role="tablist"]',
    APP: 'div.swiper-container.is-start > .swiper-wrapper > li[role="none"] > a[role="tab"] span',
  },
  iosBenefit: 'div[location="혜택 서브메인|제휴사 안내"] ul[role="tablist"]',

  // 혜택/멤버십 서브메인 > 멤버십 혜택 > 제휴사 전체보기
  partnerAllBtn: {
    PC: 'div[location="혜택 서브메인|제휴사 안내"] .btn-arr-more',
    MOBILE: 'div[location="혜택 서브메인|제휴사 안내"] .c-btn-group a',
    APP: 'div.c-btn-group a.c-btn-outline-2-s',
  },
  iosPartnerAllBtn: 'div[location="혜택 서브메인|제휴사 안내"] .c-btn-group a',

  themeBannerLinks: {
    PC: '',
    MOBILE: '',
    APP: 'div.swiper-container.is-start > .swiper-wrapper',
  },
  // 혜택/멤버십 서브메인 > 온라인 가입 할인 혜택 > 이미지
  onlineBenefitImg: {
    PC: 'div[location="혜택 서브메인|온라인 전용상품"] img',
    MOBILE: 'div[location="혜택 서브메인|온라인 전용상품"] img',
    APP: 'div[location="혜택 서브메인|온라인 전용상품"] img',
  },

  // 혜택/멤버십 서브메인 > 온라인 가입 할인 혜택 > 전체보기
  onlineBenefitAllBtn: {
    PC: 'div[location="혜택 서브메인|온라인 전용상품"] div > a',
    MOBILE: 'div[location="혜택 서브메인|온라인 전용상품"] > div > a',
    APP: 'div[location="혜택 서브메인|온라인 전용상품"] > div > a',
  },

  // 혜택/멤버십 서브메인 > 이벤트 > 이미지
  eventImg: {
    PC: 'div[location="혜택 서브메인|이벤트"] img',
    MOBILE: 'div[location="혜택 서브메인|이벤트"] img',
    APP: 'div[location="혜택 서브메인|이벤트"] img',
  },
  eventSection: 'div.bo-modules-benefit-event-list',
  // 혜택/멤버십 서브메인 > 이벤트 > 전체보기
  eventAllBtn: {
    PC: 'div[location="혜택 서브메인|이벤트"] div > a',
    MOBILE: 'div[location="혜택 서브메인|이벤트"] > div > a',
    APP: 'div[location="혜택 서브메인|이벤트"] > div > a',
  },

  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역
  membership: {
    PC: '.c-content-wrap',
    MOBILE: '',
    APP: '',
  },

  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 멤버십 정보
  membershipInfo: {
    PC: '.c-content-wrap .info-wrap',
    MOBILE: '.c-card-prod-membership',
    APP: 'div.c-card-prod-membership > div.info-body',
  },
  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 탭
  membershipTab: {
    PC: '.c-content-wrap ul[role="tablist"]',
    MOBILE: 'ul[role="tablist"]',
    APP: 'ul[role="tablist"]',
  },

  membershipTab1: {
    PC: '',
    MOBILE: '',
    APP: 'div.swiper-container.is-start.is-end > ul[role="tablist"] > li[id="TAB1"]',
  },
  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 탭 콘텐츠
  membershipContent: {
    PC: '.c-content-wrap .c-tabcontent-box',
    MOBILE: '.submain-section .submain-section',
    APP: '.submain-section .submain-section',
  },
  membershipContent2: {
    PC: '',
    MOBILE: '',
    APP: 'div.submain-section.mypage-membership > div.c-section-md > div.section-title.underline > button.c-link-arr-1-s',
  },

  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 멤버십 이용 내역 > 검색(조회) 버튼
  membershipUseSearchBtn: {
    PC: '.c-content-wrap .c-btn-solid-1',
    MOBILE: '.c-btn-group a',
    APP: '.c-btn-group a',
  },
  //이용내역조회 섹션
  membershipUseSection: '.mypage-membership .underline p.h4',
  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 멤버십 이용 내역 > 검색 정보
  membershipUseSearchInfo: {
    PC: '.c-info-box',
    MOBILE: '.c-noticebox-info-puk',
    APP: 'div.c-noticebox-info-puk.bd > div.info-tit',
  },
  iosMembershipUseSearchInfo: '.c-noticebox-info-puk',

  // 혜택/멤버십 > 멤버십 > 멤버십 이용 내역 > 탭 > 멤버십 변경내역
  membershipTabChange: {
    PC: '.c-content-wrap ul[role="tablist"] li:nth-of-type(2)',
    MOBILE: 'ul[role="tablist"] li:nth-of-type(2)',
    APP: 'div.swiper-container.is-start.is-end > ul[role="tablist"] > li[id="TAB2"]',
  },
  iosMembershipTabChange: '.c-tabmenu-wrap ul li[role="none"]:nth-of-type(2) a',
  eventUrl: '/benefit-event',
  partnerUrl: '/benefit-membership',
  membershipChangeList: 'div.mypage-membership div div ul.list-box-flex',
  membershipList: '.c-tabmenu-wrap div:nth-of-type(2) ul',
  benefitGnb: 'button[data-gtm-click-text="혜택/멤버십"]',
  benefitSub: 'a[data-gtm-click-text="혜택/멤버십"]',
  benefitMemberBtn: 'a[data-gtm-click-text="혜택/멤버십|멤버십"]',
  benefitMembership: 'a[data-gtm-click-text="혜택/멤버십|멤버십|멤버십 이용내역"]',
  memberPartnerUrl: '/benefit-membership',
  myMembershipInfo: '.c-card-prod-membership .info-body li:nth-of-type(1)',
  membershipSearchSection: '//*[@id="cSection"]/div/div/div[3]/div[2]/div/div[2]/div[1]',
  categoryLongBenefitUrl: '/loyal-member-perks',
  categoryEventUrl: '/benefit-event',
  categoryMembershipUrl: '/benefit-membership',
  categoryLinkageUrl: 'combined-discount',
  categoryDiscountPlan: '/price-discount',
} as const;

// 전체 타입
export type UILocator = typeof benefitLocator;

// UIType 기반 필드 추출
export type UILocatorByUIType = {
  [K in keyof UILocator as UILocator[K] extends Record<UIType, string> ? K : never]: Record<
    UIType,
    string
  >;
};
