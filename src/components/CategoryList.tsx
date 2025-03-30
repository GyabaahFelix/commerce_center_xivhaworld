"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const ITEMS_PER_PAGE = 4;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

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

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + ITEMS_PER_PAGE < categories.length;

  const handleNext = () => {
    if (canGoNext) {
      setDirection(1); // Moving right
      setCurrentIndex((prevIndex) => prevIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setDirection(-1); // Moving left
      setCurrentIndex((prevIndex) => prevIndex - ITEMS_PER_PAGE);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div {...handlers} className="relative w-full px-4 overflow-hidden">
      {/* Category List with Galaxy S21 Ultra App Switcher Animation */}
      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            initial={{ x: direction > 0 ? "100%" : "-100%", scale: 0.9, opacity: 0.8 }}
            animate={{ x: "0%", scale: 1, opacity: 1 }}
            exit={{ x: direction > 0 ? "-100%" : "100%", scale: 0.9, opacity: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 gap-4 sm:flex sm:overflow-hidden sm:scrollbar-hide cursor-grab active:cursor-grabbing"
          >
            {categories.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((item) => (
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
        </AnimatePresence>
      </div>

      {/* Scroll Buttons - Small & Medium Screens */}
      <div className="flex justify-center gap-6 mt-4 sm:flex">
        {canGoPrev && (
          <button className="bg-gray-200 p-3 rounded-full shadow-md" onClick={handlePrev}>
            <ChevronLeft size={24} />
          </button>
        )}
        {canGoNext && (
          <button className="bg-gray-200 p-3 rounded-full shadow-md" onClick={handleNext}>
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Scroll Buttons - Large Screens */}
      {canGoPrev && (
        <button
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
          onClick={handlePrev}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {canGoNext && (
        <button
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
          onClick={handleNext}
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default CategoryList;
