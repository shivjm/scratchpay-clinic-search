import { ClinicData } from "./schema/data";
import { findStateByCode, findStateByName, IState } from "./state";
import { ITime, parseTime } from "./time";

export interface IAvailability {
  from: ITime;
  to: ITime;
}

export interface IClinic {
  name: string;
  state: IState;
  availability: IAvailability;
}

export function parseClinicFromData(data: ClinicData): IClinic {
  if ("name" in data) {
    return {
      name: data.name,
      state: findStateByName(data.stateName),
      availability: {
        from: parseTime(data.availability.from),
        to: parseTime(data.availability.to),
      },
    };
  } else {
    return {
      name: data.clinicName,
      state: findStateByCode(data.stateCode),
      availability: {
        from: parseTime(data.opening.from),
        to: parseTime(data.opening.to),
      },
    };
  }
}
