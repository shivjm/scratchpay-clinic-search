import { Static, Type } from "@sinclair/typebox";

import { AJV, Availability, NonWhitespace, Time } from "./common";

const Name = NonWhitespace;

const State = NonWhitespace;

/** A TypeBox {TSchema} for a partially-validated search request. */
const SearchRequestSchema = Type.Object(
  {
    name: Type.Optional(Name),
    state: Type.Optional(State),
    from: Type.Optional(Time),
    to: Type.Optional(Time),
  },
  { additionalProperties: false },
);

/** A partially-validated search request. */
export type SearchRequest = Static<typeof SearchRequestSchema>;

/** Tries to parse an object as a search request and assert its type as `SearchRequest`.
 *
 * @returns `true` if successful, `false` otherwise */
export const SearchRequest = AJV.compile<SearchRequest>(SearchRequestSchema);
