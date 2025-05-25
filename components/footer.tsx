import { Coffee, Github, Twitter, Globe, Mail, Heart, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"

interface ProjectLink {
    name: string
    url: string
    description: string
}

export function Footer() {
    // 你可以在这里添加你的项目链接
    const projectLinks: ProjectLink[] = [
        {
            name: "Costcat",
            url: "https://costcat.darkraven.ai/",
            description: "Cut Cloud Costs with Smart Optimization"
        }
    ]

    return (
        <footer className="mt-12 py-6 border-t border-border bg-background">
            <div className="max-w-4xl mx-auto px-4">
                {/* Coffee Support & Projects in one row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
                    {/* Coffee Support */}
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

                    {/* Project Links */}
                    {projectLinks.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Related:</span>
                            <div className="flex gap-2">
                                {projectLinks.map((project) => (
                                    <a
                                        key={project.name}
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors duration-200"
                                        title={project.description}
                                    >
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            {project.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Copyright Section */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a 
                            href="mailto:linpp2009@gmail.com"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                        >
                            linpp2009@gmail.com
                        </a>
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
                            linpp2009.com
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
} 