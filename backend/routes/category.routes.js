const express = require("express")
const router = express.Router()
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getCategoryTree,
} = require("../controllers/category.controller")
const { protect, admin } = require("../middleware/auth.middleware")
const upload = require("../middleware/upload.middleware")

// Public routes
router.get("/", getCategories)
router.get("/tree", getCategoryTree)
router.get("/:id", getCategory)
router.get("/slug/:slug", getCategoryBySlug)

// Protected routes
router.post("/", protect, admin, upload.single("image"), createCategory)
router.put("/:id", protect, admin, upload.single("image"), updateCategory)
router.delete("/:id", protect, admin, deleteCategory)

module.exports = router
