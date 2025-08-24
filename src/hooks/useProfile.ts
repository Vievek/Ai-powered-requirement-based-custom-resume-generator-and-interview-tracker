import { useState, useEffect } from "react";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    fetch(`/api/profile/get?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [userId]);

  return { profile, setProfile, isLoading };
}
