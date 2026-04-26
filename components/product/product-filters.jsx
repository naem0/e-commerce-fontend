"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function ProductFilters({ categories, brands, onFilterChange, initialFilters }) {
    const [filters, setFilters] = useState({
        search: initialFilters?.search || "",
        category: initialFilters?.category || "",
        brand: initialFilters?.brand || "",
        sort: initialFilters?.sort || "newest",
    })

    // Sync internal state with initialFilters prop
    useEffect(() => {
        if (initialFilters) {
            setFilters({
                search: initialFilters.search || "",
                category: initialFilters.category || "",
                brand: initialFilters.brand || "",
                sort: initialFilters.sort || "newest",
            })
        }
    }, [initialFilters])

    const [debouncedSearch, setDebouncedSearch] = useState("")

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search)
        }, 500) // 500ms delay

        return () => clearTimeout(timer)
    }, [filters.search])

    // Notify parent when filters change
    useEffect(() => {
        onFilterChange({
            ...filters,
            search: debouncedSearch,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filters.category, filters.brand, filters.sort])

    const handleFilterChange = (name, value) => {
        // Convert "all" to empty string for category and brand filters
        const actualValue = (name === "category" || name === "brand") && value === "all" ? "" : value

        setFilters((prev) => ({
            ...prev,
            [name]: actualValue,
        }))
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative col-span-2 md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>
                    <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange("category", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.brand || "all"} onValueChange={(value) => handleFilterChange("brand", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Brands</SelectItem>
                            {brands.map((brand) => (
                                <SelectItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="name_asc">Name: A-Z</SelectItem>
                            <SelectItem value="name_desc">Name: Z-A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
    )
}
