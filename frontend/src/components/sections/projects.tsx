"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";
import SmoothScroll from "../smooth-scroll";
import staticProjects, { Project, Skill } from "@/data/projects";
import { cn } from "@/lib/utils";
import { fetchProjects, BackendProject } from "@/lib/api";

// Map backend project to frontend Project type for display
const mapBackendToProject = (bp: BackendProject): Project => {
  const mainImage = bp.images?.[0]?.url || "/assets/projects-screenshots/logo-dark.webp";
  const screenshots = bp.images?.map(img => img.url) || [];

  return {
    id: bp._id,
    category: bp.tags?.[0] || "Project",
    title: bp.title,
    src: mainImage,
    screenshots,
    skills: { frontend: [], backend: [] }, // Backend doesn't have skill icons
    content: (
      <div className="space-y-4">
        <p className="font-mono text-sm">{bp.description}</p>
        {bp.projectMarkdown && (
          <div dangerouslySetInnerHTML={{ __html: bp.projectMarkdown }} />
        )}
        <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
          {bp.liveUrl && (
            <Link href={bp.liveUrl} target="_blank" className="font-mono underline flex gap-2">
              <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md">
                Visit Website →
              </button>
            </Link>
          )}
          {bp.githubUrl && (
            <Link href={bp.githubUrl} target="_blank" className="font-mono underline flex gap-2">
              <button className="bg-zinc-800 text-white text-sm px-4 py-2 rounded-md">
                GitHub →
              </button>
            </Link>
          )}
        </div>
        {/* Show images in gallery */}
        {bp.images && bp.images.length > 1 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {bp.images.slice(1).map((img, idx) => (
              <Image
                key={idx}
                src={img.url}
                alt={img.caption || `Screenshot ${idx + 1}`}
                width={300}
                height={200}
                className="rounded-lg"
                unoptimized
              />
            ))}
          </div>
        )}
      </div>
    ),
    github: bp.githubUrl,
    live: bp.liveUrl || "#",
  };
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const backendData = await fetchProjects();
        if (backendData && backendData.length > 0) {
          // If backend has projects, use them
          const mapped = backendData
            .filter(p => p.active !== false)
            .sort((a, b) => (a.priority || 999) - (b.priority || 999))
            .map(mapBackendToProject);
          setProjects(mapped);
        }
        // If no backend projects, keep using static projects
      } catch (error) {
        console.log("Using static projects - backend unavailable");
        // Keep static projects on error
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <section id="projects" className="max-w-7xl mx-auto md:h-[130vh]">
      <Link href={"#projects"}>
        <h2
          className={cn(
            "bg-clip-text text-4xl text-center text-transparent md:text-7xl pt-16",
            "bg-gradient-to-b from-black/80 to-black/50",
            "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50 mb-32"
          )}
        >
          Projects
        </h2>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {projects.map((project) => (
          <Modall key={project.id || project.src} project={project} />
        ))}
      </div>
    </section>
  );
};

const Modall = ({ project }: { project: Project }) => {
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-transparent flex justify-center group/modal-btn">
          <div
            className="relative w-[400px] h-auto rounded-lg overflow-hidden"
            style={{ aspectRatio: "3/2" }}
          >
            <Image
              className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all object-cover"
              src={project.src}
              alt={project.title}
              width={300}
              height={300}
              unoptimized={project.src.startsWith('http')}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-6">
                <div className="text-lg text-left">{project.title}</div>
                <div className="text-xs bg-white text-black rounded-lg w-fit px-2">
                  {project.category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <ProjectContents project={project} />
            </ModalContent>
          </SmoothScroll>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Cancel
            </button>
            <Link href={project.live} target="_blank">
              <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
                Visit
              </button>
            </Link>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
        {project.title}
      </h4>
      <div className="flex flex-col md:flex-row md:justify-evenly max-w-screen overflow-hidden md:overflow-visible">
        {project.skills.frontend?.length > 0 && (
          <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
            <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
              Frontend
            </p>
            <FloatingDock items={project.skills.frontend} />
          </div>
        )}
        {project.skills.backend?.length > 0 && (
          <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
            <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
              Backend
            </p>
            <FloatingDock items={project.skills.backend} />
          </div>
        )}
      </div>
      {project.content}
    </>
  );
};

export default ProjectsSection;
