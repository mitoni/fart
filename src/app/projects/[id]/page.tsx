import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@/payload.config";
import styles from "./page.module.css";
import React from "react";
import { ProjectSection } from "@/components/projectSection/projectSection";

export default async function ProjectId({ params }: { params: { id: string } }) {
    const { id } = params;

    const payload = await getPayloadHMR({
        config,
    });

    const project = await payload.findByID({
        collection: "projects",
        id,
    });

    const { sections } = project;

    return (
        <div className={styles.main} style={{ backgroundColor: project.backgroundColor, color: project.textColor }}>
            <div className={styles.heroContainer}>HERO</div>
            {sections.map((section) => (
                <ProjectSection key={section.id} {...section} />
            ))}
        </div>
    );
}
