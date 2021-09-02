import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Type } from "@sinclair/typebox";

import { TIME_RE } from "../time";

const Time = Type.RegEx(TIME_RE);

export const NonWhitespace = Type.RegEx(/\S/);

export const Availability = Type.Object(
  {
    from: Time,
    to: Time,
  },
  { additionalProperties: false },
);

// taken from the TypeBox readme
export const AJV = addFormats(new Ajv({ strict: true }), [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
])
  .addKeyword("kind")
  .addKeyword("modifier");
