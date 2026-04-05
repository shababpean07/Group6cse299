const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => api<T>(endpoint),
  post: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: any) => api<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' }),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ user: any; token: string }>('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string; studentId?: string }) =>
    apiClient.post<{ user: any; token: string }>('/auth/register', data),
};

export const clubsApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/clubs${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get<any>(`/clubs/${id}`),
  create: (data: any) => apiClient.post<any>('/clubs', data),
  update: (id: string, data: any) => apiClient.put<any>(`/clubs/${id}`, data),
  delete: (id: string) => apiClient.delete<any>(`/clubs/${id}`),
  join: (id: string) => apiClient.post<any>(`/clubs/${id}/join`),
  getMembers: (id: string) => apiClient.get<any[]>(`/clubs/${id}/members`),
};

export const eventsApi = {
  getAll: (params?: { category?: string; month?: string; year?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/events${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get<any>(`/events/${id}`),
  create: (data: any) => apiClient.post<any>('/events', data),
  update: (id: string, data: any) => apiClient.put<any>(`/events/${id}`, data),
  updateStatus: (id: string, status: string) => apiClient.patch<any>(`/events/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete<any>(`/events/${id}`),
  rsvp: (id: string) => apiClient.post<any>(`/events/${id}/rsvp`),
  cancelRsvp: (id: string) => apiClient.delete<any>(`/events/${id}/rsvp`),
};

export const recruitmentApi = {
  getCycles: (params?: { clubId?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/recruitment/cycles${query ? `?${query}` : ''}`);
  },
  getCycleById: (id: string) => apiClient.get<any>(`/recruitment/cycles/${id}`),
  createCycle: (data: any) => apiClient.post<any>('/recruitment/cycles', data),
  updateCycleStatus: (id: string, status: string) => 
    apiClient.patch<any>(`/recruitment/cycles/${id}/status`, { status }),
  apply: (cycleId: string, data: any) => 
    apiClient.post<any>(`/recruitment/apply/${cycleId}`, data),
  updateApplicationStatus: (id: string, status: string) =>
    apiClient.patch<any>(`/recruitment/applications/${id}/status`, { status }),
  getMyApplications: () => apiClient.get<any[]>('/recruitment/my-applications'),
};

export const announcementsApi = {
  getAll: (params?: { clubId?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/announcements${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get<any>(`/announcements/${id}`),
  create: (data: any) => apiClient.post<any>('/announcements', data),
  update: (id: string, data: any) => apiClient.put<any>(`/announcements/${id}`, data),
  delete: (id: string) => apiClient.delete<any>(`/announcements/${id}`),
};

export const usersApi = {
  getAll: (params?: { role?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/users${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient.get<any>(`/users/${id}`),
  update: (id: string, data: any) => apiClient.patch<any>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete<any>(`/users/${id}`),
  getMyClubs: () => apiClient.get<any[]>('/users/me/clubs'),
};

export const dashboardApi = {
  getSuperAdminStats: () => apiClient.get<any>('/dashboard/super-admin'),
  getClubAdminStats: () => apiClient.get<any>('/dashboard/club-admin'),
};
