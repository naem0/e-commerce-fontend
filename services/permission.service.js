import api from "./api"

export const getPermissions = async (params = {}) => {
  try {
    const response = await api.get("/permissions", { params })
    return response.data
  } catch (error) {
    console.error("Get permissions error:", error)
    throw error
  }
}

export const getPermission = async (id) => {
  try {
    const response = await api.get(`/permissions/${id}`)
    return response.data
  } catch (error) {
    console.error("Get permission error:", error)
    throw error
  }
}

export const createPermission = async (permissionData) => {
  try {
    const response = await api.post("/permissions", permissionData)
    return response.data
  } catch (error) {
    console.error("Create permission error:", error)
    throw error
  }
}

export const updatePermission = async (id, permissionData) => {
  try {
    const response = await api.put(`/permissions/${id}`, permissionData)
    return response.data
  } catch (error) {
    console.error("Update permission error:", error)
    throw error
  }
}

export const deletePermission = async (id) => {
  try {
    const response = await api.delete(`/permissions/${id}`)
    return response.data
  } catch (error) {
    console.error("Delete permission error:", error)
    throw error
  }
}

export const seedPermissions = async () => {
  try {
    const response = await api.post("/permissions/seed")
    return response.data
  } catch (error) {
    console.error("Seed permissions error:", error)
    throw error
  }
}
