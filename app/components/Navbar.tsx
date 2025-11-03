"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSignInAlt,
  FaTimes,
  FaHeart,
  FaUser,
  FaChevronDown,
  FaGlobe,
  FaBars,
  FaTachometerAlt, // Added for dashboard icon
} from "react-icons/fa";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

/* ────────────────────── Types ────────────────────── */
interface NavLink {
  id: string;
  label: string;
  href: string;
  subMenu?: NavLink[];
}
interface HoveredLink {
  width: number;
  left: number;
}
interface DesktopNavLinkProps extends NavLink {
  setHoveredLink: (v: HoveredLink | null) => void;
}
interface MobileNavLinkProps extends NavLink {
  closeMenu: () => void;
}

/* ────────────────────── Bilingual Data ────────────────────── */
const navLinksData = {
  mn: [
    { id: "home", label: "Нүүр", href: "/" },
    {
      id: "about",
      label: "Бидний тухай",
      href: "/about",
      subMenu: [
        { id: "intro", label: "Удирдлага", href: "/introduction" },
        { id: "greet", label: "Мэндчилгээ", href: "/greetings" },
        { id: "prog", label: "Хөтөлбөр", href: "/program" },
      ],
    },
    { id: "volunteer", label: "Сайн дурын", href: "/volunteers" },
    { id: "news", label: "Мэдээ", href: "/news" },
    { id: "events", label: "Эвэнт", href: "/events" },
    { id: "members", label: "Гишүүд", href: "/members" },
    {
      id: "lessons",
      label: "Хичээл",
      href: "/lessons",
      subMenu: [
        { id: "online", label: "Цахим хичээл", href: "/online-lessons" },
        { id: "podcast", label: "Подкаст", href: "/podcasts" },
        { id: "video", label: "Видео", href: "/videos" },
      ],
    },
    { id: "donation", label: "Хандив", href: "/donation" },
  ],
  en: [
    { id: "home", label: "Home", href: "/" },
    {
      id: "about",
      label: "About Us",
      href: "/about",
      subMenu: [
        { id: "intro", label: "Introduction", href: "/introduction" },
        { id: "greet", label: "Greetings", href: "/greetings" },
        { id: "prog", label: "Programs", href: "/program" },
      ],
    },
    { id: "volunteer", label: "Volunteer", href: "/volunteers" },
    { id: "news", label: "News", href: "/news" },
    { id: "events", label: "Events", href: "/events" },
    { id: "members", label: "Members", href: "/members" },
    {
      id: "lessons",
      label: "Lessons",
      href: "/lessons",
      subMenu: [
        { id: "online", label: "Online Lessons", href: "/online-lessons" },
        { id: "podcast", label: "Podcasts", href: "/podcasts" },
        { id: "video", label: "Videos", href: "/videos" },
      ],
    },
    { id: "donation", label: "Donate", href: "/donation" },
  ],
};

const topBarData = {
  mn: {
    slogan: "Монголын сайн дурынхны төв",
    login: "Нэвтрэх",
    register: "Бүртгүүлэх",
    donate: "Хандив өгөх",
    dashboard: "Хяналтын самбар", // Added for dashboard
  },
  en: {
    slogan: "Mongolian Volunteer Center",
    login: "Login",
    register: "Register",
    donate: "Donate Now",
    dashboard: "Dashboard", // Added for dashboard
  },
};

/* ────────────────────── Main Navbar ────────────────────── */
const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<HoveredLink | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150) setHidden(true);
    else setHidden(false);
  });

  const backgroundOpacity = useTransform(scrollY, [0, 150], [0.8, 0.98]);
  const navLinks = t(navLinksData);
  const topBar = t(topBarData);

  const toggleLanguage = () => {
    setLanguage(language === "mn" ? "en" : "mn");
  };

  return (
    <>
      {/* ──────── Top Bar ──────── */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white shadow-2xl rounded-b-3xl"
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 md:px-8 py-3 text-sm">
          <motion.p
            className="font-bold flex items-center gap-2 text-base"
            whileHover={{ scale: 1.05 }}
          >
            <FaHeart className="text-cyan-200 animate-pulse" />
            {topBar.slogan}
          </motion.p>
          <ul className="flex items-center gap-4 md:gap-5">
            {/* Language Switcher */}
            <li>
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-medium transition-all"
              >
                <FaGlobe className="text-xs" />
                <span className="uppercase">{language}</span>
              </motion.button>
            </li>

            {/* Social Icons */}
            <li className="flex items-center gap-3">
              <motion.a
                href="https://www.facebook.com/VolunteercenterofMongolia"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 8, y: -2 }}
                className="text-cyan-200 hover:text-white transition-all duration-300"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a
                href="https://twitter.com/volunteermn"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -8, y: -2 }}
                className="text-cyan-200 hover:text-white transition-all duration-300"
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="https://instagram.com/volunteermongolia"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 8, y: -2 }}
                className="text-cyan-200 hover:text-white transition-all duration-300"
              >
                <FaInstagram />
              </motion.a>
            </li>

            <li className="text-white/50 hidden md:block">|</li>

            {/* Auth Links */}
            <SignedOut>
              <li className="hidden md:block">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-medium transition-all"
                >
                  <FaSignInAlt className="text-xs" />
                  <span>{topBar.login}</span>
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/sign-up"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <FaUser className="text-xs" />
                  <span>{topBar.register}</span>
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
              <li className="hidden md:block">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-medium transition-all"
                >
                  <FaTachometerAlt className="text-xs" />
                  <span>{topBar.dashboard}</span>
                </Link>
              </li>
              <li className="hidden md:block">
                <UserButton afterSignOutUrl="/" />
              </li>
            </SignedIn>
          </ul>
        </div>
      </motion.div>

      {/* ──────── Main Glass Navbar ──────── */}
      <motion.header
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-x-0 top-20 z-40 flex justify-center pointer-events-none"
      >
        {/* ── WIDE CONTAINER ── */}
        <nav
          ref={navRef}
          className="relative flex items-center justify-between w-full max-w-screen-2xl mx-auto px-6 md:px-8 py-4 bg-white/90 backdrop-blur-3xl rounded-full shadow-2xl border border-white/50 pointer-events-auto"
          style={{ background: `rgba(255, 255, 255, ${backgroundOpacity})` }}
        >
          {/* Enhanced Active Indicator */}
          <motion.div
            className="absolute -bottom-1 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full shadow-lg"
            style={{
              width: hoveredLink?.width || 0,
              left: hoveredLink?.left || 0,
              opacity: hoveredLink ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative"
              >
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-full shadow-lg border-2 border-blue-200"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 animate-pulse"></div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation – Enhanced Spacing */}
          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <DesktopNavLink
                key={link.id}
                {...link}
                setHoveredLink={setHoveredLink}
                navRef={navRef as React.RefObject<HTMLDivElement>}
              />
            ))}
          </div>

          {/* Desktop CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/donation"
              className="relative inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Enhanced Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-150%", "150%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <FaHeart className="relative z-10 text-sm animate-pulse" />
              <span className="relative z-10">{topBar.donate}</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(true)}
            className="xl:hidden p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-md border border-white/30 text-blue-600 shadow-md hover:shadow-lg transition-all"
          >
            <AnimatedHamburgerIcon isOpen={mobileOpen} />
          </motion.button>
        </nav>
      </motion.header>

      <MobileMenu
        isOpen={mobileOpen}
        closeMenu={() => setMobileOpen(false)}
        language={language}
        topBar={topBar}
        navLinks={navLinks}
      />
    </>
  );
};

/* ────────────────────── Desktop Nav Link ────────────────────── */
const DesktopNavLink: React.FC<
  DesktopNavLinkProps & { navRef: React.RefObject<HTMLDivElement> }
> = ({ label, href, subMenu, setHoveredLink, navRef }) => {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!linkRef.current || !navRef.current) return;
    const { offsetLeft, offsetWidth } = linkRef.current;
    setHoveredLink({ left: offsetLeft, width: offsetWidth });
    subMenu && setOpen(true);
  };

  const handleMouseLeave = () => {
    setHoveredLink(null);
    setOpen(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      <Link
        ref={linkRef}
        href={href}
        className="flex items-center gap-1.5 px-4 py-2.5 text-base font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-full group-hover:bg-blue-50/70 whitespace-nowrap"
      >
        {label}
        {subMenu && (
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-1 text-cyan-500"
          >
            <FaChevronDown className="text-sm" />
          </motion.div>
        )}
      </Link>

      <AnimatePresence>
        {open && subMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 15, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white/98 backdrop-blur-3xl rounded-2xl p-6 shadow-2xl border border-white/60"
          >
            <div className="space-y-2">
              {subMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-xl transition-all duration-300 group"
                >
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:scale-125 transition-transform"
                    whileHover={{ scale: 1.5 }}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────── Mobile Menu ────────────────────── */
const MobileMenu: React.FC<{
  isOpen: boolean;
  closeMenu: () => void;
  language: "mn" | "en";
  topBar: any;
  navLinks: NavLink[];
}> = ({ isOpen, closeMenu, language, topBar, navLinks }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999]"
            onClick={closeMenu}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-gradient-to-b from-white via-blue-50/80 to-cyan-50/60 shadow-2xl z-[1000] p-8 flex flex-col overflow-y-auto"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeMenu}
              className="absolute top-8 right-8 p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg"
            >
              <FaTimes size={20} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24 mb-12 text-center"
            >
              <Link href="/" className="inline-flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={64}
                    height={64}
                    className="rounded-full shadow-lg border-2 border-blue"
                />
                <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {language === "mn" ? "МСДТ" : "VCM"}
                </span>
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile Auth Section */}
            <div className="mb-8 text-center space-y-4">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="block px-6 py-3 rounded-full bg-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
                  onClick={closeMenu}
                >
                  {topBar.login}
                </Link>
                <Link
                  href="/sign-up"
                  className="block px-6 py-3 rounded-full bg-cyan-500 text-white font-bold shadow-md hover:shadow-lg transition-all"
                  onClick={closeMenu}
                >
                  {topBar.register}
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block px-6 py-3 rounded-full bg-indigo-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
                  onClick={closeMenu}
                >
                  {topBar.dashboard}
                </Link>
                <div className="flex justify-center pt-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

            <nav className="flex-1 space-y-3 mb-12">
              {navLinks.map((link, i) => (
                <MobileNavLink
                  key={link.id}
                  {...link}
                  closeMenu={closeMenu}
                  delay={i * 0.07}
                />
              ))}
            </nav>

            {/* Mobile CTA and Socials */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="space-y-6">
              <Link
                href="/donation"
                className="block text-center px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {topBar.donate}
              </Link>
              <div className="flex justify-center gap-10">
                <motion.a
                  href="https://www.facebook.com/VolunteercenterofMongolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.3, rotate: 10, y: -2 }}
                  className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-md"
                >
                  <FaFacebookF size={20} />
                </motion.a>
                <motion.a
                  href="https://twitter.com/volunteermn"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.3, rotate: -10, y: -2 }}
                  className="p-3 rounded-full bg-cyan-100 hover:bg-cyan-200 text-cyan-600 shadow-md"
                >
                  <FaTwitter size={20} />
                </motion.a>
                <motion.a
                  href="https://instagram.com/volunteermongolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.3, rotate: 10, y: -2 }}
                  className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 shadow-md"
                >
                  <FaInstagram size={20} />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ────────────────────── Mobile Nav Link ────────────────────── */
const MobileNavLink: React.FC<
  MobileNavLinkProps & { delay: number }
> = ({ label, href, subMenu, closeMenu, delay }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div
        onClick={() => (subMenu ? setOpen(!open) : closeMenu())}
        className="flex justify-between items-center py-4 px-2 cursor-pointer group rounded-xl hover:bg-blue-50/60 transition-all"
      >
        <Link
          href={!subMenu ? href : "#"}
          onClick={(e) => subMenu && e.preventDefault()}
          className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors"
        >
          {label}
        </Link>
        {subMenu && (
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            className="text-cyan-500"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {open && subMenu && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-8 space-y-2 mt-2 overflow-hidden bg-blue-50/40 rounded-xl p-3"
          >
            {subMenu.map((it, i) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={it.href}
                  onClick={closeMenu}
                  className="block py-2.5 px-4 text-gray-600 hover:text-blue-600 hover:bg-white/60 rounded-lg transition-all flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  {it.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ────────────────────── Hamburger Icon ────────────────────── */
const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className="stroke-current">
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M 3 6.5 L 20.5 6.5" },
        open: { d: "M 6 18.5 L 18.5 6.5" },
      }}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
    />
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 3 12 L 20.5 12"
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 },
      }}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.2 }}
    />
    <motion.path
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        closed: { d: "M 3 17.5 L 20.5 17.5" },
        open: { d: "M 6 6.5 L 18.5 18.5" },
      }}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
    />
  </svg>
);

export default Navbar;