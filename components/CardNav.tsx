"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import Img from "next/image";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  darkBaseColor?: string;
  darkMenuColor?: string;
  darkButtonBgColor?: string;
  darkButtonTextColor?: string;
  darkCardBgColor?: string;
  darkCardTextColor?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  darkBaseColor = "#1a1a2e",
  darkMenuColor = "#e0e0e0",
  darkButtonBgColor = "#e0e0e0",
  darkButtonTextColor = "#1a1a2e",
  darkCardBgColor = "#16213e",
  darkCardTextColor = "#e0e0e0",
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const sunRef = useRef<SVGSVGElement | null>(null);
  const moonRef = useRef<SVGSVGElement | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    const navEl = navRef.current;
    if (!navEl) return;

    // Animate the toggle button (rotate + scale)
    if (toggleBtnRef.current) {
      gsap.to(toggleBtnRef.current, {
        rotation: newDark ? 360 : 0,
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.to(toggleBtnRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        },
      });
    }

    // Cross-fade sun/moon icons
    if (sunRef.current && moonRef.current) {
      gsap.to(sunRef.current, {
        opacity: newDark ? 0 : 1,
        scale: newDark ? 0.5 : 1,
        rotation: newDark ? -90 : 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(moonRef.current, {
        opacity: newDark ? 1 : 0,
        scale: newDark ? 1 : 0.5,
        rotation: newDark ? 0 : 90,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    // Animate nav background color
    gsap.to(navEl, {
      backgroundColor: newDark ? darkBaseColor : baseColor,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Animate hamburger color
    const hamburgerLines = navEl.querySelectorAll(".hamburger-line");
    hamburgerLines.forEach((line) => {
      gsap.to(line, {
        color: newDark ? darkMenuColor : menuColor,
        duration: 0.5,
        ease: "power2.inOut",
      });
    });

    // Animate hamburger menu container color
    const hamburgerMenu = navEl.querySelector(".hamburger-menu");
    if (hamburgerMenu) {
      gsap.to(hamburgerMenu, {
        color: newDark ? darkMenuColor : menuColor,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Animate CTA button
    const ctaButton = navEl.querySelector(
      ".card-nav-cta-button",
    ) as HTMLElement;
    if (ctaButton) {
      gsap.to(ctaButton, {
        backgroundColor: newDark ? darkButtonBgColor : buttonBgColor,
        color: newDark ? darkButtonTextColor : buttonTextColor,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Animate cards
    cardsRef.current.forEach((card) => {
      if (card) {
        gsap.to(card, {
          backgroundColor: newDark
            ? darkCardBgColor
            : card.dataset.originalBg || "#002b17",
          color: newDark
            ? darkCardTextColor
            : card.dataset.originalText || "#fff",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    });
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) {
      cardsRef.current[i] = el;
      // Store original colors for reverting
      if (!el.dataset.originalBg) {
        el.dataset.originalBg = items[i]?.bgColor || "";
        el.dataset.originalText = items[i]?.textColor || "";
      }
    }
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-99 top-[1.2em] md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}  block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]  `}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-2">
          {/* 1. LOGO (Sekarang jadi yang pertama di kiri pada mobile) */}
          <div className="logo-container flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-0">
            <Img
              src={logo}
              alt={logoAlt}
              className="logo h-[28px]"
              width={30}
              height={30}
            />
          </div>

          {/* 2. GROUP TOMBOL (Dark Mode + CTA) */}
          {/* Kita pakai order-2 agar dia di sebelah kiri hamburger pada mobile */}
          <div className="flex items-center gap-2 order-2 md:order-0 ml-auto md:ml-0">
            <button
              ref={toggleBtnRef}
              type="button"
              onClick={toggleDarkMode}
              className="relative w-[44px] h-[44px] flex items-center justify-center rounded-[calc(0.75rem-0.2rem)] border-0 cursor-pointer transition-colors duration-300 hover:bg-black/5"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              style={{ color: isDark ? darkMenuColor : menuColor }}
            >
              {/* Sun icon */}
              <svg
                ref={sunRef}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute"
                style={{ opacity: 1 }}
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              {/* Moon icon */}
              <svg
                ref={moonRef}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute"
                style={{ opacity: 0 }}
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                <path d="M19 3v4" />
                <path d="M21 5h-4" />
              </svg>
            </button>

            <button
              type="button"
              className="card-nav-cta-button p-2 hidden md:inline-flex border-0 rounded-[calc(0.75rem-0.2rem)] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              Get Started
            </button>
          </div>

          {/* 3. HAMBURGER (Paling kanan pada mobile) */}
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} mr-2 group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] order-3 md:order-first`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${
                isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-[60px] bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-[1] ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_auto] h-auto min-h-[60px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]">
                {item.label}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight
                      className="nav-card-link-icon shrink-0"
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
