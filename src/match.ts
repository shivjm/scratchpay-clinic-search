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
 * Tests whether the state in the data matches the provided search string by
 * name or by code.
 *
 * @returns `true` if the string matches the state name or code, `false` otherwise */
function matchState(data: IState, provided: string): boolean {
  return data.code === provided || data.name === provided;
}

function matchName(data: string, provided: string): boolean {
  return data.indexOf(provided.toLowerCase()) > -1;
}

function matchAvailability(
  data: IAvailability,
  provided: IRequestAvailability,
): boolean {
  return (
    !greaterThan(data.from, provided.to) && !lessThan(data.to, provided.from)
  );
}
