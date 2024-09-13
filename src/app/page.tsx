import Overlay from "@/components/overlay/overlay";
import styles from "./page.module.css";
import Hero3D from "@/components/hero3d/hero3d";
import Animation from "@/components/animation/animation";
import Footer from "@/components/footer/footer";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import config from "@/payload.config";

// export const revalidate = 5;

export default async function Home() {
    const payload = await getPayloadHMR({
        config,
    });

    const { docs: projects } = await payload.find({
        collection: "projects",
        pagination: false,
    });

    return (
        <div className={styles.main}>
            <Animation />
            <Overlay />
            <Hero3D projects={projects} />
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.t1}>
                        <p>Multidisciplinary studio based in Milan.</p>
                        <p>
                            Art, Design, Film, Photography, Cross-media Communication, and beyond.
                            <br /> Above all, we believe in DREAMS.
                        </p>
                    </div>

                    <div className={styles.t2}>
                        <p>
                            Art&Creative Direction
                            <br /> by Monica Silva & Valerio Fausti
                        </p>
                    </div>

                    <div className={styles.t3}>
                        Social
                        <a href="https://www.instagram.com/factoryofart.milan/" target="_blank">
                            Instagram
                        </a>
                        <a href="https://www.linkedin.com/company/factory-of-art/" target="_blank">
                            LinkedIn
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61552556864851" target="_blank">
                            Facebook
                        </a>
                    </div>

                    <div className={styles.t4}>
                        Info&collaboration
                        <a href="mailto:info@factoryof.art">info@factoryof.art</a>
                        <a href="tel:+390282370121">+39 0282370121</a>
                    </div>
                </div>
                <Footer />
            </section>
        </div>
    );
}
