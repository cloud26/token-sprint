import { Mail, Heart } from "lucide-react"
import { useTranslations } from 'next-intl'

export function Footer() {
    const t = useTranslations('common')

    return (
        <footer className="mt-12 py-6 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto px-4">
                {/* Coffee Support */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
                    <div className="flex items-center gap-3">
                        <Heart className="w-4 h-4 text-red-500" />
                        <a
                            href="https://www.buymeacoffee.com/pengpeng"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block hover:opacity-90 transition-opacity hover:scale-105 transform duration-200"
                        >
                            <img
                                src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                                alt="Buy Me A Coffee"
                                className="h-12 w-auto"
                            />
                        </a>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="text-center space-y-2">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a
                                    href="mailto:linpp2009@gmail.com"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                                >
                                    linpp2009@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-muted-foreground">𝕏</span>
                                <a
                                    href="https://x.com/c_loud26"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                                >
                                    @c_loud26
                                </a>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                            {t('feedback.contactPrompt')}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Built with{" "}
                        <span className="text-red-500">♥</span> by{" "}
                        <a
                            href="https://linpp2009.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors underline underline-offset-4"
                        >
                            LLM Tools Collection
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
