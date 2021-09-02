import { Static, Type } from "@sinclair/typebox";

import { AJV, Availability, NonWhitespace } from "./common";

const StateCode = Type.RegEx(/[A-Z]{2}/);

const DentalClinicDataSchema = Type.Object(
  {
    name: NonWhitespace,
    stateName: NonWhitespace,
    availability: Availability,
  },
  { additionalProperties: false },
);

const VetClinicDataSchema = Type.Object({
  clinicName: NonWhitespace,
  stateCode: StateCode,
  opening: Availability,
});

const ClinicDataSchema = Type.Union([
  DentalClinicDataSchema,
  VetClinicDataSchema,
]);

export type ClinicData = Static<typeof ClinicDataSchema>;

/** Tries to parse an object as a clinic and assert its type as `ClinicData`.
 *
 * @returns `true` if successful, `false` otherwise */
export const ClinicData = AJV.compile<ClinicData>(ClinicDataSchema);
