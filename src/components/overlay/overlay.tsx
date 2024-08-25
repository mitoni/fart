"use client";

import Link from "next/link";
import styles from "./overlay.module.css";
import React from "react";
import Logo from "@/data/svg/logo";
import { usePathname } from "next/navigation";

export default function Overlay() {
    const [color, setColor] = React.useState("");
    const pathname = usePathname();

    React.useEffect(() => {
        const main = document.querySelector(".fart-page div:first-child");

        if (!main) return;

        const doc = getComputedStyle(document.body);
        const blue = doc.getPropertyValue("--blue");
        const yellow = doc.getPropertyValue("--yellow");

        const bgColor = getComputedStyle(main).backgroundColor;
        const rgb = bgColor
            .match(/\((.*?)\)/g)
            ?.at(0)
            ?.slice(1, -1)
            ?.replaceAll(" ", "")
            ?.split(",");

        const [r, g, b] = rgb!;
        const hex =
            "#" +
            (parseInt(r).toString(16).length == 1 ? "0" + parseInt(r).toString(16) : parseInt(r).toString(16)) +
            (parseInt(g).toString(16).length == 1 ? "0" + parseInt(g).toString(16) : parseInt(g).toString(16)) +
            (parseInt(b).toString(16).length == 1 ? "0" + parseInt(b).toString(16) : parseInt(b).toString(16));

        const isYellowBg = hex.toLowerCase() == yellow.toLowerCase();

        setColor(isYellowBg ? blue : yellow);
    }, []);

    return (
        <div className={styles.container}>
            <div style={{ placeSelf: "start start" }}>
                <Link href="/" className={styles.catcher}>
                    <Logo width={100} color={color} />
                </Link>
            </div>

            <div style={{ placeSelf: "start end" }}>
                {pathname == "/" ? (
                    <Link href={"/about-us"} className={`${styles.catcher}`} style={{ color: color }}>
                        About Us
                    </Link>
                ) : (
                    <Link href={"/"} className={`${styles.catcher}`} style={{ color: color }}>
                        Home
                    </Link>
                )}
            </div>

            <div style={{ placeSelf: "end start" }}>
                {
                    // <span className={styles.shadow}>Back To Top</span>
                }
            </div>

            <div style={{ placeSelf: "end end" }}>
                {
                    //  <Link href={"/about-us"} className={styles.shadow}>
                    //  About Us
                    //  </Link>
                }
            </div>
        </div>
    );
}
