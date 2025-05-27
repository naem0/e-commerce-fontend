"use client"

import { useState, useEffect } from "react"
import { BannerSection } from "@/components/home/banner-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Categories } from "@/components/home/categories"
import { CategoryProducts } from "@/components/home/category-products"
import { CustomSection } from "@/components/home/custom-section"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"
import { getSiteSettings } from "@/services/settings.service"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const result = await getSiteSettings()
        if (result.success) {
          setSettings(result.settings)
        } else {
          throw new Error(result.message || "Failed to fetch settings")
        }
      } catch (err) {
        console.error("Error fetching settings:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[500px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Get enabled sections and sort by order
  const sections = []
  const homePageSections = settings?.homePageSections || {}

  // Add sections based on configuration
  if (homePageSections.banner?.enabled) {
    sections.push({
      component: <BannerSection key="banner" />,
      order: homePageSections.banner.order || 1,
    })
  }

  if (homePageSections.featuredProducts?.enabled) {
    sections.push({
      component: (
        <FeaturedProducts
          key="featured"
          categoryId={homePageSections.featuredProducts.categoryId}
          title={homePageSections.featuredProducts.title}
          limit={homePageSections.featuredProducts.limit}
          design={homePageSections.featuredProducts.design}
        />
      ),
      order: homePageSections.featuredProducts.order || 2,
    })
  }

  if (homePageSections.categories?.enabled) {
    sections.push({
      component: (
        <Categories
          key="categories"
          title={homePageSections.categories.title}
          limit={homePageSections.categories.limit}
          design={homePageSections.categories.design}
        />
      ),
      order: homePageSections.categories.order || 3,
    })
  }

  // Add category products sections
  if (homePageSections.categoryProducts && Array.isArray(homePageSections.categoryProducts)) {
    homePageSections.categoryProducts.forEach((categorySection, index) => {
      if (categorySection.enabled && categorySection.categoryId) {
        sections.push({
          component: (
            <CategoryProducts
              key={`category-${index}`}
              categoryId={categorySection.categoryId}
              title={categorySection.title}
              limit={categorySection.limit}
              design={categorySection.design}
            />
          ),
          order: categorySection.order || 4 + index,
        })
      }
    })
  }

  // Add custom sections
  if (homePageSections.customSections && Array.isArray(homePageSections.customSections)) {
    homePageSections.customSections.forEach((customSection, index) => {
      if (customSection.enabled) {
        sections.push({
          component: <CustomSection key={`custom-${customSection.id || index}`} section={customSection} />,
          order: customSection.order || 10 + index,
        })
      }
    })
  }

  // if (homePageSections.testimonials?.enabled) {
  //   sections.push({
  //     component: (
  //       <Testimonials
  //         key="testimonials"
  //         title={homePageSections.testimonials.title}
  //         limit={homePageSections.testimonials.limit}
  //         design={homePageSections.testimonials.design}
  //       />
  //     ),
  //     order: homePageSections.testimonials.order || 5,
  //   })
  // }

  if (homePageSections.newsletter?.enabled) {
    sections.push({
      component: (
        <Newsletter
          key="newsletter"
          title={homePageSections.newsletter.title}
          design={homePageSections.newsletter.design}
        />
      ),
      order: homePageSections.newsletter.order || 6,
    })
  }

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order)

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index}>{section.component}</div>
      ))}
    </div>
  )
}
