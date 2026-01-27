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
import Link from "next/link";
import SmoothScroll from "../smooth-scroll";
import { cn } from "@/lib/utils";
import { fetchProjects, BackendProject } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Fallback image for projects without images
const FALLBACK_IMAGE = "/assets/projects-screenshots/default.png";

const ProjectsSection = () => {
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await fetchProjects();
        // Filter only active projects and sort by priority
        const activeProjects = data
          .filter((p) => p.active !== false)
          .sort((a, b) => (a.priority || 999) - (b.priority || 999));
        setProjects(activeProjects);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <section id="projects" className="max-w-7xl mx-auto min-h-screen py-16">
      <Link href={"#projects"}>
        <h2
          className={cn(
            "bg-clip-text text-4xl text-center text-transparent md:text-7xl pt-16",
            "bg-gradient-to-b from-black/80 to-black/50",
            "dark:bg-gradient-to-b dark:from-white/80 dark:to-white/20 dark:bg-opacity-50 mb-16"
          )}
        >
          Projects
        </h2>
      </Link>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <span className="ml-2 text-zinc-500">Loading projects...</span>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <p className="text-zinc-500">No projects found</p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

const ProjectCard = ({ project }: { project: BackendProject }) => {
  // Get the first image or use fallback
  const mainImage = project.images?.[0]?.url || FALLBACK_IMAGE;
  // Get category from first tag or use default
  const category = project.tags?.[0] || "Project";

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
              src={mainImage}
              alt={project.title}
              width={400}
              height={267}
              unoptimized={mainImage.startsWith('http')}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-6">
                <div className="text-lg text-left text-white">{project.title}</div>
                <div className="text-xs bg-white text-black rounded-lg w-fit px-2">
                  {category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <ProjectDetails project={project} />
            </ModalContent>
          </SmoothScroll>
          <ModalFooter className="gap-4">
            <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
              Cancel
            </button>
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank">
                <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
                  Visit
                </button>
              </Link>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

const ProjectDetails = ({ project }: { project: BackendProject }) => {
  return (
    <>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
        {project.title}
      </h4>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="font-mono text-sm md:text-base text-center mb-8 text-zinc-600 dark:text-zinc-400">
        {project.description}
      </p>

      {/* Project Markdown Content */}
      {project.projectMarkdown && (
        <div
          className="prose dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: project.projectMarkdown }}
        />
      )}

      {/* Screenshots */}
      {project.images && project.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {project.images
            .filter((img) => img.showOnProject !== false)
            .map((image, idx) => (
              <div key={idx} className="relative rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.caption || `Screenshot ${idx + 1}`}
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                  unoptimized={image.url.startsWith('http')}
                />
                {image.caption && (
                  <p className="text-xs text-center mt-2 text-zinc-500">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Links */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 my-4">
        {project.liveUrl && (
          <Link
            className="font-mono underline flex gap-2"
            href={project.liveUrl}
            target="_blank"
          >
            <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-4 py-2 rounded-md">
              Visit Website →
            </button>
          </Link>
        )}
        {project.githubUrl && (
          <Link
            className="font-mono underline flex gap-2"
            href={project.githubUrl}
            target="_blank"
          >
            <button className="bg-zinc-800 text-white dark:bg-zinc-700 text-sm px-4 py-2 rounded-md">
              View on GitHub →
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default ProjectsSection;
