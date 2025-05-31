"use client"

import { useEffect } from "react"
import { FormBuilderApp } from "@/components/form-builder-app"
import { useThemeStore } from "@/lib/theme-store"

export default function HomePage() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <div className={`min-h-screen transition-colors ${theme === "dark" ? "dark" : ""}`}>
      <FormBuilderApp />
    </div>
  )
}
