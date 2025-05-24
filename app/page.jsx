import { BannerSection } from "@/components/home/banner-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { Categories } from "@/components/home/categories"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"

export default function Home() {
  return (
    <div>
      <BannerSection />
      <FeaturedProducts />
      <Categories />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
