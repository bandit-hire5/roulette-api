import { WeekDays } from "~src/interfaces/app/app";

export const getUnixTimestampFromDate = (date: Date): number => Math.round(date.getTime() / 1000);

export const getCurrentUnixTimestamp = (): number => getUnixTimestampFromDate(new Date());

export const getDateFromUnixTimestamp = (timestamp: number): Date => new Date(timestamp * 1000);

export const todayIs = (day: WeekDays): boolean => Object.values(WeekDays)[new Date().getDay()] === day;

export const addSecondsToDate = (date: Date, seconds: number): Date => {
  return new Date(date.getTime() + seconds * 1000);
};

export const isTimestampExpired = (timestamp: number): boolean => timestamp <= getCurrentUnixTimestamp();

export const scheduleDateByTimestamp = (timestamp: number, minSeconds = 0): Date => {
  const currentDate = new Date();
  let scheduleDate = new Date(timestamp * 1000);

  if (scheduleDate < currentDate) {
    scheduleDate = addSecondsToDate(currentDate, minSeconds);
  }

  return scheduleDate;
};
