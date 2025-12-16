import type { Dayjs, OpUnitType } from "dayjs";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import "dayjs/locale/pt";
import "dayjs/locale/en";
import { TFunction } from "i18next";

// ----------------------------------------------------------------------

export type LocaleLangs = "" | "es" | "pt" | "en";

// ----------------------------------------------------------------------

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: "DD MMM YYYY h:mm a", // 17 Apr 2022 12:00 am
  date: "DD MMM YYYY", // 17 Apr 2022
  shortDate: "DD MMM", // 17 Apr
  time: "h:mm a", // 12:00 am
  split: {
    dateTime: "DD/MM/YYYY h:mm a", // 17/04/2022 12:00 am
    date: "DD/MM/YYYY", // 17/04/2022
  },
  paramCase: {
    dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
    date: "DD-MM-YYYY", // 17-04-2022
  },
  toApi: {
    withTzone: "YYYY-MM-DDTHH:mm:ssZ[Z]", // 2024-07-09T23:59:59-03:00Z
    UTC: "YYYY-MM-DDTHH:mm:ss.SSS[Z]", // 2024-07-09T23:59:59.999Z
  },
};

// ----------------------------------------------------------------------

export function today(format?: string) {
  return dayjs(new Date()).startOf("day").format(format);
}

// ----------------------------------------------------------------------

export function toUTC(date: DatePickerFormat, format: string = formatStr.toApi.UTC) {
  return dayjs.utc(date).format(format);
}

// ----------------------------------------------------------------------

export function initOfDay(date: DatePickerFormat, format?: string) {
  return dayjs(date).startOf("day").format(format);
}

// ----------------------------------------------------------------------

export function endOfDay(date: DatePickerFormat, format?: string) {
  return dayjs(date).endOf("day").format(format);
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022 12:00 am
 */
export function fDateTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.dateTime) : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2022
 */
export function fDate(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.split.date) : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 12:00 am
 */
export function fTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).format(format ?? formatStr.time) : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: 1713250100
 */
export function fTimestamp(date: DatePickerFormat) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid ? dayjs(date).valueOf() : "Invalid time value";
}

// ----------------------------------------------------------------------

/** output: a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat, locale: LocaleLangs = "es") {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  dayjs.locale(locale);

  return isValid ? dayjs(date).toNow(true) : "Invalid time value";
}

/** output: a few seconds, 2 years
 */
export function fFromNow(
  date: DatePickerFormat,
  locale: LocaleLangs = "es",
  format?: string,
  t?: TFunction
) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  if (!isValid) {
    return "Invalid time value";
  }

  dayjs.locale(locale);

  const diffMin = dayjs().diff(dayjs(date), "minutes");

  if (diffMin < 1) return t?.("menos de un minuto");

  if (diffMin < 60) return `${diffMin} minuto${diffMin === 1 ? "" : "s"}`;

  const diffHou = dayjs().diff(dayjs(date), "hour");

  if (diffHou < 24) return `${diffHou} hora${diffHou === 1 ? "" : "s"}`;

  const diffDays = dayjs().diff(dayjs(date), "day");

  if (diffDays === 1) return `Ayer`;

  return dayjs(date).format(format ?? formatStr.date);
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsBetween(
  inputDate: DatePickerFormat,
  startDate: DatePickerFormat,
  endDate: DatePickerFormat
) {
  if (!inputDate || !startDate || !endDate) {
    return false;
  }

  const formattedInputDate = fTimestamp(inputDate);
  const formattedStartDate = fTimestamp(startDate);
  const formattedEndDate = fTimestamp(endDate);

  if (formattedInputDate && formattedStartDate && formattedEndDate) {
    return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
  }

  return false;
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsAfter(startDate: DatePickerFormat, endDate: DatePickerFormat) {
  return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/** output: boolean
 */
export function fIsSame(
  startDate: DatePickerFormat,
  endDate: DatePickerFormat,
  units?: OpUnitType
) {
  if (!startDate || !endDate) {
    return false;
  }

  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  if (!isValid) {
    return "Invalid time value";
  }

  return dayjs(startDate).isSame(endDate, units ?? "year");
}

// ----------------------------------------------------------------------

/** output:
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */
export function fDateRangeShortLabel(
  startDate: DatePickerFormat,
  endDate: DatePickerFormat,
  initial?: boolean
) {
  const isValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();

  const isAfter = fIsAfter(startDate, endDate);

  if (!isValid || isAfter) {
    return "Invalid time value";
  }

  let label = `${fDate(startDate)} - ${fDate(endDate)}`;

  if (initial) {
    return label;
  }

  const isSameYear = fIsSame(startDate, endDate, "year");
  const isSameMonth = fIsSame(startDate, endDate, "month");
  const isSameDay = fIsSame(startDate, endDate, "day");

  if (isSameYear && !isSameMonth) {
    label = `${fDate(startDate, "DD MMM")} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && !isSameDay) {
    label = `${fDate(startDate, "DD")} - ${fDate(endDate)}`;
  } else if (isSameYear && isSameMonth && isSameDay) {
    label = `${fDate(endDate)}`;
  }

  return label;
}

// ----------------------------------------------------------------------

export type DurationProps = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fAdd({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: DurationProps) {
  const result = dayjs()
    .add(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

/** output: '2024-05-28T05:55:31+00:00'
 */
export function fSub({
  years = 0,
  months = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
}: DurationProps) {
  const result = dayjs()
    .subtract(
      dayjs.duration({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
      })
    )
    .format();

  return result;
}

// ----------------------------------------------------------------------

/** output: 00:30
 */
export function fTimeDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor((duration % 3600) % 60);

  if (hours > 0) {
    return `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}`;
  }

  return `${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`;
}

// ----------------------------------------------------------------------

/**
 * output:
 * {
 *   days: 01,
 *   hours: 12,
 *   minutes: 23,
 *   seconds: 46
 * }
 */
export function getTimeDuration(duration: number) {
  const dur = dayjs.duration(duration);

  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  return {
    days: days > 0 ? (days < 10 ? `0${days}` : days) : undefined,
    hours: hours > 0 ? (hours < 10 ? `0${hours}` : hours) : undefined,
    minutes: minutes > 0 ? (minutes < 10 ? `0${minutes}` : minutes) : undefined,
    seconds: seconds > 0 ? (seconds < 10 ? `0${seconds}` : seconds) : undefined,
  };
}
