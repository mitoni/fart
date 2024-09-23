"use client";

import { usePathname } from "next/navigation";
import React from "react";

function findTagInParents(el: Element | null, ...attrs: string[]): boolean {
    function recurse(el: Element | null) {
        if (el == null) return false;
        if (attrs.some((attr) => !!el.getAttribute(attr))) return true;
        if (!el.parentElement) return false;
        return recurse(el.parentElement);
    }
    return recurse(el);
}

export default function CirclePointer() {
    const pathname = usePathname();
    const cursor = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        function handlePointerMove(event: MouseEvent) {
            if (!cursor.current) return;
            const { x, y } = event;
            cursor.current.style.left = `${x}px`;
            cursor.current.style.top = `${y}px`;

            const hover = document.elementFromPoint(x, y);
            const isLink = findTagInParents(hover, "href", "data-link");
            if (isLink) {
                cursor.current.style.width = "2rem";
                cursor.current.style.height = "2rem";
            } else if ((cursor.current.style.width = "2rem")) {
                cursor.current.style.width = "1rem";
                cursor.current.style.height = "1rem";
            }
        }

        if (pathname.startsWith("/admin")) return;

        // detect mobile
        if (window.innerWidth < 768) return;

        window.addEventListener("mousemove", handlePointerMove);
        return () => {
            window.removeEventListener("mousemove", handlePointerMove);
        };
    }, [pathname]);

    // use another effect to revel the cursor at first movement
    // and then remove the listener
    React.useLayoutEffect(() => {
        function handlePointerMove() {
            if (!cursor.current) return;
            cursor.current.style.visibility = "visible";
            window.removeEventListener("mousemove", handlePointerMove);
        }

        if (pathname.startsWith("/admin")) return;

        // detect mobile
        if (window.innerWidth < 768) return;

        window.addEventListener("mousemove", handlePointerMove);
    }, [pathname]);

    if (pathname.startsWith("/admin")) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-exclusion">
            <div
                ref={cursor}
                style={{
                    width: "1rem",
                    height: "1rem",
                    transitionProperty: "width, height",
                    transitionDuration: "250ms",
                    transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)",
                    visibility: "hidden",
                    position: "fixed",
                    inset: 0,
                    borderRadius: 99,
                    transform: "translate(-50%, -50%)",
                    zIndex: 99,
                    background: "var(--diff)",
                    mixBlendMode: "difference",
                    pointerEvents: "none",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                }}
            />
        </div>
    );
}
