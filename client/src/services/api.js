import axios from 'axios';

const API_BASE_URL = '/api';

// Projects API
export const projectsAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/projects`),
  getOne: (id) => axios.get(`${API_BASE_URL}/projects/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/projects`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/projects/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/projects/${id}`),
  getStats: (id) => axios.get(`${API_BASE_URL}/projects/${id}/stats`)
};

// Tasks API
export const tasksAPI = {
  getAll: (projectId) => axios.get(`${API_BASE_URL}/tasks`, { params: { project_id: projectId } }),
  getOne: (id) => axios.get(`${API_BASE_URL}/tasks/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/tasks`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/tasks/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/tasks/${id}`)
};

// Resources API
export const resourcesAPI = {
  getAll: (filters) => axios.get(`${API_BASE_URL}/resources`, { params: filters }),
  getOne: (id) => axios.get(`${API_BASE_URL}/resources/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/resources`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/resources/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/resources/${id}`)
};

// Employees API
export const employeesAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/employees`),
  getOne: (id) => axios.get(`${API_BASE_URL}/employees/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/employees`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/employees/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/employees/${id}`),
  getTasks: (id) => axios.get(`${API_BASE_URL}/employees/${id}/tasks`)
};

// Users API
export const usersAPI = {
  getProfile: () => axios.get(`${API_BASE_URL}/users/profile`),
  updateProfile: (data) => axios.put(`${API_BASE_URL}/users/profile`, data),
  changePassword: (data) => axios.put(`${API_BASE_URL}/users/change-password`, data),
  getAll: () => axios.get(`${API_BASE_URL}/users`)
};
