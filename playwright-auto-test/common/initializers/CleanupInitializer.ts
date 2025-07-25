import { FILE_RETENTION_DAYS } from '@common/config/baseConfig';
import { POC_RESULT_PATHS } from '@common/constants/PathConstants';
import { Logger } from '@common/logger/customLogger';
import { POCEnv } from '@common/utils/env/POCEnv';
import fs from 'fs';
import path from 'path';
import type winston from 'winston';

export class CleanupInitializer {
  private readonly pocList = POCEnv.getPOCList();
  private readonly logger: winston.Logger;

  constructor() {
    const currentPoc = POCEnv.getType();
    this.logger = Logger.getLogger(currentPoc.toUpperCase()) as winston.Logger;
  }

  /**
   * 오래된 테스트 결과 정리 실행
   */
  public async run(): Promise<void> {
    for (const poc of this.pocList) {
      this.logger.info(`[${poc}] 정리 작업 시작`);
      const now = Date.now();
      const resultPaths = POC_RESULT_PATHS(poc);

      for (const [key, dirs] of Object.entries(resultPaths)) {
        const dirList = Array.isArray(dirs) ? dirs : [dirs];
        const maxAgeMs =
          (FILE_RETENTION_DAYS[key as keyof typeof FILE_RETENTION_DAYS] || 14) * 86400000;

        for (const dirPath of dirList) {
          if (!fs.existsSync(dirPath)) {
            this.logger.warn(`[${poc}] 정리할 폴더가 없음: ${dirPath}`);
            continue;
          }

          try {
            const files = fs.readdirSync(dirPath);

            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const stats = fs.statSync(filePath);

              if (now - stats.mtimeMs > maxAgeMs) {
                await fs.promises.unlink(filePath);
                this.logger.info(`[${poc}] 오래된 파일 삭제됨: ${filePath}`);
              }
            }
          } catch (err) {
            this.logger.error(`[${poc}] 폴더 처리 중 오류 발생: ${dirPath}, 오류: ${err}`);
          }
        }
      }
      this.logger.info(`[${poc}] 정리 작업 완료`);
    }
  }
}
