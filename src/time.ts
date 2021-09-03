/** A regular expression to match an hour and minute (including `24:00`). */
export const TIME_RE = /^(?:(?:[01][0-9]|2[0-3]):[0-5][0-9])|24:00$/;

export interface ITime {
  hour: number;
  minute: number;
}

/** A regular expression to match the colon. This is trivial but it avoids re-compilation. */
const DELIMITER = /:/;

/** Parses a string into an `ITime`. Throws an error if the string is not a valid time. */
export function parseTime(hourAndMinutes: string): ITime {
  if (!TIME_RE.test(hourAndMinutes)) {
    throw new Error(`${hourAndMinutes} is not a valid time`);
  }

  const [hour, minute] = hourAndMinutes.split(DELIMITER);
  return {
    hour: parseDecimalInteger(hour),
    minute: parseDecimalInteger(minute),
  };
}

export function formatTime(time: ITime): string {
  return `${formatAsTwoDigits(time.hour)}:${formatAsTwoDigits(time.minute)}`;
}

function parseDecimalInteger(value: string): number {
  return parseInt(value, 10);
}

function formatAsTwoDigits(component: number): string {
  return component.toString().padStart(2, "0");
}

export function greaterThan(a: ITime, b: ITime): boolean {
  return compare(a, b) === 1;
}

export function lessThan(a: ITime, b: ITime): boolean {
  return compare(a, b) === -1;
}

export function compare(a: ITime, b: ITime): number {
  if (a.hour > b.hour) {
    return 1;
  }

  if (b.hour > a.hour) {
    return -1;
  }

  if (a.minute > b.minute) {
    return 1;
  }

  if (b.minute > a.minute) {
    return -1;
  }

  return 0;
}
