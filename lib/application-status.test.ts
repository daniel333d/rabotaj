import { describe, expect, it } from "vitest";
import { getApplicationStatusStepIndex, getApplicationStatusLabel, isApplicationTerminal } from "@/lib/application-status";
import pl from "@/lib/i18n/locales/pl";

describe("getApplicationStatusStepIndex", () => {
  it("maps the five progressing statuses to steps 0-4 in order", () => {
    expect(getApplicationStatusStepIndex("submitted")).toBe(0);
    expect(getApplicationStatusStepIndex("viewed")).toBe(1);
    expect(getApplicationStatusStepIndex("shortlisted")).toBe(2);
    expect(getApplicationStatusStepIndex("interview")).toBe(3);
    expect(getApplicationStatusStepIndex("offer")).toBe(4);
  });

  it("maps terminal statuses to -1", () => {
    expect(getApplicationStatusStepIndex("hired")).toBe(-1);
    expect(getApplicationStatusStepIndex("rejected")).toBe(-1);
    expect(getApplicationStatusStepIndex("withdrawn")).toBe(-1);
  });
});

describe("isApplicationTerminal", () => {
  it("treats hired, rejected and withdrawn as terminal", () => {
    expect(isApplicationTerminal("hired")).toBe(true);
    expect(isApplicationTerminal("rejected")).toBe(true);
    expect(isApplicationTerminal("withdrawn")).toBe(true);
  });

  it("treats the progressing statuses as non-terminal", () => {
    expect(isApplicationTerminal("submitted")).toBe(false);
    expect(isApplicationTerminal("interview")).toBe(false);
  });
});

describe("getApplicationStatusLabel", () => {
  it("returns the matching step label for progressing statuses", () => {
    expect(getApplicationStatusLabel("submitted", pl)).toBe(pl.applicationStatus.steps[0]);
    expect(getApplicationStatusLabel("offer", pl)).toBe(pl.applicationStatus.steps[4]);
  });

  it("returns the dedicated label for each terminal status", () => {
    expect(getApplicationStatusLabel("hired", pl)).toBe(pl.applicationStatus.hired);
    expect(getApplicationStatusLabel("rejected", pl)).toBe(pl.applicationStatus.rejected);
    expect(getApplicationStatusLabel("withdrawn", pl)).toBe(pl.applicationStatus.withdrawnStatus);
  });
});
