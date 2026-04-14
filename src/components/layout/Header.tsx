"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { businessConfig } from "@/config/business";
import { mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

function MobileMenu({
  isOpen,
  onClose,
  openDropdown,
  setOpenDropdown,
}: {
  isOpen: boolean;
  onClose: () => void;
  openDropdown: string | null;
  setOpenDropdown: (v: string | null) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 top-20 z-[9999] overflow-y-auto bg-white transition-opacity duration-300 lg:hidden",
        isOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
      )}
    >
      <div className="border-t border-border" />
      <div className="flex flex-col gap-1 p-6">
        {mainNav.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.label ? null : item.label
                    )
                  }
                  className="flex w-full items-center justify-between py-3 text-lg font-medium text-foreground"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openDropdown === item.label && "rotate-180"
                    )}
                  />
                </button>
                {openDropdown === item.label && (
                  <div className="ml-4 flex flex-col gap-1 border-l-2 border-primary-100 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className="py-2 text-base text-muted transition-colors hover:text-primary-500"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={onClose}
                className="block py-3 text-lg font-medium text-foreground transition-colors hover:text-primary-500"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}

        <hr className="my-4 border-border" />

        <a
          href={`tel:${businessConfig.phoneRaw}`}
          className="flex items-center gap-2 py-3 text-lg font-medium text-foreground"
        >
          <Phone className="h-5 w-5 text-primary-500" />
          {businessConfig.phone}
        </a>

        <Button href="/contact" className="mt-2 w-full" onClick={onClose}>
          Get a Quote
        </Button>
      </div>
    </div>,
    document.body
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[9999] transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-white/95 backdrop-blur-md shadow-header"
            : "bg-transparent"
        )}
      >
        <Container>
          <nav className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "text-xl font-bold tracking-tight transition-colors",
                scrolled || mobileOpen ? "text-foreground" : "text-white"
              )}
            >
              {siteConfig.name}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {mainNav.map((item) => (
                <div key={item.label} className="relative">
                  {item.children ? (
                    <div
                      className="group"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                          scrolled
                            ? "text-foreground-light hover:text-primary-500"
                            : "text-white/90 hover:text-white"
                        )}
                      >
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <div
                        className={cn(
                          "absolute top-full left-0 min-w-[200px] rounded-xl bg-white py-2 shadow-card-hover transition-all duration-200",
                          openDropdown === item.label
                            ? "visible translate-y-0 opacity-100"
                            : "invisible -translate-y-2 opacity-0"
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-foreground-light transition-colors hover:bg-surface hover:text-primary-500"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors",
                        scrolled
                          ? "text-foreground-light hover:text-primary-500"
                          : "text-white/90 hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-4 lg:flex">
              <a
                href={`tel:${businessConfig.phoneRaw}`}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-foreground-light hover:text-primary-500"
                    : "text-white/90 hover:text-white"
                )}
              >
                <Phone className="h-4 w-4" />
                {businessConfig.phone}
              </a>
              <Button href="/contact" size="sm">
                Get a Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden p-2 transition-colors",
                scrolled || mobileOpen ? "text-foreground" : "text-white"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu — rendered via portal to document.body */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
    </>
  );
}
