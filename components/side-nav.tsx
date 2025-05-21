import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { tools, home, type Language } from "@/config/languages"

interface SideNavProps {
    language: Language
    currentPath?: string
}

export function SideNav({ language, currentPath }: SideNavProps) {
    const toolsList = [
        tools.llmGpuCalculator,
        tools.tokenSpeedVisualizer,
    ]

    return (
        <nav className="w-64 h-[calc(100vh-2rem)] border-r p-4 fixed left-0 top-4 overflow-y-auto">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">{home.title[language]}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        {home.description[language]}
                    </p>
                </div>
                
                <div className="space-y-2">
                    {toolsList.map((tool) => {
                        const path = `/${language}/${tool.path}`
                        const isActive = currentPath === path
                        
                        return (
                            <Link
                                key={tool.path}
                                href={path}
                                className={`group flex items-start p-3 rounded-lg border ${
                                    isActive 
                                        ? "bg-primary/5 border-primary/20" 
                                        : "bg-card hover:bg-card/80"
                                } text-card-foreground transition-all`}
                            >
                                <div className="space-y-1 flex-1">
                                    <h3 className="text-sm font-medium">{tool.title[language]}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description[language]}</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform mt-1 ml-2 flex-shrink-0" />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
} 