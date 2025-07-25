# playwright-auto-test
하이브리드 앱, 실디바이스 기반 모바일 자동화 테스트 프로젝트입니다.  
Android/iOS 앱과 모바일웹, PC웹을 포함한 풀 E2E 환경을 구성하여 테스트를 진행합니다.

## 프로젝트 구성
├── common/ # 공통 유틸 (Appium 제어, 로그,poc분기,locator/selector,action(함수) 등)
├── e2e/
│ ├── ios-app/ # iOS 하이브리드 앱 테스트
│ ├── android-app/ # Android 하이브리드 앱 테스트
│ ├── pc-web/ # PC 웹 테스트
│ ├── pc-mobile-web/ # 모바일 웹 테스트 (PC 브라우저 기반)
│ ├── aos-appium-server/ # aos 전용 appium server (내부4723 - 외부 4723)
│ └── ios-appium-server/ # ios 전용 appium server (내부4723 - 외부 4725)
│ globalSetup.ts - 테스트 실행(각 POC) 시, 테스트 환경 제어
│ globalTearDown.ts - 테스트 종료(각 POC) 시, 테스트 환경 정리 제어


appium-server  관련 특이사항
 - ios-app/android-app 실행 전 health-check를 통해 appium server 먼저 컨테이너 실행 후 진행하도록 함

### TODO : 현재 병렬실행구조 작업 진행중
 - pnpm run test:ios
 - pnpm run test:pc
 - pnpm run test:mw
 - pnpm run test:aos 


단일실행은 정상동작

pnpm run test:all 구조 작업 진행중 / docker-compose 통해 실행 구조 작업중
CI/CD 병렬 테스트 통합
