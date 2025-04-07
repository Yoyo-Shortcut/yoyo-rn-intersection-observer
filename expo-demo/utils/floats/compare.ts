export const areFloatsAlmostEqual = (a: number, b: number, epsilon = 1e-10) => {
  return Math.abs(a - b) < epsilon;
};

export const areFloatsAlmostEqualWorklet = (
  a: number,
  b: number,
  epsilon = 1e-10
) => {
  "worklet";
  return Math.abs(a - b) < epsilon;
};

export const isFloatLargerEqual = (a: number, b: number, epsilon = 1e-10) => {
  return a > b || areFloatsAlmostEqual(a, b, epsilon);
};

export const isFloatLargerEqualWorklet = (
  a: number,
  b: number,
  epsilon = 1e-10
) => {
  "worklet";
  return a > b || areFloatsAlmostEqualWorklet(a, b, epsilon);
};

export const isFloatSmallerEqual = (a: number, b: number, epsilon = 1e-10) => {
  return a < b || areFloatsAlmostEqual(a, b, epsilon);
};

export const isFloatSmallerEqualWorklet = (
  a: number,
  b: number,
  epsilon = 1e-10
) => {
  "worklet";
  return a < b || areFloatsAlmostEqualWorklet(a, b, epsilon);
};
