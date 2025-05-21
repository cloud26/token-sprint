import { Coffee } from "lucide-react"
import { Button } from "./ui/button"

export function Footer() {
    return (
        <footer className="py-6 text-center">
            <a
                href="https://www.buymeacoffee.com/pengpeng"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-90 transition-opacity"
            >
                <img
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                    alt="Buy Me A Coffee"
                    className="h-[60px] w-[217px]"
                />
            </a>
        </footer>
    )
} 