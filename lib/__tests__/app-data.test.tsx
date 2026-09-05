import { act, renderHook } from "@testing-library/react-native";

import { AppDataProvider, useAppData } from "@/lib/app-data";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppDataProvider>{children}</AppDataProvider>
);

describe("useAppData / submitCheckin", () => {
  it("starts with today's check-in not yet done", async () => {
    const { result } = await renderHook(() => useAppData(), { wrapper });
    expect(result.current.state.checkedInToday).toBe(false);
  });

  it("records the new check-in at the front of the list and marks today done", async () => {
    const { result } = await renderHook(() => useAppData(), { wrapper });
    const checkinsBefore = result.current.state.checkins.length;

    await act(() => {
      result.current.submitCheckin({
        wentWell: "Read an extra story without rushing.",
        notWell: "Lost my patience at bedtime.",
        tags: ["No sleep", "Good day"],
        actionItemText: "",
      });
    });

    expect(result.current.state.checkedInToday).toBe(true);
    expect(result.current.state.checkins).toHaveLength(checkinsBefore + 1);
    expect(result.current.state.checkins[0]).toMatchObject({
      wentWell: "Read an extra story without rushing.",
      notWell: "Lost my patience at bedtime.",
      tags: ["No sleep", "Good day"],
    });
  });

  it("only creates a follow-up action item when the text is non-empty", async () => {
    const { result } = await renderHook(() => useAppData(), { wrapper });
    const actionItemsBefore = result.current.state.actionItemsOpen.length;

    await act(() => {
      result.current.submitCheckin({
        wentWell: "",
        notWell: "",
        tags: [],
        actionItemText: "   ",
      });
    });
    expect(result.current.state.actionItemsOpen).toHaveLength(actionItemsBefore);

    await act(() => {
      result.current.submitCheckin({
        wentWell: "",
        notWell: "",
        tags: [],
        actionItemText: "Leave 10 minutes earlier.",
      });
    });
    expect(result.current.state.actionItemsOpen).toHaveLength(actionItemsBefore + 1);
    expect(result.current.state.actionItemsOpen[0]).toMatchObject({
      text: "Leave 10 minutes earlier.",
      source: "today's check-in",
    });
  });
});
