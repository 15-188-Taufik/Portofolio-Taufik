// src/components/InteractiveProjects.tsx
"use client";

import { useState } from "react";
import ProjectList from "@/components/ProjectList";

interface InteractiveProjectsProps {
  projects: any[]; // Project type from Prisma, any is acceptable for now
  skillsArray: string[];
}

export default function InteractiveProjects({ projects, skillsArray }: InteractiveProjectsProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleSkillClick = (skill: string) => {
    const newSkill = selectedSkill === skill ? null : skill;
    setSelectedSkill(newSkill);
    // Scroll to the projects section (the container has id="projects")
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Skill Badges */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
        {skillsArray.map((skill) => (
          <button
            type="button"
            key={skill}
            className={`text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              selectedSkill === skill
                ? "bg-[#CFB53B] text-white"
                : "bg-[#151515] border border-white/10 text-gray-300 hover:border-[#CFB53B]"
            }`}
            onClick={() => handleSkillClick(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Project list filtered by selected skill */}
      <ProjectList projects={projects} filterSkill={selectedSkill ?? undefined} />
    </>
  );
}
