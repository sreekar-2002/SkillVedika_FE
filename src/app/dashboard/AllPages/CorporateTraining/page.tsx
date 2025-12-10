// "use client";

// import { useState } from "react";
// import HeroSection from "./components/HeroSection";
// import EmpowerSection from "./components/EmpowerSection";
// import PortfolioSection from "./components/PortfolioSection";
// import AdvantageSection from "./components/AdvantageSection";
// import TalentSection from "./components/TalentSection";
// import navigate from "next/navigation";
// import {
//   AdminCard,
//   AdminInput,
//   AdminTextarea,
//   BannerBox,
// } from "@/app/dashboard/AllPages/CorporateTraining/components/AdminUI";

// export default function Page() {
//   const [pageHeading, setPageHeading] = useState(
//     "Explore Our Latest <span>Blogs!</span>"
//   );

//   const [pageContent, setPageContent] = useState(
//     "Empowering learning through smart technology. Discover how innovative solutions are shaping the future of education."
//   );

//   return (
//     <main className=" mx-auto p-6">
//       <div
//         className="bg-white rounded-2xl shadow-md p-6 space-y-8 border border-gray-100"
//         style={{
//           boxShadow: "0 4px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.05)",
//         }}
//       >
//         <h1 className="text-3xl font-semibold mb-8">Corporate Training</h1>
//         <HeroSection />
//         <EmpowerSection />
//         <PortfolioSection />
//         <AdvantageSection />
//         <TalentSection />

//         <div className="space-y-10 mt-10">
//           {/* Live Demo Free SECTION */}
//           <AdminCard title="Live Free Demo Section">
//             {/* Page Heading */}
//             <AdminInput
//               label="Demo Section Heading*"
//               value={pageHeading}
//               onChange={setPageHeading}
//             />

//             <AdminTextarea
//               label="Demo Content*"
//               value={pageContent}
//               onChange={setPageContent}
//             />
//           </AdminCard>
//         </div>

//         <div className="flex justify-end pt-4">
//           <button className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm">
//             Submit
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import HeroSection from "./components/HeroSection";
import EmpowerSection from "./components/EmpowerSection";
import PortfolioSection from "./components/PortfolioSection";
import AdvantageSection from "./components/AdvantageSection";
import TalentSection from "./components/TalentSection";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
} from "@/app/dashboard/AllPages/CorporateTraining/components/AdminUI";

export default function Page() {
  const [isSaving, setIsSaving] = useState(false);

  const [hero, setHero] = useState<any>({});
  const [empower, setEmpower] = useState<any>({});
  const [portfolio, setPortfolio] = useState<any>({});
  const [advantage, setAdvantage] = useState<any>({});
  const [talent, setTalent] = useState<any>({});

  const [pageHeading, setPageHeading] = useState("");
  const [pageContent, setPageContent] = useState("");

  // stable merging updater for child sections to avoid accidental replacement
  const updateTalent = useCallback((partial: any) => {
    setTalent((prev: any) => ({ ...prev, ...partial }));
  }, []);

  /* --------------------------------------------------
      Helpers to Build JSON expected by Laravel Migration
  -------------------------------------------------- */

  // NOTE: treat hero title as plain text. Previously we parsed <span> markup which
  // caused user-typed '<span>' to be interpreted as HTML and stripped on save.
  // To preserve exactly what the user types, we no longer parse markup here.
  const parseHeroTitle = (html: any) => {
    return { part1: (html ?? "").toString().trim(), highlight: "" };
  };

  // Keep empower title as plain text as well to avoid treating user input as markup
  const splitEmpowerTitle = (html: any) => {
    return { part1: (html ?? "").toString().trim(), part2: "" };
  };

  

  const buildPayload = () => {
    return {
      hero_title: parseHeroTitle(hero.title || ""),
      hero_subheading: hero.description || "",
      hero_button_text: hero.buttonName || "",
      hero_button_link: hero.buttonLink || "",
      hero_image: hero.banner || "",

      empower_title: splitEmpowerTitle(empower.title || ""),
      empower_description: empower.content || "",
      empower_image: empower.banner || "",

      portfolio_title: { text: (typeof portfolio.title === 'string' ? portfolio.title : portfolio.title?.text || "") || "" },
      portfolio_subtitle: portfolio.description || "",
      portfolio_items: Array.isArray(portfolio.items) ? portfolio.items : [],

      advantages_title: { title: advantage.title || "" },
      advantages_subtitle: advantage.desc || "",
      advantages_left_items: Array.isArray(advantage.sections) ? advantage.sections.slice(0, 4) : [],
      advantages_right_items: Array.isArray(advantage.sections) ? advantage.sections.slice(4, 8) : [],

      hr_guide_title: { title: talent.title || "" },
      hr_guide_subtitle: talent.desc || "",
      hr_guide_steps: Array.isArray(talent.points) ? talent.points : [],

      demo_title: { title: pageHeading || "" },
      demo_points: pageContent ? [pageContent] : [],
    };
  };

  /* --------------------------------------------------
                Submit Handler (FINAL)
  -------------------------------------------------- */
  const handleSubmit = async () => {
    setIsSaving(true);
    const payload = buildPayload();

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;
      if (storedToken) headers["Authorization"] = `Bearer ${storedToken}`;

      const res = await fetch("/api/corporate-training", {
        method: "POST",
        credentials: "same-origin",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Saved Successfully!");
        // update local state from returned record if available
        if (data.data) {
          const record = data.data;
          // hydrate hero
          setHero({
            // Keep title as plain text (do not inject <span> markup)
            title: record.hero_title
              ? (record.hero_title["part1"] || "") + (record.hero_title["highlight"] ? " " + record.hero_title["highlight"] : "")
              : "",
            description: record.hero_subheading || "",
            buttonName: record.hero_button_text || "",
            buttonLink: record.hero_button_link || "",
            banner: record.hero_image || "",
          });

          setEmpower({
            // Keep empower title as plain text
            title: record.empower_title
              ? (record.empower_title["part1"] || "") + (record.empower_title["part2"] ? " " + record.empower_title["part2"] : "")
              : "",
            content: record.empower_description || "",
            banner: record.empower_image || "",
          });

          setPortfolio({
            title: (typeof record.portfolio_title === 'string' ? record.portfolio_title : record.portfolio_title?.text) || "",
            description: record.portfolio_subtitle || "",
            items: record.portfolio_items || [],
          });

          setAdvantage({
            title: record.advantages_title?.title || "",
            desc: record.advantages_subtitle || "",
            sections: [
              ...(record.advantages_left_items || []),
              ...(record.advantages_right_items || []),
            ],
          });

          setTalent({
            title: record.hr_guide_title?.title || "",
            desc: record.hr_guide_subtitle || "",
            points: record.hr_guide_steps || [],
          });

          setPageHeading(record.demo_title?.title || "");
          setPageContent((record.demo_points && record.demo_points[0]) || "");
        }
      } else {
        toast.error("Error: " + (data.message || "Failed to save"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Request failed!");
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch existing corporate training data on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const headers: Record<string, string> = { Accept: "application/json" };
        const storedToken =
          typeof window !== "undefined"
            ? localStorage.getItem("admin_token")
            : null;
        if (storedToken) headers["Authorization"] = `Bearer ${storedToken}`;

        const res = await fetch("/api/corporate-training", {
          credentials: "same-origin",
          headers,
        });
        if (!res.ok) {
          console.error(
            "GET corporate-training failed:",
            res.status,
            res.statusText
          );
          return;
        }
        const json = await res.json();
        const record = json.data;
        if (!record || !mounted) return;

        setHero({
          title: record.hero_title
            ? (record.hero_title["part1"] || "") + (record.hero_title["highlight"] ? " " + record.hero_title["highlight"] : "")
            : "",
          description: record.hero_subheading || "",
          buttonName: record.hero_button_text || "",
          buttonLink: record.hero_button_link || "",
          banner: record.hero_image || "",
        });

        setEmpower({
          title: record.empower_title
            ? (record.empower_title["part1"] || "") + (record.empower_title["part2"] ? " " + record.empower_title["part2"] : "")
            : "",
          content: record.empower_description || "",
          banner: record.empower_image || "",
        });

        setPortfolio({
          title: (typeof record.portfolio_title === 'string' ? record.portfolio_title : record.portfolio_title?.text) || "",
          description: record.portfolio_subtitle || "",
          items: record.portfolio_items || [],
        });

        setAdvantage({
          title: record.advantages_title?.title || "",
          desc: record.advantages_subtitle || "",
          sections: [
            ...(record.advantages_left_items || []),
            ...(record.advantages_right_items || []),
          ],
        });

        setTalent({
          title: record.hr_guide_title?.title || "",
          desc: record.hr_guide_subtitle || "",
          points: record.hr_guide_steps || [],
        });

  setPageHeading(record.demo_title?.title || "");
        setPageContent((record.demo_points && record.demo_points[0]) || "");
      } catch (e) {
        console.error("Failed to load corporate training data", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-8 border border-gray-100">
        <h1 className="text-3xl font-semibold mb-8">Corporate Training</h1>

        <Toaster />

        <HeroSection initial={hero} onChange={setHero} />
        <EmpowerSection initial={empower} onChange={setEmpower} />
        <PortfolioSection initial={portfolio} onChange={setPortfolio} />
        <AdvantageSection initial={advantage} onChange={setAdvantage} />
  {/* pass a merging updater so children don't accidentally replace other fields */}
  <TalentSection initial={talent} onChange={updateTalent} />

        {/* DEMO SECTION */}
        <AdminCard title="Live Free Demo Section">
          <AdminInput
            label="Demo Section Heading*"
            value={pageHeading}
            onChange={setPageHeading}
          />
          <AdminTextarea
            label="Demo Content*"
            value={pageContent}
            onChange={setPageContent}
          />
        </AdminCard>

        <div className="flex justify-end pt-4">
          <button
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}



