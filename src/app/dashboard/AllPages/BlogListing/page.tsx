"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  BannerBox,
} from "@/app/dashboard/AllPages/CorporateTraining/components/AdminUI";

export default function BlogListingPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [heroHeading, setHeroHeading] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [categoryHeading, setCategoryHeading] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  const [demoHeading, setDemoHeading] = useState("");
  const [demoSubContent, setDemoSubContent] = useState("");

  // Load saved data on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/blog-page");
        if (!res.ok) {
          console.warn("Could not fetch saved blog-page settings", res.status);
          return;
        }
        const text = await res.text();
        let response: unknown = null;
        try {
          response = JSON.parse(text);
        } catch {
          console.error("GET /api/blog-page returned non-JSON response:", text);
          return;
        }

        // Backend returns { data: {...} }, so unwrap it
        const responseObj = response && typeof response === "object" ? (response as Record<string, unknown>) : null;
        const data = responseObj?.data;
        
        if (!data || typeof data !== "object" || Object.keys(data as Record<string, unknown>).length === 0) {
          console.debug("No blog-page data from backend or empty data");
          return;
        }

        const dataObj = data as Record<string, unknown>;
        const heroTitle = dataObj.hero_title && typeof dataObj.hero_title === "object" ? (dataObj.hero_title as Record<string, unknown>) : null;
        const demoTitle = dataObj.demo_title && typeof dataObj.demo_title === "object" ? (dataObj.demo_title as Record<string, unknown>) : null;

        // Map backend fields to state
        setHeroHeading(String(heroTitle?.text ?? ""));
        setHeroDescription(String(dataObj.hero_description ?? ""));
        setCategoryHeading(String(dataObj.sidebar_name ?? ""));
        setBannerImage(String(dataObj.hero_image ?? ""));
        setDemoHeading(String(demoTitle?.text ?? ""));
        setDemoSubContent(String(dataObj.demo_subtitle ?? ""));
      } catch (err: unknown) {
        console.error("Failed to load blog-page settings:", err);
      }
    }

    load();
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);

    const payload = {
      hero_title: {
        text: heroHeading ?? "",
      },
      hero_description: heroDescription ?? "",
      sidebar_name: categoryHeading ?? "",
      hero_image: bannerImage ?? "",
      demo_title: {
        text: demoHeading ?? "",
      },
      demo_subtitle: demoSubContent ?? "",
      demo_points: [],
    };

    try {
      const res = await fetch("/api/blog-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("POST /api/blog-page/update - Response status:", res.status, "ok:", res.ok);

      const text = await res.text();
      let data: unknown = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      console.debug("POST /api/blog-page/update response status:", res.status, "body:", data ?? text);

      if (!res.ok) {
        const dataObj = data && typeof data === "object" ? (data as Record<string, unknown>) : undefined;
        const msg = dataObj && ("message" in dataObj || "error" in dataObj)
          ? String(dataObj["message"] ?? dataObj["error"])
          : text || `Status ${res.status}`;
        toast.error(String(msg));
        throw new Error(String(msg));
      }

      // success path
      toast.success("Saved successfully.");

      // re-fetch fresh data to ensure UI matches backend
      try {
        const responseText = await fetch("/api/blog-page").then(r => r.text());
        let body: unknown = null;
        try {
          body = JSON.parse(responseText);
        } catch {
          return;
        }

        // Unwrap { data: {...} } structure
        const bodyObj = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
        const freshData = bodyObj?.data;
        
        if (freshData && typeof freshData === "object" && Object.keys(freshData as Record<string, unknown>).length > 0) {
          const freshDataObj = freshData as Record<string, unknown>;
          const heroTitle = freshDataObj.hero_title && typeof freshDataObj.hero_title === "object" ? (freshDataObj.hero_title as Record<string, unknown>) : null;
          const demoTitle = freshDataObj.demo_title && typeof freshDataObj.demo_title === "object" ? (freshDataObj.demo_title as Record<string, unknown>) : null;

          setHeroHeading(String(heroTitle?.text ?? ""));
          setHeroDescription(String(freshDataObj.hero_description ?? ""));
          setCategoryHeading(String(freshDataObj.sidebar_name ?? ""));
          setBannerImage(String(freshDataObj.hero_image ?? ""));
          setDemoHeading(String(demoTitle?.text ?? ""));
          setDemoSubContent(String(freshDataObj.demo_subtitle ?? ""));
        }
      } catch (e: unknown) {
        console.debug("Failed to re-fetch after save:", e);
      }
    } catch (err: unknown) {
      let msg = "Failed to save blog page.";
      if (err instanceof Error) msg = err.message;
      else if (typeof err === "string") msg = err;
      else msg = String(err ?? msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Blog Page</h1>

      <Toaster />

      <AdminCard title="Blog Hero Section">
        <AdminInput label="Page Heading" value={heroHeading} onChange={setHeroHeading} />
        <AdminTextarea label="Page Content" value={heroDescription} onChange={setHeroDescription} />
        <BannerBox label="Banner Image" image={bannerImage} onUpload={setBannerImage} />
        <AdminInput label="Category Heading" value={categoryHeading} onChange={setCategoryHeading} />
      </AdminCard>

      <div className="h-6" />
      <AdminCard title="Live Free Demo Section">
        <AdminInput label="Demo Heading" value={demoHeading} onChange={setDemoHeading} />
        <AdminTextarea label="Demo Sub Content" value={demoSubContent} onChange={setDemoSubContent} />
      </AdminCard>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow"
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
    </section>
  );
}
