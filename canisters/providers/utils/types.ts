import { Opt, Record, Vec, nat32 } from "azle";

export type TestatorDetails = Record<{
  firstNames: Vec<string>;
  lastName: string;
  sex: string;
  birthDate: string;
  birthLocationCode: string;
  deathDate: string;
  deathLocationCode: string;
}>;

export type CheckTestatorDetailsWithID = Record<{
  result: boolean;
  message: Opt<string>;
}>;

export type TestatorResponse = Record<{
  request: Record<{
    sort: Vec<
      Record<{
        score: string;
      }>
    >;
  }>;
  response: Record<{
    total: nat32;
    maxScoreES: Opt<nat32>;
    size: nat32;
    page: nat32;
    delay: nat32;
    persons: Opt<Vec<Person>>;
  }>;
}>;

export type Person = Record<{
  score: nat32;
  source: string;
  sourceLine: nat32;
  scores: Record<{
    score: nat32;
    es: nat32;
  }>;
  id: string;
  name: Record<{
    first: Vec<string>;
    last: string;
  }>;
  sex: string;
  birth: Record<{
    date: string;
    location: Record<{
      city: string;
      code: string;
      codePostal: Vec<string>;
      codeHistory: Vec<string>;
      departmentCode: string;
      country: string;
      countryCode: string;
      latitude: nat32;
      longitude: nat32;
    }>;
  }>;
  death: Record<{
    date: string;
    certificateId: string;
    age: nat32;
    location: Record<{
      city: Vec<string>;
      code: string;
      codePostal: Vec<string>;
      codeHistory: string;
      departmentCode: string;
      country: string;
      countryCode: string;
      latitude: nat32;
      longitude: nat32;
    }>;
  }>;
}>;
