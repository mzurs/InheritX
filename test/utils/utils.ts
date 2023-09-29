import { Ed25519KeyIdentity } from "@dfinity/identity";

const baseOfEight = 100000000;

const baseOfTwelve = 1000000000000;

// Convert to BigInt e8s format to human readable
export const e8sToHuman = (bigIntValue: any) => {
  return Number(bigIntValue) / baseOfEight;
};

// Convert to BigInt e12s format to human readable
export const e12sToHuman = (bigIntValue: any) => {
  return Number(bigIntValue) / baseOfTwelve;
};

// Convert human readable number to e8s format in BigInt
export const humanToE8s = (numberValue: number) => {
  return BigInt(numberValue * baseOfEight);
};

// Convert human readable number to e12s format in BigInt
export const humanToE12s = (numberValue: number) => {
  return BigInt(numberValue * baseOfTwelve);
};

export function createRandomIdentity() {
  return Ed25519KeyIdentity.generate();
}

export const randomIdentifier = () =>
  parseInt(String(Math.random() * 10 ** 5));

 function getSubAccountArray(subaccount: number): number[] {
  return Array(28)
    .fill(0)
    .concat(to32Bits(subaccount ? subaccount : 0));
}

 function to32Bits(number: number): number[] {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, number);
  return Array.from(new Uint8Array(b));
}
export function getIdentifierBlob(identifier: number): Uint8Array {
  return Uint8Array.from(getSubAccountArray(identifier));
}
