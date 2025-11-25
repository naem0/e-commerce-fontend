"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function ProductFilters({ categories, brands, onFilterChange }) {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        brand: "",
        sort: "newest",
    })

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
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-8"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
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

                    <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
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
        </div>
    )
}
