import { parseInteger } from "./parse";

describe("prseInteger", () => {
  it("should return integer from string/number input", () => {
    const testValues: [
      { input: string | number; min?: number; max?: number },
      [number, string],
    ][] = [
      [
        {
          input: "1",
        },
        [1, "1"],
      ],
      [
        {
          input: 1,
        },
        [1, "1"],
      ],
      [
        {
          input: "-1",
        },
        [-1, "-1"],
      ],
      [
        {
          input: -1,
        },
        [-1, "-1"],
      ],
      [
        {
          input: 1.1,
        },
        [1, "1"],
      ],
      [
        {
          input: 1,
          min: 0,
          max: 5,
        },
        [1, "1"],
      ],
      [
        {
          input: -1,
          min: 0,
          max: 5,
        },
        [0, "0"],
      ],
      [
        {
          input: 6,
          min: 0,
          max: 5,
        },
        [5, "5"],
      ],
      [
        {
          input: -1,
          min: 0.5,
          max: 5,
        },
        [0, "0"],
      ],
      [
        {
          input: 6,
          min: 0,
          max: 5.4,
        },
        [5, "5"],
      ],
      [
        {
          input: "not matching input string",
          min: 0,
          max: 5,
        },
        [0, ""],
      ],
    ];

    testValues.forEach(([inputed, expected]) => {
      expect(parseInteger(inputed.input, inputed.min, inputed.max)).toEqual(
        expected,
      );
    });
  });
});
