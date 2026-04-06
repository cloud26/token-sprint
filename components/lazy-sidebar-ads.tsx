"use client"

import dynamic from 'next/dynamic'

const SidebarAds = dynamic(
    () => import('@/components/sidebar-ads').then(mod => ({ default: mod.SidebarAds })),
    { ssr: false }
)

export function LazySidebarAds() {
    return <SidebarAds />
}
