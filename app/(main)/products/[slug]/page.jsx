import ProductPageClient from "./ProductPageClient";
import { getProductBySlug } from "@/services/product.service";

// SEO metadata
export async function generateMetadata({ params }) {
  try {
    const response = await getProductBySlug(params.slug);
    const product = response.product;

    return {
      title: product.seo?.title || `${product.name} | E-Commerce Store`,
      description: product.seo?.description || product.shortDescription || product.description.substring(0, 160),
      keywords: product.seo?.keywords || product.tags,
      openGraph: {
        title: product.seo?.title || product.name,
        description: product.seo?.description || product.shortDescription,
        images:
          product.images?.length > 0
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`,
                  width: 800,
                  height: 600,
                  alt: product.name,
                },
              ]
            : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.seo?.title || product.name,
        description: product.seo?.description || product.shortDescription,
        images: product.images?.length > 0 ? [`${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found | E-Commerce Store",
      description: "The product you are looking for could not be found.",
    };
  }
}

export default async function ProductPage({ params }) {
  try {
    const response = await getProductBySlug(params.slug);
    const product = response.product;

    return <ProductPageClient product={product} />;
  } catch (error) {
    return <div className="p-4 text-red-500">Product not found or failed to load.</div>;
  }
}
