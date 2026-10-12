import { env } from '../../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel = (env.app.logLevel as LogLevel) || 'info';

  private getLevelValue(level: LogLevel): number {
    switch (level) {
      case 'debug': return 0;
      case 'info': return 1;
      case 'warn': return 2;
      case 'error': return 3;
      default: return 1;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.getLevelValue(level) >= this.getLevelValue(this.level);
  }

  private formatMessage(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    return '[' + timestamp + '] [' + level.toUpperCase() + '] ' + message + (data ? ' ' + JSON.stringify(data) : '');
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error);
      // Here we could also send to Sentry, Crashlytics, etc.
    }
  }
}

export const logger = new Logger();
