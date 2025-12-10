// "use client";

// import { useState, useRef, useEffect } from "react";
// import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// interface HeaderProps {
//   onToggleSidebar: () => void;
//   isSidebarOpen: boolean;
// }

// export default function Header({
//   onToggleSidebar,
//   isSidebarOpen,
// }: HeaderProps) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ LOGOUT HANDLER
//   const handleLogout = () => {
//     // 1. Remove token
//     localStorage.removeItem("admin_token");

//     // 2. Close menu
//     setIsMenuOpen(false);

//     // 3. Redirect first
//     router.push("/?logout=1");

//     // 4. Show toast AFTER redirect
//     setTimeout(() => {}, 500);
//   };

//   return (
//     <header
//       className={`fixed top-0 ${
//         isSidebarOpen ? "left-64" : "left-0"
//       } right-0 h-16 flex items-center justify-between px-6 shadow-lg transition-all duration-300 z-30`}
//       style={{
//         background: "#1A3F66",
//         borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
//         boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
//       }}
//     >
//       {/* LEFT SECTION */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onToggleSidebar}
//           className="text-2xl text-white cursor-pointer hover:text-gray-200 transition-transform duration-200 focus:outline-none"
//         >
//           {!isSidebarOpen ? (
//             <FaTimes className="transition-transform duration-200 rotate-90" />
//           ) : (
//             <FaBars className="transition-transform duration-200 rotate-0" />
//           )}
//         </button>

//         <h1 className="text-xl font-semibold text-white tracking-wide">
//           SkillVedika
//         </h1>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="relative" ref={menuRef}>
//         <img
//           src="/default-uploads/avatar.jpg"
//           alt="Admin Avatar"
//           className="w-10 h-10 rounded-full border-2 border-white/40 object-cover cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         />

//         {/* DROPDOWN MENU */}
//         {isMenuOpen && (
//           <div
//             className="absolute right-0 mt-3 w-48 rounded-xl border border-gray-200 shadow-xl py-2 bg-white text-gray-800 transition-all duration-200"
//             style={{ boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)" }}
//           >
//             {/* SETTINGS */}
//             <button
//               onClick={() => {
//                 setIsMenuOpen(false);
//                 router.push("/dashboard/Settings");
//               }}
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition rounded-md"
//             >
//               <FaCog className="mr-2 text-[#1A3F66]" /> Profile
//             </button>

//             <div className="my-1 border-t border-gray-100"></div>

//             {/* LOGOUT */}
//             <button
//               onClick={handleLogout}
//               className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-[#fef2f2] transition rounded-md"
//             >
//               <FaSignOutAlt className="mr-2 text-red-500" /> Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

  /* =====================================================
     LOGOUT HANDLER
  ===================================================== */
  const handleLogout = () => {
    localStorage.removeItem("admin_token"); // delete token
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
          src="/default-uploads/avatar.jpg"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full border-2 border-white/40 cursor-pointer hover:scale-105 transition"
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
                router.push("/dashboard/Settings");
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
