"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import Link from "next/link";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle,
  NavbarButton 
} from "./ui/resizable-navbar-fixed";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "/features" },
    { name: "Predict", link: "/predict" },
    { name: "Skills", link: "/skills" },
    { name: "Roadmaps", link: "/roadmaps" },
    { name: "About", link: "/about" },
  ];

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <Link href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-black dark:text-white">CareerVision AI</span>
          </Link>

          {/* Navigation Items */}
          <NavItems items={navItems} onItemClick={handleItemClick} />

          {/* CTA Button */}
          <div className="relative z-20">
            <NavbarButton 
              href="/predict" 
              variant="gradient"
              className="text-sm"
            >
              Get Started
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center space-x-2 px-2 py-1">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-black dark:text-white">CareerVision AI</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </MobileNavHeader>

          {/* Mobile Menu */}
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="block text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium py-2"
                onClick={handleItemClick}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 w-full">
              <NavbarButton 
                href="/predict" 
                variant="gradient"
                className="w-full text-center"
                onClick={handleItemClick}
              >
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}