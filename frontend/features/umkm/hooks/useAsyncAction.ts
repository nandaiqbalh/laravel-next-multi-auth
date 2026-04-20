"use client";

import { useState } from "react";

/**
 * useAsyncAction centralizes loading and message state for async submit handlers.
 * @returns Hook state and helper runner.
 *
 * Usage:
 * const { run, loading, error } = useAsyncAction();
 */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Execute async callback while managing state transitions.
   * @param callback Async callback to execute.
   * @returns Promise<void>
   *
   * Usage:
   * await run(async () => save(payload));
   */
  async function run(callback: () => Promise<void>) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await callback();
      setSuccess("Berhasil diproses");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    setError,
    setSuccess,
    run,
  };
}
