// AppiumServerUtils.ts
import { execSync, spawn } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AppiumServerUtils {
  static async start({
    port,
    platform,
    logDirPath,
  }: {
    port: number;
    platform: 'ios' | 'aos';
    logDirPath?: string;
  }) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // logDirPath가 주어졌으면 그걸 쓰고, 없으면 __dirname/logs 사용
    const logDir = logDirPath ?? path.resolve(__dirname, 'logs');
    mkdirSync(logDir, { recursive: true });

    const logPath = path.join(logDir, `${platform}_appium_${timestamp}.log`);
    // 👇 세션 유지 시간 추가됨 (기본 60초 → 1800초로 확장)
    const shellCommand = `npx appium --port ${port} --base-path /wd/hub --default-capabilities '{"appium:newCommandTimeout":1800}' >> "${logPath}" 2>&1`;

    const subprocess = spawn('sh', ['-c', shellCommand], {
      cwd: process.cwd(),
      detached: true,
      stdio: 'ignore', // 👈 콘솔 출력 완전 차단
    });

    subprocess.unref();

    console.info(`[AppiumServer] ${platform} 서버 실행됨. 로그 경로: ${logPath}`);
  }

  static stop(port: number) {
    try {
      const result = execSync(`lsof -ti tcp:${port}`).toString().trim();
      if (result) {
        const pids = result.split('\n');
        for (const pid of pids) {
          process.kill(Number(pid), 'SIGKILL');
        }
        console.info(`[AppiumServer] 포트 ${port} 종료됨`);
      } else {
        console.warn(`[AppiumServer] 포트 ${port}에서 실행 중인 프로세스 없음`);
      }
    } catch (e) {
      console.warn(`[AppiumServer] 포트 ${port} 종료 실패`, e);
    }
  }
}
