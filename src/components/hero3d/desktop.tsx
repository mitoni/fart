"use client";

import React from "react";
import bg from "./fart-bg.svg";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as _Image, Text, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Group, Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils.js";
import { damp3 } from "maath/easing";
import { remap } from "maath/misc";

import { emitter } from "@/emitter/emitter";

const SPACE = 5;
const BASE_FONT_SIZE = 1;
const FONT = "/fonts/aga.woff";
const TEXT_COLOR = "white";

const Image3D = React.forwardRef(function Image(
    props: React.ComponentProps<typeof _Image> & { ["data-key"]: number } & {
        project: any;
    },
    _: any
) {
    const { position, "data-key": dataKey, scale, project, ...args } = props;

    const iref = React.useRef<any>(null!);
    const title = React.useRef<any>(null!);
    const gref = React.useRef<Group>(null!);
    const text = React.useRef<Group>(null!);
    const description = React.useRef<any>(null!);
    const hover = React.useRef(false);
    const three = useThree();

    const pos = dataKey % 2 == 0 ? "left" : "right";
    const s = Array.isArray(scale) ? scale : [scale];
    const anchorX = pos == "right" ? "left" : "right";
    const textAlign = pos == "right" ? "left" : "right";

    const sx = Array.isArray(scale) ? scale?.[0] ?? 1 : 1;
    const sy = Array.isArray(scale) ? scale?.[1] ?? 1 : 1;
    const sMult = 2.5;

    useFrame((_, delta) => {
        damp3(iref.current.scale, hover.current ? [sx * sMult, sy * sMult, 1] : [sx, sy, 1], 0.25, delta);

        damp3(
            text.current.position,
            hover.current
                ? pos == "right"
                    ? [1.5 * s[0]!, 0, 1]
                    : [-1.5 * s[0]!, 0, 1]
                : pos == "right"
                ? [0.75 * s[0]!, 0, 1]
                : [-0.75 * s[0]!, 0, 1],
            0.25,
            delta
        );
        // damp(title.current, "fillOpacity", hover.current ? 1 : 0, 0.25, delta);
        // damp(
        //   description.current,
        //   "fillOpacity",
        //   hover.current ? 1 : 0,
        //   0.25,
        //   delta
        // );
    });

    const cpos = three.camera.position;
    const range = [0, 30];

    useFrame((_, delta) => {
        let ipos = new Vector3();
        iref.current.getWorldPosition(ipos);
        const _dist = cpos.z - ipos.z;
        const dist = clamp(_dist, range[0], range[1]);
        const remapped = remap(dist, range, [0, 1]);
        damp3(gref.current.scale, new Vector3(remapped, remapped, remapped), 0.15, delta);
    });

    return (
        <group position={position}>
            <group ref={gref}>
                <_Image
                    ref={iref}
                    scale={scale}
                    {...args}
                    transparent={true}
                    onPointerEnter={() => (hover.current = true)}
                    onPointerLeave={() => (hover.current = false)}
                ></_Image>
                <group ref={text} position={pos == "right" ? [0.75 * s[0]!, 0, 1] : [-0.75 * s[0]!, 0, 1]}>
                    <Text
                        anchorX={anchorX}
                        anchorY={"bottom"}
                        textAlign={textAlign}
                        ref={title}
                        font={FONT}
                        fontSize={BASE_FONT_SIZE * 0.5}
                        fillOpacity={1}
                    >
                        {project.title}
                        <meshBasicMaterial toneMapped={false} color={TEXT_COLOR} />
                    </Text>
                    <Text
                        anchorX={anchorX}
                        anchorY={"top"}
                        textAlign={textAlign}
                        ref={description}
                        font={FONT}
                        fontSize={BASE_FONT_SIZE * 0.25}
                        color={TEXT_COLOR}
                        fillOpacity={1}
                    >
                        {project.description}
                        <meshBasicMaterial toneMapped={false} color={TEXT_COLOR} />
                    </Text>
                </group>
            </group>
        </group>
    );
});

const Images = React.forwardRef(function Images({ projects = [] }: { projects: any[] }, ref: React.ForwardedRef<any>) {
    const scrolled = React.useRef(0);
    const triggered = React.useRef(false);
    const ratio = window.innerHeight / window.innerWidth;

    const group = React.useRef<Group>(null!);

    console.log({ projects });

    React.useImperativeHandle(ref, () => {
        return {
            move(p: number) {
                scrolled.current = p;
            },
        };
    });

    React.useEffect(() => {
        function handleScroll() {
            triggered.current = true;
            window.removeEventListener("scroll", handleScroll);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame((_, delta) => {
        const target = triggered.current
            ? new Vector3(0, 0, scrolled.current * projects?.length * SPACE)
            : group.current.position.clone().add(new Vector3(0, 0, 0.1));

        damp3(group.current.position, target, 0.25, delta);
    });

    const dx = 6;
    const dy = dx * ratio;

    const pts = [new Vector3(-dx, -dy, 0), new Vector3(dx, -dy, 0), new Vector3(-dx, dy, 0), new Vector3(dx, dy, 0)];

    return (
        <group ref={group}>
            {projects.map((project, i) => {
                const { width, height } = project.image;
                const p = i % 4;

                const position = pts[p].clone();
                position.setZ(-i * SPACE);

                return (
                    <Image3D
                        key={project.id}
                        data-key={project.id}
                        scale={[(1 / height) * 5000, (1 / width) * 5000]}
                        position={position}
                        url={project.image.url}
                        project={project}
                    />
                );
            })}
        </group>
    );
});

export default function Desktop({ projects }: { projects: any[] }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const imgs = React.useRef<any>(null);

    React.useEffect(() => {
        function handleScroll() {
            const rh = ref.current!.parentElement!.offsetHeight;
            const { top: ot } = ref.current!.parentElement!.getBoundingClientRect();
            const clamped = clamp(-ot / (rh - window.innerHeight), 0, Infinity);

            imgs.current?.move(clamped);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div id="hero3d" style={{ height: "500vh" }}>
            <div ref={ref} style={{ height: "100vh", position: "sticky", top: 0 }}>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                    }}
                >
                    <img
                        src={bg.src}
                        alt="fart logo"
                        style={{
                            width: "100%",
                            position: "absolute",
                            bottom: 0,
                            padding: "0 min(5%, 50px)",
                            boxSizing: "border-box",
                            transform: "translateY(11%)",
                        }}
                    />
                </div>
                <Canvas gl={{ antialias: false }}>
                    <PerspectiveCamera makeDefault fov={35} position={[0, 0, SPACE * 5]} />
                    {/*<CameraControls />*/}
                    <Suspense fallback={<Fallback />}>
                        <Images projects={projects} ref={imgs} />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}

function Fallback() {
    React.useEffect(() => {
        return () => {
            emitter.emit("startAnimation");
        };
    }, []);

    return null;
}
