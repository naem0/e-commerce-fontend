import api from "./api"

export const getRoles = async (params = {}) => {
  try {
    const response = await api.get("/roles", { params })
    return response.data
  } catch (error) {
    console.error("Get roles error:", error)
    throw error
  }
}

export const getRole = async (id) => {
  try {
    const response = await api.get(`/roles/${id}`)
    return response.data
  } catch (error) {
    console.error("Get role error:", error)
    throw error
  }
}

export const createRole = async (roleData) => {
  try {
    const response = await api.post("/roles", roleData)
    return response.data
  } catch (error) {
    console.error("Create role error:", error)
    throw error
  }
}

export const updateRole = async (id, roleData) => {
  try {
    const response = await api.put(`/roles/${id}`, roleData)
    return response.data
  } catch (error) {
    console.error("Update role error:", error)
    throw error
  }
}

export const deleteRole = async (id) => {
  try {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  } catch (error) {
    console.error("Delete role error:", error)
    throw error
  }
}

export const getRoleUsers = async (id, params = {}) => {
  try {
    const response = await api.get(`/roles/${id}/users`, { params })
    return response.data
  } catch (error) {
    console.error("Get role users error:", error)
    throw error
  }
}

export const seedRoles = async () => {
  try {
    const response = await api.post("/roles/seed")
    return response.data
  } catch (error) {
    console.error("Seed roles error:", error)
    throw error
  }
}
