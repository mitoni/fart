import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@/payload.config";
import styles from "./page.module.css";
import React from "react";
import { ProjectSection } from "@/components/projectSection/projectSection";
import Image from "next/image";
import Overlay from "@/components/overlay/overlay";

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
            <Overlay />
            <div className={styles.heroContainer}>
                <div className={styles.heroColumn}>
                    <div></div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div>Project Title:</div>
                        <div style={{ position: "relative", marginLeft: "0.5rem" }}>
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    fontSize: "3rem",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <span>{project.title}</span>
                                <span>{project.subtitle}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Client:</span>
                            <span>{project.client}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Year:</span>
                            <span>{project.date}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <Image
                        src={project.image.url}
                        alt={project.title}
                        width={0}
                        height={0}
                        sizes="100%"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                </div>
                <div className={styles.heroColumn}>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Project Type:</span>
                            <span>{project.category.map((c) => c.title).join(" / ")}</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Involvement:</span>
                            <span>{project.involvement}</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>Description:</span>
                            <span
                                className={styles.heroDescription}
                                dangerouslySetInnerHTML={{ __html: project.description_html }}
                            ></span>
                        </div>
                    </div>
                </div>
            </div>
            {sections.map((section) => (
                <ProjectSection key={section.id} {...section} />
            ))}
        </div>
    );
}
