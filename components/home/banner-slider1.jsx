// app/components/BannerSlider.jsx
import BannerSliderClient from "./banner-slider-client"
import SideCategoryMenu from "@/components/side-category-menu"

export default function BannerSlider({ banners, design, settings }) {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="hidden lg:block h-[400px] md:h-[500px] overflow-hidden">
            <SideCategoryMenu className="h-full" />
          </div>
          <div className="lg:col-span-3 relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <BannerSliderClient banners={banners} design={design} settings={settings} />
          </div>
        </div>
      </div>
    </section>
  )
}
