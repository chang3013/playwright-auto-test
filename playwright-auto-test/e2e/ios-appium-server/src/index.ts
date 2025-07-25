import { AppiumServerUtils } from '../AppiumServerUtils.js';

const port = Number(process.env.PORT) || 4723;
const platform = process.env.PLATFORM?.toLowerCase() === 'aos' ? 'aos' : 'ios';

AppiumServerUtils.start({
  port,
  platform,
})
  .then(() => {
    console.log(`[Appium] 서버가 실행되었습니다. (포트: ${port})`);
  })
  .catch((err: unknown) => {
    console.error(`[Appium] 서버 실행 실패:`, err);
    process.exit(1);
  });
