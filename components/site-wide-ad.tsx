"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const AD_VERSION = "minimax-token-plan-2025";
const AD_LINK =
  "https://platform.minimaxi.com/subscribe/token-plan?code=LONFQ0dT3m&source=link";

export function SiteWideAd() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("dismissedSiteWideAd");
    if (dismissed !== AD_VERSION) {
      setIsVisible(true);
    }
  }, []);

  const handleClick = () => {
    window.gtag?.("event", "ad_click", {
      event_category: "site_wide_ad",
      event_label: "minimax_token_plan",
      transport_type: "beacon",
    });
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("dismissedSiteWideAd", AD_VERSION);
  };

  if (locale !== "zh" || !isVisible) {
    return null;
  }

  return (
    <a
      href={AD_LINK}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className="block rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: "linear-gradient(135deg, #E8453C 0%, #FF6B5B 100%)" }}
    >
      <div className="relative px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <span className="text-lg">🚀</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-white text-sm truncate">
                MiniMax Token Plan 惊喜上线！
              </h3>
            </div>
            <p className="text-white/90 text-xs leading-relaxed line-clamp-2 sm:line-clamp-1">
              新增语音、音乐、视频和图片生成权益。好友立享 9折 专属优惠，你赢返利 + 社区特权！
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-[#E8453C] whitespace-nowrap hover:bg-white/90 transition-colors">
              立即参与
              <ExternalLink className="h-3 w-3" />
            </span>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </div>
        </div>
      </div>
    </a>
  );
}
