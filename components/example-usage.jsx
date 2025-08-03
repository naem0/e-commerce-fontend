"use client"

import { useLanguage } from "./language-provider"

export default function ExampleComponent() {
  const { t } = useLanguage()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t("welcome")}</h1>
      <p>{t("description")}</p>
      <button className="mt-4 px-4 py-2 bg-primary-custom text-white rounded-md">{t("addToCart")}</button>
    </div>
  )
}
