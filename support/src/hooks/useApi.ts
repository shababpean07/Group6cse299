import { useState, useEffect, useCallback } from "react";
import { clubsApi, eventsApi, recruitmentApi, dashboardApi, announcementsApi, usersApi } from "@/lib/api";

export function useClubs(params?: { category?: string; search?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clubs = await clubsApi.getAll(params);
      setData(clubs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clubs");
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.search]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return { data, isLoading, error, refetch: fetchClubs };
}

export function useClub(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchClub = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const club = await clubsApi.getById(id);
        setData(club);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch club");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  return { data, isLoading, error };
}

export function useEvents(params?: { category?: string; month?: string; year?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const events = await eventsApi.getAll(params);
      setData(events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.month, params?.year]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { data, isLoading, error, refetch: fetchEvents };
}

export function useEvent(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const event = await eventsApi.getById(id);
        setData(event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { data, isLoading, error };
}

export function useRecruitmentCycles(params?: { clubId?: string; status?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCycles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cycles = await recruitmentApi.getCycles(params);
      setData(cycles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch recruitment cycles");
    } finally {
      setIsLoading(false);
    }
  }, [params?.clubId, params?.status]);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  return { data, isLoading, error, refetch: fetchCycles };
}

export function useMyApplications() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const applications = await recruitmentApi.getMyApplications();
        setData(applications);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return { data, isLoading, error };
}

export function useSuperAdminDashboard() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dashboard = await dashboardApi.getSuperAdminStats();
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, isLoading, error };
}

export function useClubAdminDashboard() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dashboard = await dashboardApi.getClubAdminStats();
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, isLoading, error };
}

export function useAnnouncements(params?: { clubId?: string; status?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const announcements = await announcementsApi.getAll(params);
      setData(announcements);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch announcements");
    } finally {
      setIsLoading(false);
    }
  }, [params?.clubId, params?.status]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { data, isLoading, error, refetch: fetchAnnouncements };
}

export function useUsers(params?: { role?: string; search?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const users = await usersApi.getAll(params);
      setData(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [params?.role, params?.search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, isLoading, error, refetch: fetchUsers };
}
