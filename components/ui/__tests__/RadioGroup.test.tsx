import { fireEvent, render, screen } from "@testing-library/react-native";

import { RadioGroup } from "@/components/ui/RadioGroup";

const OPTIONS = [
  { value: "Better", label: "Better" },
  { value: "About the same", label: "About the same" },
  { value: "Still hard", label: "Still hard" },
];

describe("RadioGroup", () => {
  it("renders every option's label", async () => {
    await render(<RadioGroup options={OPTIONS} value={null} onChange={jest.fn()} />);

    for (const option of OPTIONS) {
      expect(screen.getByText(option.label)).toBeTruthy();
    }
  });

  it("calls onChange with the tapped option's value", async () => {
    const onChange = jest.fn();
    await render(<RadioGroup options={OPTIONS} value={null} onChange={onChange} />);

    fireEvent.press(screen.getByText("Still hard"));

    expect(onChange).toHaveBeenCalledWith("Still hard");
  });
});
