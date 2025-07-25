import { AppiumServerUtils } from '../AppiumServerUtils.js';

const port = 4725; // ✅ AOS는 고정 포트 4725 사용
const platform = 'aos'; // ✅ 명시적으로 'aos'

AppiumServerUtils.start({
  port,
  platform,
})
  .then(() => {
    console.log(`[Appium] AOS 서버가 실행되었습니다. (포트: ${port})`);
  })
  .catch(err => {
    console.error(`[Appium] AOS 서버 실행 실패:`, err);
    process.exit(1);
  });
