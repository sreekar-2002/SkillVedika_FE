"use client";

import { useState, useRef, useEffect } from "react";
// Use native <img> for avatar so changes to the src (including cache-busting)
// are reflected immediately without Next/Image optimization/caching surprises.
// If you prefer Next/Image in production, we can switch back and append a
// cache-busting query param when the avatar changes.
// import Image from "next/image";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "../../../utils/axios";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Start with a deterministic default so server and client markup match.
  // Later we replace it with the value from localStorage on mount.
  const [avatar, setAvatar] = useState<string>("/default-uploads/avatar.jpg");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load avatar from localStorage and listen for profile updates (custom
  // event and storage events so changes reflect across tabs/windows).
  // It's safe to set state here once on mount (hydration) — disable the
  // lint rule that warns about synchronous setState in effects for this case.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    // hydrate from localStorage on mount
    try {
      const stored = localStorage.getItem("admin_avatar");
      if (stored) setTimeout(() => setAvatar(stored), 0);
    } catch {}

    // handler for custom event dispatched by Profile page
    const onProfileUpdated = (e: Event) => {
      try {
        const detail = (e as CustomEvent<{ avatar?: string }>).detail;
        const newAvatar = detail?.avatar || localStorage.getItem("admin_avatar") || "/default-uploads/avatar.jpg";
        // add cache-busting query so browser reloads new image immediately
        const cacheBusted = newAvatar ? `${newAvatar}${newAvatar.includes('?') ? '&' : '?'}v=${Date.now()}` : newAvatar;
        setAvatar(cacheBusted);
      } catch {
        // ignore
      }
    };

    // handler for storage events (other tabs/windows)
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "admin_avatar") {
        const newAvatar = ev.newValue || "/default-uploads/avatar.jpg";
        const cacheBusted = newAvatar ? `${newAvatar}${newAvatar.includes('?') ? '&' : '?'}v=${Date.now()}` : newAvatar;
        setAvatar(cacheBusted);
      }
    };

    window.addEventListener("admin:profileUpdated", onProfileUpdated as EventListener);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("admin:profileUpdated", onProfileUpdated as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  /* =====================================================
     LOGOUT HANDLER
  ===================================================== */
  const handleLogout = () => {
    try {
      // attempt to logout on server (invalidate session)
      axios.post("/admin/logout").catch(() => {
        /* ignore network errors */
      });
    } catch {
      /* ignore */
    }

    // clear local debug tokens and avatar
    localStorage.removeItem("admin_token"); // delete token
    localStorage.removeItem("admin_avatar");
    setIsMenuOpen(false);

    // redirect to login with logout toast
    router.push("/?logout=1");
  };

  return (
    <header
      className={`fixed top-0 ${
        isSidebarOpen ? "left-64" : "left-0"
      } right-0 h-16 flex items-center justify-between px-6 shadow-lg transition-all duration-300 z-30`}
      style={{
        background: "#1A3F66",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-2xl text-white cursor-pointer hover:text-gray-200"
        >
          {!isSidebarOpen ? (
            <FaTimes className="rotate-90 transition" />
          ) : (
            <FaBars className="transition" />
          )}
        </button>

        <h1 className="text-xl font-semibold text-white">SkillVedika</h1>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={menuRef}>
        <img
          src={avatar || "/default-uploads/avatar.jpg"}
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full border-2 border-white/40 cursor-pointer hover:scale-105 transition object-cover"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* DROPDOWN MENU */}
        {isMenuOpen && (
          <div
            className="absolute right-0 mt-3 w-48 rounded-xl shadow-xl py-2 bg-white border border-gray-200"
            style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}
          >
            <button
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/dashboard/Profile");
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaCog className="mr-2 text-[#1A3F66]" /> Profile
            </button>

            <div className="my-1 border-t border-gray-100"></div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt className="mr-2 text-red-500" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
