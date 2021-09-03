import { ClinicData } from "./schema/data";
import { findStateByCode, findStateByName, IState } from "./state";
import { normalize } from "./text";
import { formatTime, ITime, parseTime } from "./time";

export interface IAvailability {
  from: ITime;
  to: ITime;
}

/** A uniform interface that multiple kinds of clinic data are parsed into. */
export interface IClinic {
  name: string;
  state: IState;
  availability: IAvailability;

  /** A normalized version of the name, used internally for searching. */
  normalizedName: string;
}

/** Parses multiple kinds of clinic data into a uniform interface. */
export function parseClinicFromData(data: ClinicData): IClinic {
  if ("name" in data) {
    // dental clinic
    return {
      name: data.name,
      state: findStateByName(data.stateName),
      availability: {
        from: parseTime(data.availability.from),
        to: parseTime(data.availability.to),
      },
      normalizedName: normalize(data.name.toLowerCase()),
    };
  } else {
    // vet clinic
    return {
      name: data.clinicName,
      state: findStateByCode(data.stateCode),
      availability: {
        from: parseTime(data.opening.from),
        to: parseTime(data.opening.to),
      },
      normalizedName: normalize(data.clinicName.toLowerCase()),
    };
  }
}

/**
 * Turns an `IClinic` into an object that can be returned to the user as JSON.
 * Excludes internal properties. */
export function prepareClinicForSerialization(
  clinic: IClinic,
): Record<string, unknown> {
  return {
    name: clinic.name,
    state: clinic.state,
    availability: {
      from: formatTime(clinic.availability.from),
      to: formatTime(clinic.availability.to),
    },
  };
}
