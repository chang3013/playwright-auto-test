// AppiumServerUtils.ts
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 설정 (ESM 대응)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AppiumServerUtils {
  public static async start({
    port,
    platform,
    logDirPath,
  }: {
    port: number;
    platform: 'ios' | 'aos';
    logDirPath?: string;
  }): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // logDirPath가 있으면 그걸 사용, 없으면 기본값으로 __dirname/logs 사용
    const logDir = logDirPath ?? path.resolve(__dirname, 'logs');
    fs.mkdirSync(logDir, { recursive: true });

    const logFile = path.join(logDir, `${platform}_appium_${timestamp}.log`);
    const out = fs.openSync(logFile, 'a');
    const err = fs.openSync(logFile, 'a');

    // newCommandTimeout 30분(1800초) 설정 포함
    const shellCommand = `npx appium --port ${port} --base-path /wd/hub --default-capabilities '{"appium:newCommandTimeout":1800}'`;

    spawn('sh', ['-c', `${shellCommand} >> "${logFile}" 2>&1`], {
      cwd: process.cwd(),
      detached: true,
      stdio: ['ignore', out, err], // 로그는 파일로만 저장
    }).unref();

    console.info(
      `[${platform.toUpperCase()} - AppiumServer] ${platform} 서버 실행됨. 로그 경로: ${logFile}`,
    );
  }

  public static stop(port: number) {
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

