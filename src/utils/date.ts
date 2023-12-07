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

export const getNextWorkingDay = (currentDate: Date): Date => {
  const nextDay = new Date(currentDate);

  nextDay.setDate(currentDate.getDate() + 1);

  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
};

export const setSpecificTime = (date: Date, hours = 0, min = 0, sec = 0, ms = 0): Date => {
  date.setHours(hours, min, sec, ms);

  return date;
};

export const formatDateTime = (date: Date): string => date.toISOString().slice(0, 19) + "Z";
