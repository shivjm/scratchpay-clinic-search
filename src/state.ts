// based on
// https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json
import states from "../data/states.json";

export interface IState {
  name: string;
  code: string;
}

const STATES_BY_NAME = ((data) => {
  const obj: Record<string, IState> = {};

  for (const { code, name } of data) {
    obj[name.toLowerCase()] = { code, name };
  }

  return Object.freeze(obj);
})(states);

const STATES_BY_CODE = ((data) => {
  const obj: Record<string, IState> = {};

  for (const { code, name } of data) {
    obj[code.toLowerCase()] = { code, name };
  }

  return Object.freeze(obj);
})(states);

export function findStateByName(name: string): IState {
  const found = STATES_BY_NAME[name.toLowerCase()];
  if (found !== undefined) {
    return found;
  }

  throw new Error(`Unknown state name: ${name}`);
}

export function findStateByCode(code: string): IState {
  const found = STATES_BY_CODE[code.toLowerCase()];
  if (found !== undefined) {
    return found;
  }

  throw new Error(`Unknown state name: ${code}`);
}
