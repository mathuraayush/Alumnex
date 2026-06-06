// import axios from 'axios'

import axios from 'axios'

const PRIMARY_API = 'https://alumnex-api.proudpebble-2340b4fd.centralindia.azurecontainerapps.io/api'
const FALLBACK_API = 'https://alumnex.onrender.com/api'

const client = axios.create({
baseURL: PRIMARY_API,
timeout: 30000
})

// Request interceptor to add auth token
client.interceptors.request.use(
config => {
const token = localStorage.getItem('authToken')
if (token) {
config.headers.Authorization = `Bearer ${token}`
}
return config
},
error => Promise.reject(error)
)

client.interceptors.response.use(
response => {
console.log('API Response:', response.config.url, response.status)
return response
},
async error => {
const originalRequest = error.config

// Retry once on Render if Azure fails
if (
  !originalRequest._retry &&
  (!error.response || error.response.status >= 500)
) {
  originalRequest._retry = true

  console.warn('Azure API unavailable, retrying via Render...')

  const fallbackClient = axios.create({
    baseURL: FALLBACK_API,
    timeout: 30000
  })

  const token = localStorage.getItem('authToken')
  if (token) {
    originalRequest.headers.Authorization = `Bearer ${token}`
  }

  return fallbackClient(originalRequest)
}

console.error(
  'API Error:',
  error.config?.url,
  error.message,
  error.response?.status
)

if (error.response?.status === 401) {
  localStorage.removeItem('authToken')
  localStorage.removeItem('adminUser')

  if (window.location.pathname.includes('/admin')) {
    window.location.href = '/admin/login'
  }
}

return Promise.reject(error)

}
)

// const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
// const BASE = isDev ? 'https://alumnex-api.proudpebble-2340b4fd.centralindia.azurecontainerapps.io/api' : 'https://alumnex.onrender.com/api'

// const client = axios.create({ baseURL: BASE, timeout: 30000 })

// // Request interceptor to add auth token
// client.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('authToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   error => Promise.reject(error)
// )

// client.interceptors.response.use(
//   response => {
//     console.log('API Response:', response.config.url, response.status)
//     return response
//   },
//   error => {
//     console.error('API Error:', error.config?.url, error.message, error.response?.status)
//     // Handle 401 - redirect to login
//     if (error.response?.status === 401) {
//       localStorage.removeItem('authToken')
//       localStorage.removeItem('adminUser')
//       if (window.location.pathname.includes('/admin')) {
//         window.location.href = '/admin/login'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default {
  // Public endpoints
  getCompanies: () => client.get('/companies'),
  getCompanyBySlug: (slug) => client.get(`/companies/${slug}`),
  getThreads: (params) => {
    // Only send non-empty filter parameters
    const cleanParams = Object.entries(params)
      .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
    console.log('Fetching threads with params:', cleanParams)
    return client.get('/threads', { params: cleanParams })
  },
  getThread: (id) => client.get(`/threads/${id}`),
  getJobRoles: () => client.get('/jobroles'),
  
  // Stats endpoints
  getCompanyStats: () => client.get('/threads/stats/company'),
  getDifficultyStats: () => client.get('/threads/stats/difficulty'),
  getYearStats: () => client.get('/threads/stats/year'),
  
  // Admin endpoints
  loginAdmin: (email, password) => client.post('/admin/login', { email, password }),
  createThread: (data) => client.post('/admin/thread', data),
  bulkUploadThreads: (formData) => client.post('/admin/bulk-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
