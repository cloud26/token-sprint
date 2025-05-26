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
                window.adsbygoogle.push({})
                window.adsbygoogle.push({})
            }
        } catch (err) {
            console.error('AdSense error:', err)
        }
    }, [])

    return (
        <>
            {/* 左侧广告 */}
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden xl:block">
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="6070874275"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>

            {/* 右侧广告 */}
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 hidden xl:block">
                <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '160px', height: '600px' }}
                    data-ad-client="ca-pub-8472112646404075"
                    data-ad-slot="6070874275"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </>
    )
} 