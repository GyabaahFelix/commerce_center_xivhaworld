"use client";

import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";

// Dynamically import NavIcons to prevent SSR issues
const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  return (
    <div className="h-20 px-4 md:px-6 lg:px-10 xl:px-16 2xl:px-24 flex items-center justify-between">
      {/* LEFT - UNI MALL LOGO (Always visible) */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Uni Mall Logo" width={30} height={30} />
          <div className="text-2xl sm:text-4xl tracking-widest font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-500 to-blue-600 drop-shadow-lg">
            UNI MALL
          </div>
        </Link>
      </div>

      {/* CENTER - NAVIGATION LINKS (Hidden on small screens) */}
      <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
        <Link href="/" className="text-lg font-semibold hover:text-blue-600 transition">
          Home
        </Link>
        <Link href="/about" className="text-lg font-semibold hover:text-blue-600 transition">
          About
        </Link>
        <Link href="/contact" className="text-lg font-semibold hover:text-blue-600 transition">
          Contact
        </Link>
      </div>

      {/* RIGHT - MENU BUTTON (Visible only on small screens) & NAV ICONS (Hidden on small screens) */}
      <div className="flex items-center">
        <div className="sm:hidden">
          <Menu />
        </div>
        <div className="hidden sm:flex items-center gap-6 ml-auto">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
