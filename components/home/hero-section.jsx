"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { useSiteSettings } from "@/components/site-settings-provider"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const [heroDesign, setHeroDesign] = useState("hero-1")

  useEffect(() => {
    if (settings && settings.heroDesign) {
      setHeroDesign(settings.heroDesign)
    }
  }, [settings])

  // Hero Design 1: Split with Image
  if (heroDesign === "hero-1") {
    return (
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="hero-1">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ color: settings?.primaryColor }}>
              {t("hero.title")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="btn-primary" style={{ backgroundColor: settings?.primaryColor }}>
                <Link href="/products">{t("hero.shopNow")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/categories">{t("hero.browseCategories")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=500&width=600" alt="Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    )
  }

  // Hero Design 2: Full Width with Background
  if (heroDesign === "hero-2") {
    return (
      <section className="w-full py-20 md:py-32 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 hero-2">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center" style={{ color: settings?.primaryColor }}>
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 text-center">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="btn-primary text-lg px-8 py-6"
              style={{ backgroundColor: settings?.primaryColor }}
            >
              <Link href="/products">{t("hero.shopNow")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/categories">{t("hero.browseCategories")}</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Hero Design 3: Gradient Background
  if (heroDesign === "hero-3") {
    return (
      <section className="hero-3 py-20 md:py-32 text-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">{t("hero.title")}</h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-lg px-8 py-6"
                style={{ color: settings?.primaryColor }}
              >
                <Link href="/products">{t("hero.shopNow")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Link href="/categories">{t("hero.browseCategories")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default fallback
  return (
    <section className="container mx-auto px-4 py-12 md:py-24">
      <div className="hero-1">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{t("hero.title")}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t("hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/products">{t("hero.shopNow")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/categories">{t("hero.browseCategories")}</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
          <img src="/placeholder.svg?height=500&width=600" alt="Hero" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  )
}
