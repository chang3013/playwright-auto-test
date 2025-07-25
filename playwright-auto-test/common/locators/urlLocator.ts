import { Platform as PLATFORM } from '@common/types/platform-types';

// 타입만 따로 추출
export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];

// 모든 Platform 키를 포함한 baseUrls
export const baseUrls: Record<Platform, string> = {
  [PLATFORM.PC_WEB]: 'https://www.lguplus.com',
  [PLATFORM.MOBILE_WEB]: 'https://m.lguplus.com',
  [PLATFORM.NATIVE_APP]: 'https://app.lguplus.com/apcm/main',
  [PLATFORM.ANDROID_APP]: 'https://app.lguplus.com/apcm/main',
  [PLATFORM.IOS_APP]: 'https://app.lguplus.com/apcm/main',
};

// URL 매핑 함수
const mappingUrls = (path: string): Record<Platform, string> => {
  const urls: Record<Platform, string> = {
    [PLATFORM.PC_WEB]: `${baseUrls[PLATFORM.PC_WEB]}${path}`,
    [PLATFORM.MOBILE_WEB]: `${baseUrls[PLATFORM.MOBILE_WEB]}${path}`,
    [PLATFORM.NATIVE_APP]: `${baseUrls[PLATFORM.NATIVE_APP]}${path}`,
    [PLATFORM.ANDROID_APP]: `${baseUrls[PLATFORM.ANDROID_APP]}${path}`,
    [PLATFORM.IOS_APP]: `${baseUrls[PLATFORM.IOS_APP]}${path}`,
  };
  return urls;
};

// 최종 URL 매핑 객체
export const urlLocator = {
  main: baseUrls,
  ios_main: 'https://app.lguplus.com/apcm/main',
  // 속도측정용 url
  lguplusUrl: 'https://m.lguplus.com',
  ktUrl: 'https://m.kt.com',
  SktUrl: 'https://m.tworld.co.kr',

  // 로그인
  login_v2: 'https://account.lguplus.com/login',
  login_: mappingUrls('/login'),
  login_outh: mappingUrls('/login'),
  login_fallback: mappingUrls('/login/fallback'),

  // 메인
  downloadApp: 'https://m.lguplus.com/apcm/html-push',

  // 외부 서비스 url
  udocUrl: mappingUrls('/pogg/main'),
  ujamUrl: mappingUrls('/ujam'),
  ixiUrl: mappingUrls('/ixi'),

  // GNB - 모바일
  mobile: mappingUrls('/mobile'),

  // 모바일 관련
  mobile_detail: mappingUrls('/mobile/device'),
  plan_detail: mappingUrls('/mobile/plan/mplan'),
  iptv_detail: mappingUrls('/signup'),
  phone: mappingUrls('/mobile/device/phone'),
  plan: mappingUrls('/mobile/plan/mplan/plan-all'),
  direct: mappingUrls('/mobile/plan/mplan/direct'),
  device_2nd: mappingUrls('/mobile/plan/mplan/2nd-device'),
  dual: mappingUrls('/mobile/plan/mplan/dual'),
  smart_device: mappingUrls('/mobile/device/smart-device'),
  esim: mappingUrls('/mobile/esim'),
  usim: mappingUrls('/mobile/usim'),
  usim_card: mappingUrls('/mobile/sim-card/usim'),
  financing_model: mappingUrls('/mobile/financing-model'),
  added_service : mappingUrls('/mobile/plan/addon'),

  // 요금제 관련
  plan_compare: mappingUrls('/plan/all-list/compare'),
  roaming: mappingUrls('/plan/roaming'),

  // GNB - 인터넷/IPTV
  iptv: mappingUrls('/internet-iptv'),
  iptvPlan: mappingUrls('/internet-iptv/internet-iptv-package/plan'),

  // 인터넷/IPTV 온라인 가입 관련
  onlineSignUp: mappingUrls('/signup/package?'),
  applicationForm: mappingUrls('/signup/package/application/v2'),
  applicationForm2: mappingUrls('/signup/package/new-application'),

  // 마이페이지
  mypage: mappingUrls('/mypage'),
  info: mappingUrls('/mypage/info'),
  price_plan: mappingUrls('/mypage/price-plan/mobile'),
  price_plan_change: mappingUrls('/mypage/price-plan/new-mobile'),
  sub_service: mappingUrls('/mypage/sub-service/mobile'),
  bilv: mappingUrls('/mypage/bilv'),
  roam: mappingUrls('/mypage/roam'),
  payinfo: mappingUrls('/mypage/payinfo'),
  micro_pay: mappingUrls('/mypage/micro-pay'),
  stop: mappingUrls('/mypage/info/stop'),
  cancel: mappingUrls('/mypage/info/cancel/detail'),
  member: mappingUrls('/mypage/info/member'),

  // 혜택/멤버십
  benefit: mappingUrls('/benefit'),
  membership: mappingUrls('/benefit/membership'),
  benefit_membership: mappingUrls('/benefit-membership'),
  rank_info: mappingUrls('/benefit-membership/rank-info'),
  benefit_event: mappingUrls('/benefit-event/ongoing'),
  longBene: mappingUrls('/benefit-uplus/loyal-member-perks/longBene'),
  combined_discount: mappingUrls('/benefit-uplus/combined-discount'),
  price_discount: mappingUrls('/benefit-uplus/price-discount'),
  online_benefit: mappingUrls('/benefit-uplus/online-purchase-benefit'),
  memberPrivateBenefit: mappingUrls('/benefit-uplus/member-private-benefit'),

  // 고객지원
  support: mappingUrls('/support'),
  faq: mappingUrls('/support/online/faq'),
  // 스스로해결 가이드
  support_self: mappingUrls('/support/self-troubleshoot/guide'),
  // 이용가이드
  use_guide: mappingUrls('/support/service/use-guide'),

  // 너겟
  nerget: mappingUrls('/direct'),
  nerget_usim: mappingUrls('/mobile/new-usim'),
  usim_detail: mappingUrls('/mobile/usim-detail'),
  usim_signup: mappingUrls('/signup/mobile'),
  nerget_plan: mappingUrls('/direct/plan/mobile/5g'),
  nerget_main: mappingUrls('/nerget/main'),

  // 장바구니
  cart: mappingUrls('/cart'),

  // 검색
  search: mappingUrls('/search'),
  search_result: mappingUrls('/search/result'),
};
