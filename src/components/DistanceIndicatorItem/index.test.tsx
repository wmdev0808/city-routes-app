import type { DistanceIndicatorItemProps } from ".";
import DistanceIndicatorItem from ".";
import { render, screen } from "../../utils/test-utils";

describe("DistanceIndicatorItem", () => {
  it("should render infos from an item", () => {
    const inputProps: DistanceIndicatorItemProps = {
      isFirst: true,
      isLast: true,
      item: {
        origin: { latitude: 48.856614, longitude: 2.352222, name: "Paris" },
        destination: {
          latitude: 45.439695,
          longitude: 4.387178,
          name: "Saint-Étienne",
        },
        distance: 410.35,
      },
    };

    render(<DistanceIndicatorItem {...inputProps} />);
    const icons = screen.getAllByRole("img", { hidden: true });

    expect(icons).toHaveLength(5);
    expect(icons[0]).toHaveAttribute("data-icon", "circle");
    expect(icons[1]).toHaveAttribute("data-icon", "dot");
    expect(icons[2]).toHaveAttribute("data-icon", "dot");
    expect(icons[3]).toHaveAttribute("data-icon", "dot");
    expect(icons[4]).toHaveAttribute("data-icon", "map-marker");

    expect(screen.getByText(/Paris/i)).toBeInTheDocument();
    expect(screen.getByText(/Saint-Étienne/i)).toBeInTheDocument();
    const distanceText = `${inputProps.item.distance} km`;
    expect(screen.getByText(distanceText)).toBeInTheDocument();
  });
});
