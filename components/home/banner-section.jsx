// app/components/BannerSection.jsx
import { getBanners } from "@/services/banner.service"
import BannerSlider1 from "@/components/home/banner-slider1"
import BannerSlider2 from "@/components/home/banner-slider2"
import BannerSlider3 from "@/components/home/banner-slider3"
import BannerSlider4 from "@/components/home/banner-slider4"

export default async function BannerSection({ bannerDesign = "banner-11", settings, t }) {
  let banners = []

  try {
    const result = await getBanners({ enabled: true })
    if (result.success && result.banners.length > 0) {
      banners = result.banners
    }
  } catch (err) {
    console.error("Banner fetch failed:", err)
  }

  if (banners.length === 0) {
    banners = [
      {
        _id: "default-1",
        title: t?.("banner.title1") || "Summer Sale 2024",
        subtitle: t?.("banner.subtitle1") || "Up to 50% off",
        description: t?.("banner.description1") || "Don't miss out",
        image: "/placeholder.svg?height=600&width=1200",
        buttonText: t?.("banner.shopNow") || "Shop Now",
        buttonLink: "/products",
        backgroundColor: "",
        textColor: "",
      },
    ]
  }

  // Optionally filter `banners` or manipulate based on `settings`
  const selectedDesign = bannerDesign || settings?.bannerDesign || "banner-1"

  if (selectedDesign === "banner-1") {
    return <BannerSlider1 banners={banners} design={selectedDesign} settings={settings} />
  }
  if (selectedDesign === "banner-2") {
    return <BannerSlider2 banners={banners} design={selectedDesign} settings={settings} />
  }
  if (selectedDesign === "banner-3") {
    return <BannerSlider3 banners={banners} design={selectedDesign} settings={settings} />
  }
  if (selectedDesign === "banner-4") {
    return <BannerSlider4 banners={banners} design={selectedDesign} settings={settings} />
  }

  // Default case if no specific design matches
  console.warn(`Unknown banner design: ${selectedDesign}, falling back to banner-1`)
  return (
    <div>
      {/* Pass data to client if interactivity is needed */}
      <BannerSlider1 banners={banners} design={selectedDesign} settings={settings} />
    </div>
  )
}
