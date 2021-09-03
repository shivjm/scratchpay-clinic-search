import got from "got";

import { IClinic, parseClinicFromData } from "./clinic";
import { ClinicData } from "./schema/data";

export async function fetchData(
  apiUrl: string,
  types: readonly string[],
): Promise<readonly ClinicData[]> {
  // TODO add timeout
  const promises = Promise.all(types.map((type) => fetchFile(apiUrl, type)));

  return (await promises).flat();
}

async function fetchFile(
  apiUrl: string,
  type: string,
): Promise<readonly ClinicData[]> {
  const json = await got(`${apiUrl}${type}-clinics.json`).json();

  if (!Array.isArray(json)) {
    throw new Error(`Invalid ${type} data file`);
  }

  return json.flatMap((c) => {
    if (!ClinicData(c)) {
      return [];
    }

    return [c];
  });
}

export function parseData(data: readonly ClinicData[]): readonly IClinic[] {
  return data.map(parseClinicFromData);
}
