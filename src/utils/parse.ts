export function parseInteger(
  input: string | number,
  min?: number,
  max?: number,
): [number, string] {
  const strInput = input.toString();
  const match = strInput.match(/^(0|-?[1-9]\d*)/g);

  if (match) {
    if ((min || min === 0) && Number(match[0]) < min) {
      return [parseInt(min.toString()), parseInt(min.toString()).toString()];
    }
    if ((max || max === 0) && Number(match[0]) > max) {
      return [parseInt(max.toString()), parseInt(max.toString()).toString()];
    }

    return [Number(match[0]), match[0]];
  }

  return [0, ""];
}
