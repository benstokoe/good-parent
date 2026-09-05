import { fireEvent, render, screen } from "@testing-library/react-native";

import { Tag } from "@/components/ui/Tag";

describe("Tag", () => {
  it("renders its label", async () => {
    await render(<Tag>No sleep</Tag>);
    expect(screen.getByText("No sleep")).toBeTruthy();
  });

  it("calls onPress when tapped", async () => {
    const onPress = jest.fn();
    await render(<Tag onPress={onPress}>Good day</Tag>);

    fireEvent.press(screen.getByText("Good day"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is still tappable without an onPress handler", async () => {
    await render(<Tag>Sick kid</Tag>);
    expect(() => fireEvent.press(screen.getByText("Sick kid"))).not.toThrow();
  });
});
