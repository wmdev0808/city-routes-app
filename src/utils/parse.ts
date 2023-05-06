export function parseInteger(
  input: string | number,
  min?: number,
  max?: number,
): [number, string] {
  const strInput = input.toString();
  const match = strInput.match(/^(0|-?[1-9]\d*)/g);

  if (match) {
    if (min && Number(match[0]) < min) {
      return [min, min.toString()];
    }
    if (max && Number(match[0]) > max) {
      return [max, max.toString()];
    }

    return [Number(match[0]), match[0]];
  }

  return [0, ""];
}
