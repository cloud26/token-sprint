import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { type Language } from "@/config/languages"

interface BreadcrumbItem {
    label: string
    href?: string
    current?: boolean
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    language: Language
}

export function Breadcrumb({ items, language }: BreadcrumbProps) {
    const homeLabel = language === 'en' ? 'Home' : '首页'
    
    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link 
                href={`/${language}`}
                className="flex items-center hover:text-foreground transition-colors"
                title={homeLabel}
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">{homeLabel}</span>
            </Link>
            
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-1">
                    <ChevronRight className="h-4 w-4" />
                    {item.href && !item.current ? (
                        <Link 
                            href={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={item.current ? "text-foreground font-medium" : ""}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
} 