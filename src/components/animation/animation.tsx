"use client";

import { motion, useAnimate } from "framer-motion";
import bg from "./fart-bg.svg";
import React from "react";
import { emitter } from "@/emitter/emitter";

let triggered = false;

export default function Animation() {
  const [done, setDone] = React.useState(false);
  const bgr = React.useRef(null!);
  const textr = React.useRef(null!);
  const [_, animate] = useAnimate();

  React.useEffect(() => {
    async function start() {
      await animate(
        textr.current,
        {
          translateY: "11%",
        },
        { duration: 0.5 },
      );

      await animate(
        bgr.current,
        {
          opacity: 0,
        },
        { duration: 0.25 },
      );

      setDone(true);
      triggered = true;
    }

    emitter.on("startAnimation", start);
  }, []);

  return done || triggered ? null : (
    <motion.div
      ref={bgr}
      initial={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "var(--yellow)",
        opacity: 1,
        zIndex: 999,
      }}
    >
      <img
        ref={textr}
        src={bg.src}
        alt="fart logo"
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          padding: "0 min(5%, 50px)",
          boxSizing: "border-box",
        }}
      />
    </motion.div>
  );
}
