import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";
import addFormats from "ajv-formats";

/** A {RegExp} to match an hour and minute. */
const TIME_RE = /^(?:(?:[01][0-9]|2[0-3]):[0-5][0-9])$/;

const Time = Type.Union([Type.RegEx(TIME_RE), Type.Literal("24:00")]);

const Name = Type.RegEx(/\S/);

const State = Type.RegEx(/\S/);

const Availability = Type.Object(
  {
    from: Time,
    to: Time,
  },
  { additionalProperties: false },
);

/** A TypeBox {TSchema} for a partially-validated search request. */
const SearchRequestSchema = Type.Object(
  {
    name: Type.Optional(Name),
    state: Type.Optional(State),
    availability: Type.Optional(Availability),
  },
  { additionalProperties: false },
);

/** A partially-validated search request. */
export type SearchRequest = Static<typeof SearchRequestSchema>;

// taken from the TypeBox readme
const AJV = addFormats(new Ajv({ strict: true }), [
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

/** Tries to parse an object as a search request and assert its type as `SearchRequest`.
 *
 * @returns `true` if successful, `false` otherwise */
export const SearchRequest = AJV.compile<SearchRequest>(SearchRequestSchema);
