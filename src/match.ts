import { IAvailability, IClinic } from "./clinic";
import { SearchRequest } from "./schema/request";
import { IState } from "./state";
import { normalize } from "./text";
import { greaterThan, lessThan, parseTime } from "./time";

interface IRequestAvailability {
  from: string;
  to: string;
}

export function matches(data: IClinic, request: SearchRequest): boolean {
  return (
    (request.state === undefined ||
      matchState(data.state, normalize(request.state))) &&
    (request.name === undefined ||
      matchName(data.normalizedName, normalize(request.name))) &&
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
    !greaterThan(data.from, parseTime(provided.to)) &&
    !lessThan(data.to, parseTime(provided.from))
  );
}
