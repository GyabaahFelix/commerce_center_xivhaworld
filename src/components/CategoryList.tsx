"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to handle smooth scrolling
  const scrollByAmount = (amount: number) => {
    if (carouselRef.current) {
      const start = carouselRef.current.scrollLeft;
      const startTime = performance.now();
      const duration = 300; // Adjust duration for smoothness

      const animateScroll = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        carouselRef.current!.scrollLeft = start + amount * progress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <div className="relative w-full px-4">
      {/* Category List - Scrollbar hidden on all screens */}
      <motion.div
        ref={carouselRef}
        className="grid grid-cols-2 gap-4 sm:flex sm:overflow-hidden sm:scrollbar-hide cursor-grab active:cursor-grabbing will-change-transform"
        drag="x"
        dragConstraints={{ right: 0, left: -categories.length * 220 }}
        dragElastic={0.2}
        whileTap={{ cursor: "grabbing" }}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          overflow: "hidden", // Hide scrollbars on all screens
        }}
      >
        {categories.slice(0, 4).map((item) => (
          <motion.div
            key={item._id}
            className="w-full sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px]"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/list?cat=${item.slug}`} className="block">
              <div className="relative bg-slate-100 w-full h-40 sm:h-64 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.media?.mainMedia?.image?.url || "/cart.png"}
                  alt={item.name || "Category Image"}
                  fill
                  sizes="20vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <h1 className="mt-2 sm:mt-4 font-light text-sm sm:text-lg tracking-wide text-center">
                {item.name}
              </h1>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll Buttons - Only show on small screens */}
      <div className="flex justify-center gap-6 mt-4 sm:hidden">
        <button
          className="bg-gray-200 p-3 rounded-full shadow-md"
          onClick={() => scrollByAmount(-300)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="bg-gray-200 p-3 rounded-full shadow-md"
          onClick={() => scrollByAmount(300)}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scroll Buttons on Large Screens */}
      <button
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        onClick={() => scrollByAmount(-300)}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        onClick={() => scrollByAmount(300)}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default CategoryList;
