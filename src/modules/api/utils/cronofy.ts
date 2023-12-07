import { Calendar as ICalendar, Period as IPeriod } from "~api/interfaces/providers/cronofy";
import AppError from "~src/models/error";
import { ERRORS } from "~src/interfaces/app/app";
import { formatDateTime, setSpecificTime } from "~src/utils/date";

export const getCalendar = (list: ICalendar[]): ICalendar => {
  const calendar = list.find(
    (calendar) => calendar.calendar_primary && !calendar.calendar_readonly && !calendar.calendar_deleted
  );

  if (!calendar) {
    throw new AppError(ERRORS.NO_SUCH_ENTITY, "No valid calendars");
  }

  return calendar;
};

export const getQueryPeriods = (date: Date): IPeriod[] => {
  return [
    {
      start: formatDateTime(setSpecificTime(date, 11, 30)),
      end: formatDateTime(setSpecificTime(date, 12, 0)),
    },
    {
      start: formatDateTime(setSpecificTime(date, 12, 0)),
      end: formatDateTime(setSpecificTime(date, 12, 30)),
    },
    {
      start: formatDateTime(setSpecificTime(date, 12, 30)),
      end: formatDateTime(setSpecificTime(date, 13, 0)),
    },
  ];
};
