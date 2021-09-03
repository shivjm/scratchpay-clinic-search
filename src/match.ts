import { IAvailability, IClinic } from "./clinic";
import { IState } from "./state";
import { greaterThan, ITime, lessThan } from "./time";

export interface IMatchParameters {
  name?: string;
  state?: string;
  availability?: IRequestAvailability;
}

interface IRequestAvailability {
  from: ITime;
  to: ITime;
}

export function matches(data: IClinic, request: IMatchParameters): boolean {
  return (
    (request.state === undefined || matchState(data.state, request.state)) &&
    (request.name === undefined ||
      matchName(data.normalizedName, request.name)) &&
    (request.availability === undefined ||
      matchAvailability(data.availability, request.availability))
  );
}

/**
 * Tests whether a clinic’s state exactly matches the provided search string by
 * name or by code.
 *
 * @param data The state to test.
 * @param provided The search string (case-insensitive).
 * @returns `true` if the string matches the state name or code, `false` otherwise */
function matchState(data: IState, provided: string): boolean {
  return data.code === provided || data.name === provided;
}

/**
 * Tests whether a clinic’s name contains the provided search
 * string.
 *
 * @param data The clinic name to test (normalized).
 * @param provided The search string (case-insensitive).
 */
function matchName(data: string, provided: string): boolean {
  return data.indexOf(provided.toLowerCase()) > -1;
}

/**
 * Tests whether the availability of a clinic overlaps with the provided time
 * window.
 *
 * @param data The clinic name to test.
 * @param provided The time window.
 */
function matchAvailability(
  data: IAvailability,
  provided: IRequestAvailability,
): boolean {
  return (
    !greaterThan(data.from, provided.to) && !lessThan(data.to, provided.from)
  );
}
