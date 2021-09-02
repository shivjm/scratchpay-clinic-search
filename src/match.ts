import { IClinic } from "./clinic";
import { SearchRequest } from "./schema/request";

export function matches(_data: IClinic, _request: SearchRequest): boolean {
  return false;
}
