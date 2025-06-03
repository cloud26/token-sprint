"use client"

import { useEffect } from "react"

declare global {
    interface Window {
        adsbygoogle: any
    }
}

export function SidebarAds() {
    useEffect(() => {
        try {
            // 为每个广告位推送一次
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                window.adsbygoogle.push({})  // 左侧广告
                window.adsbygoogle.push({})  // 右侧广告
            }
        } catch (err) {
            console.error('AdSense error:', err)
        }
    }, [])

    return (
        <>
            {/* 左广告 - 主内容左侧 200px */}
            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden 2xl:block"
                style={{ left: 'calc(50% - 336px - 200px)', width: '160px' }}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="6070874275"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

            {/* 右广告 - 主内容右侧 200px */}
            <div className="fixed top-1/2 transform -translate-y-1/2 z-10 hidden 2xl:block"
                style={{ left: 'calc(50% + 336px + 200px)', width: '160px' }}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="9024626084"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

        </>
    )
} 