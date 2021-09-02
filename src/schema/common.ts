import Ajv from "ajv";
import addFormats from "ajv-formats";
import { Type } from "@sinclair/typebox";

/** A {RegExp} to match an hour and minute. */
const TIME_RE = /^(?:(?:[01][0-9]|2[0-3]):[0-5][0-9])$/;

const Time = Type.Union([Type.RegEx(TIME_RE), Type.Literal("24:00")]);

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
