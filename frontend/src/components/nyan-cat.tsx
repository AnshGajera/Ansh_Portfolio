"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
} from "framer-motion";

const getRandomHeight = () => {
  return `${Math.random() * 80}vh`;
};

const NyanCat = () => {
  const [mounted, setMounted] = useState(false);
  const [divs, setDivs] = useState<
    {
      id: string;
    }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" || e.key === "N") {
        const newDiv = {
          id: (Math.random() * 100000).toFixed(),
        };
        setDivs((prevDivs) => [...prevDivs, newDiv]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed left-0 top-0 w-screen h-screen overflow-hidden z-[40] pointer-events-none">
      <AnimatePresence>
        {divs.map((div) => (
          <AnimatedDiv
            key={div.id}
            id={div.id}
            onClick={() => console.log("clicked")}
            onCompleted={() => {
              setDivs((prevDivs) => prevDivs.filter((d) => d.id !== div.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const AnimatedDiv = ({
  id,
  onClick,
  onCompleted,
}: {
  id: string;
  onClick: () => void;
  onCompleted: () => void;
}) => {
  const [randY] = useState(() => getRandomHeight());

  const controls = useAnimationControls();

  React.useEffect(() => {
    controls.start({
      x: "100vw",
      y: randY,
      transition: { duration: 5, ease: "linear" },
    });
  }, [controls, randY]);

  const handlePause = () => {
    onClick();
  };

  return (
    <motion.div
      key={id}
      initial={{ x: "-20vw", y: randY }}
      animate={controls}
      exit={{ x: "100vw", opacity: 0 }}
      onAnimationComplete={onCompleted}
      onClick={handlePause}
    >
      <img
        src="/assets/nyan-cat.gif"
        className={cn("fixed z-10 h-40 w-auto pointer-events-auto")}
        alt="Nyan Cat"
        draggable={false}
      />
    </motion.div>
  );
};

export default NyanCat;
