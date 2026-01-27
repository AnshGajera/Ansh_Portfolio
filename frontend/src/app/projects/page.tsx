"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
// @ts-ignore
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/core";
import "@splidejs/react-splide/css";
import { fetchProjects, BackendProject } from "@/lib/api";
import { Loader2, ExternalLink, Github } from "lucide-react";

// Fallback image
const FALLBACK_IMAGE = "/assets/projects-screenshots/default.png";

function Page() {
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
    <>
      <div className="container mx-auto md:px-[50px] xl:px-[150px] text-zinc-300 min-h-screen pb-20">
        <h1 className="text-4xl mt-[100px] mb-[50px]">Projects</h1>

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
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 place-content-around">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

const ProjectCard = ({ project }: { project: BackendProject }) => {
  // Get images or use fallback
  const images =
    project.images && project.images.length > 0
      ? project.images.map((img) => img.url)
      : [FALLBACK_IMAGE];

  return (
    <li
      className="w-[300px] h-auto min-h-[400px] border-[.5px] rounded-md border-zinc-600 overflow-hidden"
      style={{ backdropFilter: "blur(2px)" }}
    >
      {/* Image Carousel */}
      <div className="h-[200px]">
        <Splide
          options={{
            type: "loop",
            interval: 3000,
            autoplay: true,
            speed: 2000,
            perMove: 1,
            rewind: true,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            arrows: false,
          }}
          aria-label="Project Screenshots"
        >
          {images.map((image, idx) => (
            <SplideSlide key={idx}>
              <Image
                src={image}
                alt={`Screenshot of ${project.title}`}
                className="w-[300px] h-[200px] rounded-md bg-zinc-900 object-cover"
                width={300}
                height={200}
                style={{ height: "200px" }}
                unoptimized={image.startsWith("http")}
              />
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* Content */}
      <div className="p-4 text-zinc-300">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-zinc-800 text-zinc-400 rounded px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-zinc-500 line-clamp-4 mb-4">
          {project.description}
        </p>

        {/* Links */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="w-3 h-3" />
              Live
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-300"
            >
              <Github className="w-3 h-3" />
              GitHub
            </Link>
          )}
        </div>
      </div>
    </li>
  );
};

export default Page;
