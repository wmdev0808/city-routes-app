import { render, screen } from "../../utils/test-utils";

import Skeleton from ".";

describe("Skeleton", () => {
  it("should render 3 skeleton elements", () => {
    render(<Skeleton />);

    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });
});
