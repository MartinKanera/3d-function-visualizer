import { debounce } from "./debounce";

const FUNCTION_INPUT = document.querySelector<HTMLInputElement>("#function");
const MIN_X_INPUT = document.querySelector<HTMLInputElement>("#minX");
const MAX_X_INPUT = document.querySelector<HTMLInputElement>("#maxX");
const MIN_Y_INPUT = document.querySelector<HTMLInputElement>("#minY");
const MAX_Y_INPUT = document.querySelector<HTMLInputElement>("#maxY");
const MIN_Z_INPUT = document.querySelector<HTMLInputElement>("#minZ");
const MAX_Z_INPUT = document.querySelector<HTMLInputElement>("#maxZ");
const SEGMENTS_X_INPUT = document.querySelector<HTMLInputElement>("#segmentsX");
const SEGMENTS_Z_INPUT = document.querySelector<HTMLInputElement>("#segmentsZ");
const MAX_Y_COLOR_INPUT =
  document.querySelector<HTMLInputElement>("#maxYColor");
const MID_Y_COLOR_INPUT =
  document.querySelector<HTMLInputElement>("#midYColor");
const MIN_Y_COLOR_INPUT =
  document.querySelector<HTMLInputElement>("#minYColor");
const RUN_BUTTON = document.querySelector<HTMLButtonElement>("#run");

const SNACKBAR = document.querySelector("#snackbar");

const required = (name: string) => (value: number) => {
  if (!value && value !== 0) {
    return `${name} field is required`;
  }

  return null;
};

const number = (name: string) => (value: number) => {
  if (isNaN(value)) {
    return `${name} field must be a number`;
  }

  return null;
};

const smallerThan = (name: string, max: number) => (value: number) => {
  if (value >= max) {
    return `${name} field must be smaller than ${max}`;
  }

  return null;
};

const biggerThan = (name: string, min: number) => (value: number) => {
  if (value <= min) {
    return `${name} field must be bigger than ${min}`;
  }

  return null;
};

const rules = new WeakMap<
  HTMLInputElement,
  ((value: number) => string | null)[]
>();
rules.set(FUNCTION_INPUT!, []);
rules.set(MIN_X_INPUT!, [
  required("min X"),
  number("min X"),
  smallerThan("min X", 0),
]);
rules.set(MAX_X_INPUT!, [
  required("max X"),
  number("max X"),
  biggerThan("max X", 1),
]);
rules.set(MIN_Y_INPUT!, [
  required("min Y"),
  number("min Y"),
  smallerThan("min Y", 0),
]);
rules.set(MAX_Y_INPUT!, [
  required("max Y"),
  number("max Y"),
  biggerThan("max Y", 1),
]);

rules.set(MIN_Z_INPUT!, [
  required("min Z"),
  number("min Z"),
  smallerThan("min Z", 0),
]);

rules.set(MAX_Z_INPUT!, [
  required("max Z"),
  number("max Z"),
  biggerThan("max Z", 1),
]);

rules.set(SEGMENTS_X_INPUT!, [
  required("segments X"),
  number("segments X"),
  biggerThan("segments X", 1),
]);

rules.set(SEGMENTS_Z_INPUT!, [
  required("segments Z"),
  number("segments Z"),
  biggerThan("segments Z", 1),
]);

const validateInputs = () => {
  const inputsToValidate = [
    FUNCTION_INPUT!,
    MIN_X_INPUT!,
    MAX_X_INPUT!,
    MIN_Y_INPUT!,
    MAX_Y_INPUT!,
    MIN_Z_INPUT!,
    MAX_Z_INPUT!,
    SEGMENTS_X_INPUT!,
    SEGMENTS_Z_INPUT!,
  ];

  for (const input of inputsToValidate) {
    const value = parseFloat(input.value);
    for (const rule of rules.get(input)!) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
  }

  return null;
};

const validateAndNotify = () => {
  const error = validateInputs();
  if (error) {
    SNACKBAR!.textContent = error;
    SNACKBAR!.classList.add("show");
  } else {
    SNACKBAR!.classList.remove("show");
  }

  return !error;
};

const getParsedValues = (): FunctionValues => {
  return {
    fn: FUNCTION_INPUT!.value,
    minX: parseFloat(MIN_X_INPUT!.value),
    maxX: parseFloat(MAX_X_INPUT!.value),
    minY: parseFloat(MIN_Z_INPUT!.value),
    maxY: parseFloat(MAX_Z_INPUT!.value),
    minZ: parseFloat(MIN_Y_INPUT!.value),
    maxZ: parseFloat(MAX_Y_INPUT!.value),
    segmentsX: parseInt(SEGMENTS_X_INPUT!.value),
    segmentsZ: parseInt(SEGMENTS_Z_INPUT!.value),
    colorMax: MAX_Y_COLOR_INPUT!.value,
    colorZero: MID_Y_COLOR_INPUT!.value,
    colorMin: MIN_Y_COLOR_INPUT!.value,
  };
};

export type FunctionValues = {
  fn: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  segmentsX: number;
  segmentsZ: number;
  colorMax: string;
  colorZero: string;
  colorMin: string;
};

export const DEFAULT_VALUES = {
  fn: "sin(5x)*cos(5y)/5 * asin(cos(x*10*y)) * 3",
  minX: -2.5,
  maxX: 2.5,
  minY: -2.5,
  maxY: 2.5,
  minZ: -2.5,
  maxZ: 2.5,
  segmentsX: 150,
  segmentsZ: 150,
  colorMax: "#ff99cc",
  colorZero: "#ffff00",
  colorMin: "#9966cc",
};

let currentlyDisplayedFunction = DEFAULT_VALUES.fn;

export const init = (
  reactToChange: (args: FunctionValues) => void,
  functionAnimation: (args: FunctionValues) => void,
) => {
  const {
    fn,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    segmentsX,
    segmentsZ,
    colorMax,
    colorZero,
    colorMin,
  } = DEFAULT_VALUES;

  // Assign default values to the inputs
  FUNCTION_INPUT!.value = fn;
  MIN_X_INPUT!.value = minX.toString();
  MAX_X_INPUT!.value = maxX.toString();
  MIN_Y_INPUT!.value = minZ.toString();
  MAX_Y_INPUT!.value = maxZ.toString();
  MIN_Z_INPUT!.value = minY.toString();
  MAX_Z_INPUT!.value = maxY.toString();
  SEGMENTS_X_INPUT!.value = segmentsX.toString();
  SEGMENTS_Z_INPUT!.value = segmentsZ.toString();
  MAX_Y_COLOR_INPUT!.value = colorMax;
  MID_Y_COLOR_INPUT!.value = colorZero;
  MIN_Y_COLOR_INPUT!.value = colorMin;

  // Add event listener to the run button
  RUN_BUTTON!.addEventListener("click", () => {
    if (!validateAndNotify()) return;
    const values = getParsedValues();
    currentlyDisplayedFunction = values.fn;
    functionAnimation(getParsedValues());
  });

  // Add event listener to the inputs
  const inputs = [
    MIN_X_INPUT!,
    MAX_X_INPUT!,
    MIN_Y_INPUT!,
    MAX_Y_INPUT!,
    MIN_Z_INPUT!,
    MAX_Z_INPUT!,
    SEGMENTS_X_INPUT!,
    SEGMENTS_Z_INPUT!,
    MAX_Y_COLOR_INPUT!,
    MID_Y_COLOR_INPUT!,
    MIN_Y_COLOR_INPUT!,
  ];

  const debouncedHandler = debounce(() => {
    if (!validateAndNotify()) return;
    reactToChange({ ...getParsedValues(), fn: currentlyDisplayedFunction });
  }, 500);

  for (const input of inputs) {
    input.addEventListener("input", debouncedHandler);
  }
};

const setDisabled = (disabled: boolean) => {
  [
    FUNCTION_INPUT!,
    MIN_X_INPUT!,
    MAX_X_INPUT!,
    MIN_Y_INPUT!,
    MAX_Y_INPUT!,
    MIN_Z_INPUT!,
    MAX_Z_INPUT!,
    SEGMENTS_X_INPUT!,
    SEGMENTS_Z_INPUT!,
    MAX_Y_COLOR_INPUT!,
    MID_Y_COLOR_INPUT!,
    MIN_Y_COLOR_INPUT!,
    RUN_BUTTON!,
  ].forEach((input) => {
    input.disabled = disabled;
  });
};

export const enableForm = () => setDisabled(false);

export const disableForm = () => setDisabled(true);
