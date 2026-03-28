import { auth } from '@/lib/firebase'

const API_BASE_URL = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080') + '/api/v1'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Not authenticated')
  }
  
  const token = await user.getIdToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `HTTP ${response.status}`)
  }
  
  return data.data as T
}

export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
  apps: Record<string, {
    role: string
    addedAt: string
  }>
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export interface App {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  type: string  // e.g., 'go', 'python', 'java', 'dotnet', 'dart'
  status: string // e.g., 'running', 'stopped', 'error'
  version: string
  endpoint: string
  createdAt: string
  updatedAt: string
  config?: Record<string, any>
}

export const usersApi = {
  async list(): Promise<User[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/users`, { headers })
    return handleResponse(response)
  },

  async get(id: string): Promise<User> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, { headers })
    return handleResponse(response)
  },

  async create(data: { email: string; password: string; role?: string }): Promise<{ id: string; email: string; role: string }> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async updateRole(userId: string, role: string): Promise<{ userId: string; role: string }> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ role }),
    })
    return handleResponse(response)
  },

  async delete(userId: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers,
    })
    if (!response.ok) {
      throw new Error('Failed to delete user')
    }
  },
}

export const rolesApi = {
  async list(): Promise<Role[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/roles`, { headers })
    return handleResponse(response)
  },

  async get(id: string): Promise<Role> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/roles/${id}`, { headers })
    return handleResponse(response)
  },

  async create(role: Omit<Role, 'id'> & { id: string }): Promise<Role> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/roles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(role),
    })
    return handleResponse(response)
  },

  async update(id: string, role: Partial<Role>): Promise<Role> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/roles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(role),
    })
    return handleResponse(response)
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/roles/${id}`, {
      method: 'DELETE',
      headers,
    })
    if (!response.ok) {
      throw new Error('Failed to delete role')
    }
  },
}

export const appsApi = {
  async list(): Promise<App[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/apps`, { headers })
    return handleResponse(response)
  },

  async get(id: string): Promise<App> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/apps/${id}`, { headers })
    return handleResponse(response)
  },

  async create(app: Omit<App, 'createdAt'>): Promise<App> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/apps`, {
      method: 'POST',
      headers,
      body: JSON.stringify(app),
    })
    return handleResponse(response)
  },

  async update(id: string, app: Partial<App>): Promise<App> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/apps/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(app),
    })
    return handleResponse(response)
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/apps/${id}`, {
      method: 'DELETE',
      headers,
    })
    if (!response.ok) {
      throw new Error('Failed to delete app')
    }
  },
}

export const servicesApi = {
  async list(): Promise<Service[]> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services`, { headers })
    return handleResponse(response)
  },

  async get(id: string): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, { headers })
    return handleResponse(response)
  },

  async create(service: Omit<Service, 'createdAt' | 'updatedAt'>): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(service),
    })
    return handleResponse(response)
  },

  async update(id: string, service: Partial<Service>): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(service),
    })
    return handleResponse(response)
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'DELETE',
      headers,
    })
    if (!response.ok) {
      throw new Error('Failed to delete service')
    }
  },

  async start(id: string): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/start`, {
      method: 'POST',
      headers,
    })
    return handleResponse(response)
  },

  async stop(id: string): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/stop`, {
      method: 'POST',
      headers,
    })
    return handleResponse(response)
  },

  async restart(id: string): Promise<Service> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/restart`, {
      method: 'POST',
      headers,
    })
    return handleResponse(response)
  },

  async getStatus(id: string): Promise<{ status: string }> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/status`, { headers })
    return handleResponse(response)
  },

  async getConfig(id: string): Promise<Record<string, any>> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/config`, { headers })
    return handleResponse(response)
  },

  async updateConfig(id: string, config: Record<string, any>): Promise<void> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}/config`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(config),
    })
    if (!response.ok) {
      throw new Error('Failed to update service configuration')
    }
  }
}
