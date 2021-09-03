import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Type } from "@sinclair/typebox";

import { TIME_RE } from "../time";

/** A regular expression to match a time (from 00:00 to 24:00). */
export const Time = Type.RegEx(TIME_RE);

/** A regular expression to match one non-whitespace character. */
export const NonWhitespace = Type.RegEx(/\S/);

/** A time window. */
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
