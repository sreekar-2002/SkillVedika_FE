"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  FaUserFriends,
  FaDatabase,
  FaClipboardList,
  FaBlog,
  FaLayerGroup,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaTags,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { MdDashboard, MdSettings } from "react-icons/md";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  href?: string;
  subMenu?: { name: string; href: string }[];
}

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // ===== MENU DEFINITION WITH URL ROUTES =====
  const menu: MenuItem[] = [
    { name: "Dashboard", icon: <MdDashboard />, href: "/dashboard" },

    {
      name: "Course Leads",
      icon: <FaUserFriends />,
      href: "/dashboard/CourseLeads",
    },

    {
      name: "Master Data",
      icon: <FaDatabase />,
      subMenu: [
        { name: "All Skills", href: "/dashboard/masterdata/allskills" },
        { name: "All Categories", href: "/dashboard/masterdata/allcategories" },
        { name: "Popular Tags", href: "/dashboard/masterdata/populartags" },
      ],
    },

    {
      name: "All Pages",
      icon: <FaLayerGroup />,
      subMenu: [
        { name: "Home", href: "/dashboard/AllPages/Home" },
        { name: "Course Listing", href: "/dashboard/AllPages/CourseListing" },
        { name: "Blog Listing", href: "/dashboard/AllPages/BlogListing" },
        {
          name: "Corporate Training",
          href: "/dashboard/AllPages/CorporateTraining",
        },
        { name: "On Job Support", href: "/dashboard/AllPages/OnJobSupport" },
        // {
        //   name: "Become An Instructor",
        //   href: "/dashboard/AllPages/BecomeAnInstructor",
        // },
        { name: "About", href: "/dashboard/AllPages/About" },
        { name: "Contact", href: "/dashboard/AllPages/Contact" },
        {
          name: "Terms and Conditions",
          href: "/dashboard/AllPages/TermsandConditions",
        },
      ],
    },

    {
      name: "Course Management",
      icon: <GiGraduateCap />,
      subMenu: [
        {
          name: "Add New Course",
          href: "/dashboard/CourseManagement/AddNewCourse",
        },
        { name: "All Courses", href: "/dashboard/CourseManagement/AllCourses" },
        { name: "Course FAQs", href: "/dashboard/CourseManagement/CourseFAQs" },
        // {
        //   name: "Course Reviews",
        //   href: "/dashboard/CourseManagement/CourseReviews",
        // },
      ],
    },

    {
      name: "Blog Management",
      icon: <FaBlog />,
      subMenu: [
        { name: "Add New Blog", href: "/dashboard/BlogManagement/AddNewBlog" },
        { name: "All Blogs", href: "/dashboard/BlogManagement/AllBlogs" },
      ],
    },

    {
      name: "Common Section",
      icon: <FaClipboardList />,
      subMenu: [
        // { name: "Key Features", href: "/dashboard/CommonSection/KeyFeatures" },
        {
          name: "Job Assistance Program",
          href: "/dashboard/CommonSection/JobAssistanceProgram",
        },
        // {
        //   name: "For Corporate",
        //   href: "/dashboard/CommonSection/ForCorporate",
        // },
        {
          name: "Live Free Demo",
          href: "/dashboard/CommonSection/LiveFreeDemo",
        },
        // {
        //   name: "Header Settings",
        //   href: "/dashboard/CommonSection/HeaderSettings",
        // },
        // {
        //   name: "Footer Settings",
        //   href: "/dashboard/CommonSection/FooterSettings",
        // },
        // {
        //   name: "Job Program Support",
        //   href: "/dashboard/CommonSection/JobProgramSupport",
        // },
      ],
    },

    {
      name: "SEO Management",
      icon: <FaTags />,
      href: "/dashboard/SEOManagement",
    },
    {
      name: "Settings",
      icon: <MdSettings />,
      subMenu: [
        {
          name: "Header Settings",
          href: "/dashboard/CommonSection/HeaderSettings",
        },
        {
          name: "Footer Settings",
          href: "/dashboard/CommonSection/FooterSettings",
        },
      ],
    },
  ];

  // ===== AUTO OPEN THE PARENT MENU BASED ON CURRENT URL =====
  useEffect(() => {
    menu.forEach((item) => {
      if (item.subMenu) {
        const isMatch = item.subMenu.some((sub) =>
          pathname.startsWith(sub.href)
        );
        if (isMatch) setOpenMenu(item.name);
      }
    });
  }, [pathname]);

  const handleLogout = () => {
    // Send global logout event (for sidebar button too)
    document.dispatchEvent(new Event("logout"));
  };

  useEffect(() => {
    const logoutListener = () => {
      localStorage.removeItem("admin_token");
      router.push("/?logout=1");
    };

    document.addEventListener("logout", logoutListener);

    return () => {
      document.removeEventListener("logout", logoutListener);
    };
  }, []);

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 flex flex-col justify-between text-gray-900 transform transition-transform duration-300 z-40 overflow-hidden
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        background:
          "linear-gradient(180deg,#fbfdff 0%, #f1f4f8 40%, #e9eef5 100%)",
        borderRight: "1px solid rgba(16,24,40,0.06)",
        borderTopRightRadius: "18px",
        borderBottomRightRadius: "18px",
      }}
    >
      {/* LOGO */}
      <div className="flex items-center justify-center px-4 py-3">
        <Link
          href="/dashboard"
          className="w-full max-w-[220px] px-3 py-2 bg-white shadow-sm rounded-xl flex items-center justify-center"
        >
          <img
            src="/default-uploads/Skill_Vedika_Transparent_Logo.png"
            alt="Skill Vedika"
            className="h-11 object-contain"
          />
        </Link>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
        {menu.map((item) => {
          const isActive =
            item.href === pathname ||
            (item.subMenu && item.subMenu.some((s) => s.href === pathname));

          return (
            <div key={item.name}>
              {/* MAIN ITEM */}
              <div
                onClick={() =>
                  item.subMenu
                    ? setOpenMenu(openMenu === item.name ? null : item.name)
                    : null
                }
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-[#f3f4f6] shadow-sm scale-[1.01]"
                    : "hover:bg-[#f9fafb]"
                }`}
                style={{
                  border: isActive
                    ? "1px solid rgba(16,24,40,0.06)"
                    : "1px solid transparent",
                }}
              >
                <Link
                  href={item.href || "#"}
                  className="flex items-center gap-3 flex-1"
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-[#2C5CC5]" : "text-gray-700"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`font-medium ${
                      isActive ? "text-[#2C5CC5]" : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>

                {item.subMenu && (
                  <span className="text-xs text-gray-500">
                    {openMenu === item.name ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </span>
                )}
              </div>

              {/* SUBMENUS */}
              {item.subMenu && openMenu === item.name && (
                <div className="ml-8 mt-2 space-y-1 pl-3 border-l border-gray-200/60">
                  {item.subMenu.map((sub) => {
                    const isSubActive = pathname === sub.href;

                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          isSubActive
                            ? "text-[#2C5CC5] bg-[#f3f4f6] shadow-sm"
                            : "text-gray-600 hover:bg-[#f9fafb]"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-gray-200/60 p-4 bg-transparent">
        <button
          onClick={() => document.dispatchEvent(new Event("logout"))}
          className="flex items-center gap-3 text-gray-700 hover:text-[#2C5CC5] w-full px-4 py-2 rounded-lg hover:bg-white/60 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
