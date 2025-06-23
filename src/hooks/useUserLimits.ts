import { useEffect, useState } from "react";

interface UserLimits {
  remainingMessages: number | null;
  resetTimestamp: number | null;
  loading: boolean;
  refetch: () => void;
}

export function useUserLimits(): UserLimits {
  const [remainingMessages, setRemainingMessages] = useState<number | null>(
    null
  );
  const [resetTimestamp, setResetTimestamp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch limits
  const fetchLimits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/limits`);
      const data = await res.json();
      setRemainingMessages(data.remaining);
      setResetTimestamp(data.reset ?? null);
    } catch {
      setRemainingMessages(null);
      setResetTimestamp(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on fingerprint change
  useEffect(() => {
    fetchLimits();
  }, []);

  // Refetch function
  const refetch = () => {
    fetchLimits();
  };

  return {
    remainingMessages,
    resetTimestamp,
    loading,
    refetch,
  };
}
