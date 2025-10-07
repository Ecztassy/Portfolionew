"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlitchText } from "./glitch-text"
import { ExternalLink, Github } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"
import { title } from "process"

interface ProjectGridProps {
  activeCategory: string
  pageSize?: number // 👈 Add this line
}


export function ProjectGrid({ activeCategory, pageSize = 10 }: ProjectGridProps) {
  const { t, language } = useLanguage()
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const [displayTexts, setDisplayTexts] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  // Define projects with translations and updated categories
  const projects = [
    {
      id: "project1",
      title: t("projects.items.ezpass.title"),
      description: t("projects.items.ezpass.description"),
      image: "/images/ezpass.png", // Fixed key from 'Image' to 'image'
      category: "web",
      link: "https://ezpassprogram.vercel.app/",
      github: "https://github.com/Ecztassy/EZPassWebsite",
    },
    {
      id: "project2",
      title: t("projects.items.portfolio.title"),
      description: t("projects.items.portfolio.description"),
      image: "/images/oldport.png",
      category: "web",
      link: "https://portfoliodiogofragoso.vercel.app/",
      github: "https://github.com/Ecztassy/Portfolio.github.io",
    },
    {
      id: "project3",
      title: t("projects.items.protocol.title"),
      description: t("projects.items.protocol.description"),
      image: "/images/about.png",
      category: "web",
      link: "https://aboutecztassy.netlify.app/",
      github: "https://github.com/Ecztassy/aboutecztassy.github.io",
    },
    {
      id: "project4",
      title: t("projects.items.memory.title"),
      description: t("projects.items.memory.description"),
      image: "/images/first.png",
      category: "web",
      link: "https://ecztassy.github.io/SiteDesafio/",
      github: "https://github.com/Ecztassy/SiteDesafio",
    },
    {
      id: "project5",
      title: t("projects.items.engine.title"),
      description: t("projects.items.engine.description"),
      image: "/images/ftp.png",
      category: "server",
    },
    {
      id: "project6",
      title: t("projects.items.wired.title"),
      description: t("projects.items.wired.description"),
      image: "/images/xampp.png",
      category: "web",
    },
    {
      id: "project7",
      title: t("projects.items.extension.title"),
      description: t("projects.items.extension.description"),
      image: "/images/extension.png",
      category: "web",
      github: "https://github.com/Ecztassy/EZPassExtensions",
    },
    {
      id: "project8",
      title: t("projects.items.server.title"),
      description: t("projects.items.server.description"),
      image: "/images/alpine.jpg",
      category: "linux",
    },
    {
      id: "project9",
      title: t("projects.items.pixel.title"),
      description: t("projects.items.pixel.description"),
      image: "/images/manegement.png",
      category: "software",
      github: "https://github.com/Ecztassy/storemanagement",
    },
    {
      id: "project10",
      title: t("projects.items.artifacts.title"),
      description: t("projects.items.artifacts.description"),
      image: "/images/ezpassapp.png",
      category: "software",
      github: "https://github.com/Ecztassy/EZPass",
    },
    {
        id:"project11",
        title: t("projects.items.about1.title"),
        description: t("projects.items.about1.description"),
        image: "/images/place.png",
        category: "web",
        link: "https://abouttassy.vercel.app",
        github: "https://github.com/Ecztassy/abouttassy",
      },
  ]

  // Update filtered projects when activeCategory or language changes
  useEffect(() => {
    setIsLoading(true)

    // Update projects with current translations
    const updatedProjects = [
      {
        id: "project1",
        title: t("projects.items.ezpass.title"),
        description: t("projects.items.ezpass.description"),
        image: "/images/ezpass.png",
        category: "web",
        link: "https://ezpassprogram.vercel.app/",
        github: "https://github.com/Ecztassy/EZPassWebsite",
      },
      {
        id: "project2",
        title: t("projects.items.portfolio.title"),
        description: t("projects.items.portfolio.description"),
        image: "/images/oldport.png",
        category: "web",
        link: "https://portfoliodiogofragoso.vercel.app/",
        github: "https://github.com/Ecztassy/Portfolio.github.io",
      },
      {
        id: "project3",
        title: t("projects.items.protocol.title"),
        description: t("projects.items.protocol.description"),
        image: "/images/about.png",
        category: "web",
        link: "https://aboutecztassy.netlify.app/",
        github: "https://github.com/Ecztassy/aboutecztassy.github.io",
      },
      {
        id: "project4",
        title: t("projects.items.memory.title"),
        description: t("projects.items.memory.description"),
        image: "/images/first.png",
        category: "web",
        link: "https://ecztassy.github.io/SiteDesafio/",
        github: "https://github.com/Ecztassy/SiteDesafio",
      },
      {
        id: "project5",
        title: t("projects.items.engine.title"),
        description: t("projects.items.engine.description"),
        image: "/images/ftp.png",
        category: "server",
      },
      {
        id: "project6",
        title: t("projects.items.wired.title"),
        description: t("projects.items.wired.description"),
        image: "/images/xampp.png",
        category: "web",
      },
      {
        id: "project7",
        title: t("projects.items.extension.title"),
        description: t("projects.items.extension.description"),
        image: "/images/extension.png",
        category: "web",
        github: "https://github.com/Ecztassy/EZPassExtensions",
      },
      {
        id: "project8",
        title: t("projects.items.server.title"),
        description: t("projects.items.server.description"),
        image: "/images/alpine.jpg",
        category: "linux",
      },
      {
        id: "project9",
        title: t("projects.items.pixel.title"),
        description: t("projects.items.pixel.description"),
        image: "/images/manegement.png",
        category: "software",
        github: "https://github.com/Ecztassy/storemanagement",
      },
      {
        id: "project10",
        title: t("projects.items.artifacts.title"),
        description: t("projects.items.artifacts.description"),
        image: "/images/ezpassapp.png",
        category: "software",
        github: "https://github.com/Ecztassy/EZPass",
      },
      {
        id:"project11",
        title: t("projects.items.about1.title"),
        description: t("projects.items.about1.description"),
        image: "/images/place.png",
        category: "web",
        link: "https://abouttassy.vercel.app",
        github: "https://github.com/Ecztassy/abouttassy",
      },
    ]

    // Update the projects reference
    projects.length = 0
    projects.push(...updatedProjects)

    setTimeout(() => {
      if (activeCategory === "all") {
        setFilteredProjects([...updatedProjects])
      } else {
        setFilteredProjects(updatedProjects.filter((project) => project.category === activeCategory))
      }
      setIsLoading(false)
    }, 300) // Short delay to ensure animation works
  }, [activeCategory, t])

  // Update displayTexts initialization to re-run when language changes
  useEffect(() => {
    const initialTexts: { [key: string]: string } = {}
    projects.forEach((project) => {
      initialTexts[project.id] = project.description
    })
    setDisplayTexts(initialTexts)
  }, [t])

  // Handle typing animation without losing first letter
  const startTypingAnimation = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    const fullText = project.description
    let currentIndex = 0

    const intervalId = setInterval(() => {
      currentIndex++
      if (currentIndex <= fullText.length) {
        setDisplayTexts((prev) => ({
          ...prev,
          [projectId]: fullText.substring(0, currentIndex),
        }))
      } else {
        clearInterval(intervalId)
      }
    }, 15)

    return () => clearInterval(intervalId)
  }

  // Handle mouse enter
  const handleMouseEnter = (projectId: string) => {
    setHoveredProject(projectId)
    startTypingAnimation(projectId)
  }

  // Handle mouse leave
  const handleMouseLeave = (projectId: string) => {
    setHoveredProject(null)
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      setDisplayTexts((prev) => ({
        ...prev,
        [projectId]: project.description,
      }))
    }
  }

  // Check if language is Japanese for special styling
  const isJapanese = language === "jp"

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-green-400/70 font-mono">{t("projects.loading")}</p>
            </motion.div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="border border-green-400/30 bg-black relative overflow-hidden group"
                onMouseEnter={() => handleMouseEnter(project.id)}
                onMouseLeave={() => handleMouseLeave(project.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                    onError={() => console.log(`Failed to load image: ${project.image}`)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  {hoveredProject === project.id && (
                    <div className="absolute inset-0 bg-green-400/10 mix-blend-overlay"></div>
                  )}
                </div>

                <div className="p-4">
                  <GlitchText
                    text={project.title}
                    className="text-lg font-bold mb-2"
                    glitchInterval={hoveredProject === project.id ? 2000 : 10000}
                  />
                  <div
                    className={`text-green-400/70 text-sm mb-4 h-20 overflow-hidden ${isJapanese ? "break-words" : ""}`}
                  >
                    {displayTexts[project.id] || project.description}
                    {hoveredProject === project.id && <span className="inline-block ml-1 animate-pulse">_</span>}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-green-400/50 uppercase">
                      {t(`projects.categories.${project.category}`)}
                    </span>
                    <div className="flex space-x-2">
                      {project.github && (
                        <a
                          href={project.github} target="_blank" rel="noopener noreferrer"
                          className="p-1 text-green-400/70 hover:text-green-400 transition-colors"
                          aria-label="View on GitHub"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link} target="_blank" rel="noopener noreferrer"
                          className="p-1 text-green-400/70 hover:text-green-400 transition-colors"
                          aria-label="View live project"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10"></div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-green-400/70 font-mono">{t("projects.noProjects")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}