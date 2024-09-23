"use client";

import Image from "next/image";
import styles from "./projectSection.module.css";
import React from "react";
import { motion, useInView } from "framer-motion";

export function ProjectSection(section: any) {
    const textContainerRef = React.useRef<HTMLDivElement>(null);
    const sectionRef = React.useRef<HTMLDivElement>(null);

    const inView = useInView(sectionRef, { margin: "-50% 0px" });

    return (
        <div className={styles.projectWrapper}>
            {inView ?
                <motion.div
                    // @ts-ignore-next-line
                    className={styles.textContainer}
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    ref={textContainerRef}
                    dangerouslySetInnerHTML={{ __html: section.text_html }}
                />
            :   null}

            <div ref={sectionRef}>
                {section.images.map(({ image, position }) => {
                    return (
                        <div
                            key={image.id}
                            className={styles.imageContainer}
                            style={{ justifyContent: position === "left" ? "flex-start" : "flex-end" }}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                height={500}
                                width={700}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
