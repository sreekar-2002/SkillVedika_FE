"use client";

import { useEffect, useState } from "react";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  BannerBox,
} from "../CorporateTraining/components/AdminUI";
import { Toaster, toast } from "react-hot-toast";

const DEFAULT_IMAGE = "/default-uploads/placeholder.png";

export default function AboutPage() {
  const [heroHeading, setHeroHeading] = useState("");
  const [heroContent, setHeroContent] = useState("");
  const [heroBanner, setHeroBanner] = useState<string>(DEFAULT_IMAGE);

  const [demoHeading, setDemoHeading] = useState("");
  const [demoContent, setDemoContent] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // extract JSON parts
  const parseTwoPart = (html: string) => {
    if (!html) return { part1: "", part2: "" };
    const match = html.match(/<span>(.*?)<\/span>/i);
    const highlight = match ? match[1] : "";
    const part1 = highlight
      ? html.replace(/<span>.*?<\/span>/i, "").trim()
      : html;
    return { part1, part2: highlight };
  };

  const buildHtmlFromParts = (obj: any) => {
    if (!obj) return "";
    return obj.part2 ? `${obj.part1}<span>${obj.part2}</span>` : obj.part1;
  };

  // LOAD DATA
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/about");
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          console.error("GET /api/about returned non-JSON response:", text);
          return;
        }
        const data = json.data || {};

        if (data.aboutus_title)
          setHeroHeading(buildHtmlFromParts(data.aboutus_title));

        setHeroContent(data.aboutus_description ?? "");
        if (data.aboutus_image) setHeroBanner(data.aboutus_image);

        if (data.demo_title)
          setDemoHeading(buildHtmlFromParts(data.demo_title));

        if (Array.isArray(data.demo_content))
          setDemoContent(data.demo_content[0] ?? "");
      } catch (err) {
        console.error("Load error:", err);
        toast.error("Network Error");
      }
    }

    load();
  }, []);

  // SAVE DATA
  const handleSubmit = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const payload = {
      aboutus_title: parseTwoPart(heroHeading),
      aboutus_description: heroContent,
      aboutus_image: heroBanner,

      demo_title: parseTwoPart(demoHeading),
      demo_content: [demoContent],
    };

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        // Server returned non-JSON (likely an HTML error page). Log it for debugging.
        console.error(
          "POST /api/about returned non-JSON response:",
          text,
          parseErr
        );
        toast.error("Save failed: server error (see console)");
        return;
      }

      if (res.ok) {
        toast.success("About Page Saved Successfully!");
      } else {
        toast.error(json.message || "Save failed");
      }
    } catch (err) {
      console.error("POST /api/about failed:", err);
      toast.error("Network Error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <Toaster />

      <h1 className="text-2xl font-bold mb-4">About Page</h1>

      {/* HERO SECTION */}
      <AdminCard title="Hero Section">
        <AdminInput
          label="Heading"
          value={heroHeading}
          onChange={setHeroHeading}
        />

        <AdminTextarea
          label="Content"
          value={heroContent}
          onChange={setHeroContent}
        />

        <BannerBox
          label="Banner Image"
          image={heroBanner}
          onUpload={(url) => setHeroBanner(url)}
        />
      </AdminCard>

      {/* DEMO SECTION */}
      <AdminCard title="Live Free Demo Section">
        <AdminInput
          label="Demo Heading"
          value={demoHeading}
          onChange={setDemoHeading}
        />

        <AdminTextarea
          label="Demo Content"
          value={demoContent}
          onChange={setDemoContent}
        />
      </AdminCard>

      {/* SUBMIT */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-800 text-white rounded-xl"
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
