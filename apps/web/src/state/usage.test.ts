import { describe, expect, it } from "vite-plus/test";

import { resolveUsageEnvironmentError } from "./usage";

const reachable = { queryFailed: false, hasSummary: false, phase: "connected" } as const;

describe("resolveUsageEnvironmentError", () => {
  // #6045: a sleeping device's usage query never fails, so without a terminal
  // verdict the page holds every other device's totals behind its skeleton.
  it("marks an offline environment terminal so it stops reading as still scanning", () => {
    expect(resolveUsageEnvironmentError({ ...reachable, phase: "offline" })).toBe(
      "This environment is not reachable and could not report usage.",
    );
  });

  it("marks a reconnecting environment terminal, because an attempt already failed", () => {
    expect(resolveUsageEnvironmentError({ ...reachable, phase: "reconnecting" })).not.toBeNull();
  });

  it("marks an errored environment terminal", () => {
    expect(resolveUsageEnvironmentError({ ...reachable, phase: "error" })).not.toBeNull();
  });

  // Guard: the states that must keep waiting. A first connection attempt has no
  // failure behind it, so turning these terminal would replace the ordinary
  // startup scan with an error on every cold load.
  for (const phase of ["connecting", "connected", "available"] as const) {
    it(`keeps a ${phase} environment pending`, () => {
      expect(resolveUsageEnvironmentError({ ...reachable, phase })).toBeNull();
    });
  }

  // Guard: totals that already arrived outlive the connection that produced
  // them, so a later drop must not convert the row into an error and remove
  // them from the merged view.
  it("keeps an environment that already answered, even once it goes offline", () => {
    expect(
      resolveUsageEnvironmentError({ queryFailed: false, hasSummary: true, phase: "offline" }),
    ).toBeNull();
  });

  it("still reports a failed query, whatever the connection phase says", () => {
    expect(
      resolveUsageEnvironmentError({ queryFailed: true, hasSummary: false, phase: "connected" }),
    ).toBe("This environment could not report usage.");
  });
});
