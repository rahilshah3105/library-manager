import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.DEBUG;
  private enableTimestamp: boolean = true;

  constructor() {
    // Set log level based on environment
    // In production, you might want to set this to LogLevel.WARN or LogLevel.ERROR
    if (this.isProduction()) {
      this.logLevel = LogLevel.WARN;
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  enableTimestamps(enable: boolean): void {
    this.enableTimestamp = enable;
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.DEBUG, message, optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.INFO, message, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.WARN, message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.ERROR, message, optionalParams);
  }

  private log(level: LogLevel, message: string, optionalParams: any[]): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = this.enableTimestamp ? `[${this.getTimestamp()}]` : '';
    const levelName = this.getLevelName(level);
    const formattedMessage = `${timestamp} [${levelName}] ${message}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...optionalParams);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...optionalParams);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...optionalParams);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...optionalParams);
        break;
    }
  }

  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'DEBUG';
      case LogLevel.INFO:
        return 'INFO';
      case LogLevel.WARN:
        return 'WARN';
      case LogLevel.ERROR:
        return 'ERROR';
      default:
        return 'LOG';
    }
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private isProduction(): boolean {
    // This checks if we're in production mode
    // You can also use environment variables here
    return false; // Set to true or use environment.production
  }
}
