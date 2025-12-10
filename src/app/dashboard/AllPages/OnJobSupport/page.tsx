"use client";

import React, { useEffect, useState } from "react";
import TipTapEditor from "../CorporateTraining/components/TipTapEditor";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  BannerBox,
} from "../CorporateTraining/components/AdminUI";
import toast, { Toaster } from "react-hot-toast";

/**
 * Small note:
 * - You requested T1: all rich-text fields will be empty ("") by default.
 * - Images keep a DEFAULT_IMAGE preview so UI doesn't look broken; text fields are empty.
 */
const DEFAULT_IMAGE = "/mnt/data/ec989779-babf-41a3-9255-650182657d0c.png";

type Point = {
  id: string;
  label: string;
  description: string;
  iconPreview?: string | null;
  iconFile?: File | null;
};

type Proc = {
  id: string;
  label: string;
  description: string;
};

export default function OnJobSupportPage() {
  // HERO (text fields default to empty strings — T1)
  const [pageTitle, setPageTitle] = useState<string>(""); // T1
  const [pageDescription, setPageDescription] = useState<string>(""); // T1
  const [buttonName, setButtonName] = useState<string>("");
  const [buttonLink, setButtonLink] = useState<string>("");

  // images (keep preview default image so UI has a thumbnail)
  const [heroBannerPreview, setHeroBannerPreview] = useState<string | null>(
    DEFAULT_IMAGE
  );
  const [heroBannerFile, setHeroBannerFile] = useState<File | null>(null);

  // EXPERTS
  const [expertsTitle, setExpertsTitle] = useState<string>(""); // T1
  const [expertsSubTitle, setExpertsSubTitle] = useState<string>(""); // T1
  const [expertsDescription, setExpertsDescription] = useState<string>(""); // T1

  const [expertsTitle1, setExpertsTitle1] = useState<string>("");
  const [expertsContent1, setExpertsContent1] = useState<string>("");

  const [expertsTitle2, setExpertsTitle2] = useState<string>("");
  const [expertsContent2, setExpertsContent2] = useState<string>("");

  const [expertsBannerPreview, setExpertsBannerPreview] = useState<
    string | null
  >(DEFAULT_IMAGE);
  const [expertsBannerFile, setExpertsBannerFile] = useState<File | null>(null);

  // WHO
  const [whoTitleTarget, setWhoTitleTarget] = useState<string>("");
  const [whoTitle, setWhoTitle] = useState<string>(""); // T1
  const [whoContent, setWhoContent] = useState<string>(""); // T1

  const [whoCardTitleTarget1, setWhoCardTitleTarget1] = useState<string>("");
  const [whoCardTitle1, setWhoCardTitle1] = useState<string>("");
  const [whoCardTitleContent1, setWhoCardTitleContent1] = useState<string>("");

  const [whoCardTitleTarget2, setWhoCardTitleTarget2] = useState<string>("");
  const [whoCardTitle2, setWhoCardTitle2] = useState<string>("");
  const [whoCardTitleContent2, setWhoCardTitleContent2] = useState<string>("");

  const [whoCardTitleTarget3, setWhoCardTitleTarget3] = useState<string>("");
  const [whoCardTitle3, setWhoCardTitle3] = useState<string>("");
  const [whoCardTitleContent3, setWhoCardTitleContent3] = useState<string>("");

  const [whoCardTitleTarget4, setWhoCardTitleTarget4] = useState<string>("");
  const [whoCardTitle4, setWhoCardTitle4] = useState<string>("");
  const [whoCardTitleContent4, setWhoCardTitleContent4] = useState<string>("");

  // HOW WE HELP
  const [howCardTitle, setHowCardTitle] = useState<string>("");
  const [howTitleContent, setHowTitleContent] = useState<string>("");

  const [points, setPoints] = useState<Point[]>(() => [
    { id: "p1", label: "", description: "", iconPreview: null, iconFile: null },
    { id: "p2", label: "", description: "", iconPreview: null, iconFile: null },
    { id: "p3", label: "", description: "", iconPreview: null, iconFile: null },
    { id: "p4", label: "", description: "", iconPreview: null, iconFile: null },
    { id: "p5", label: "", description: "", iconPreview: null, iconFile: null },
  ]);
  const [howFooterTitle, setHowFooterTitle] = useState<string>("");

  // PROCESS
  const [processTitle, setProcessTitle] = useState<string>("");
  const [OurProcessTitleContent, setOurProcessTitleContent] =
    useState<string>("");
  const [processes, setProcesses] = useState<Proc[]>(() => [
    { id: "proc1", label: "", description: "" },
    { id: "proc2", label: "", description: "" },
    { id: "proc3", label: "", description: "" },
    { id: "proc4", label: "", description: "" },
  ]);

  // WHY & READY
  const [whyTitle, setWhyTitle] = useState<string>("");
  const [whyContent, setWhyContent] = useState<string>(""); // T1
  const [whyBannerPreview, setWhyBannerPreview] = useState<string | null>(
    DEFAULT_IMAGE
  );

  const [readyTitle, setReadyTitle] = useState<string>("");
  const [readyButtonText, setReadyButtonText] = useState<string>("");
  const [readyDescription, setReadyDescription] = useState<string>("");
  const [readyBannerPreview, setReadyBannerPreview] = useState<string | null>(
    DEFAULT_IMAGE
  );
  // const [readyBannerFile, setReadyBannerFile] = useState<File | null>(null);

  // DEMO
  const [pageHeading, setPageHeading] = useState<string>("");
  const [pageContent, setPageContent] = useState<string>("");

  const [demoPoint1, setDemoPoint1] = useState<string>("");
  const [demoContent1, setDemoContent1] = useState<string>("");

  const [demoPoint2, setDemoPoint2] = useState<string>("");
  const [demoContent2, setDemoContent2] = useState<string>("");

  const [demoPoint3, setDemoPoint3] = useState<string>("");
  const [demoContent3, setDemoContent3] = useState<string>("");

  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Helpers
  const parseTwoPart = (htmlString: string) => {
    // if htmlString is already object (part1, part2) — return as-is
    if (!htmlString) return { part1: "", part2: "" };
    if (typeof htmlString === "object") {
      return { part1: htmlString.part1 ?? "", part2: htmlString.part2 ?? "" };
    }
    const highlightMatch = (htmlString || "").match(/<span>(.*?)<\/span>/i);
    const highlight = highlightMatch ? highlightMatch[1] : "";
    const part1 = highlight
      ? htmlString.replace(/<span>.*?<\/span>/i, "").trim()
      : htmlString;
    return { part1: part1 || "", part2: highlight || "" };
  };

  const buildHtmlFromParts = (parts: any) => {
    if (!parts) return "";
    // parts might be object like {part1, part2} or array-like; be defensive
    const part1 = parts.part1 ?? parts[0] ?? "";
    const part2 = parts.part2 ?? parts[1] ?? "";
    return part2 ? `${part1}<span>${part2}</span>` : `${part1}`;
  };

  // load saved data on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/on-job-support");
        if (!res.ok) {
          console.warn(
            "Could not fetch saved on-job-support content",
            res.status
          );
          return;
        }
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch (err) {
          console.error("GET /api/on-job-support returned non-JSON response:", text);
          return;
        }
        const data = json.data || {};

        // HERO
        if (data.hero_title)
          setPageTitle(buildHtmlFromParts(data.hero_title) || "");
        setPageDescription(data.hero_description ?? "");
        setButtonName(data.hero_button_text ?? "");
        setButtonLink(data.hero_button_link ?? "");
        if (data.hero_image)
          setHeroBannerPreview(data.hero_image || DEFAULT_IMAGE);

        // REALTIME / EXPERTS
        if (data.realtime_title)
          setExpertsTitle(buildHtmlFromParts(data.realtime_title) || "");
        setExpertsSubTitle(data.realtime_subheading ?? "");
        setExpertsDescription(data.realtime_description ?? "");
        setExpertsTitle1(data.realtime_subsection_title1 ?? "");
        setExpertsContent1(data.subsection_title1_description ?? "");
        setExpertsTitle2(data.realtime_subsection_title2 ?? "");
        setExpertsContent2(data.subsection_title2_description ?? "");
        if (data.realtime_image)
          setExpertsBannerPreview(data.realtime_image || DEFAULT_IMAGE);

        // WHO
        setWhoTitleTarget(data.who_target ?? "");
        if (data.who_title)
          setWhoTitle(buildHtmlFromParts(data.who_title) || "");
        setWhoContent(data.who_subtitle ?? "");
        if (Array.isArray(data.who_cards)) {
          const cards = data.who_cards;
          if (cards[0]) {
            setWhoCardTitleTarget1(
              cards[0].target ?? cards[0].title_target ?? ""
            );
            setWhoCardTitle1(cards[0].title ?? "");
            setWhoCardTitleContent1(
              cards[0].content ?? cards[0].description ?? ""
            );
          }
          if (cards[1]) {
            setWhoCardTitleTarget2(
              cards[1].target ?? cards[1].title_target ?? ""
            );
            setWhoCardTitle2(cards[1].title ?? "");
            setWhoCardTitleContent2(
              cards[1].content ?? cards[1].description ?? ""
            );
          }
          if (cards[2]) {
            setWhoCardTitleTarget3(
              cards[2].target ?? cards[2].title_target ?? ""
            );
            setWhoCardTitle3(cards[2].title ?? "");
            setWhoCardTitleContent3(
              cards[2].content ?? cards[2].description ?? ""
            );
          }
          if (cards[3]) {
            setWhoCardTitleTarget4(
              cards[3].target ?? cards[3].title_target ?? ""
            );
            setWhoCardTitle4(cards[3].title ?? "");
            setWhoCardTitleContent4(
              cards[3].content ?? cards[3].description ?? ""
            );
          }
        }

        // HOW
        if (data.how_title)
          setHowCardTitle(buildHtmlFromParts(data.how_title) || "");
        setHowTitleContent(data.how_subtitle ?? "");
        if (Array.isArray(data.how_points)) {
          setPoints(
            data.how_points.map((p: any, idx: number) => ({
              id: p.id ?? `p${idx + 1}`,
              label: p.label ?? "",
              description: p.description ?? "",
              iconPreview: p.iconPreview ?? null,
              iconFile: null,
            }))
          );
        } else {
          // keep default (empty) points
        }
        setHowFooterTitle(data.how_footer ?? "");

        // PROCESS
        if (data.process_title)
          setProcessTitle(buildHtmlFromParts(data.process_title) || "");
        setOurProcessTitleContent(data.process_subtitle ?? "");
        if (Array.isArray(data.process_points)) {
          setProcesses(
            data.process_points.map((pr: any, idx: number) => ({
              id: pr.id ?? `proc${idx + 1}`,
              label: pr.label ?? "",
              description: pr.description ?? "",
            }))
          );
        }

        // WHY
        if (data.why_title)
          setWhyTitle(buildHtmlFromParts(data.why_title) || "");
        if (data.why_points) {
          if (
            Array.isArray(data.why_points) &&
            typeof data.why_points[0] === "string"
          ) {
            setWhyContent(data.why_points[0] ?? "");
          } else if (typeof data.why_points === "string") {
            setWhyContent(data.why_points ?? "");
          }
        }

        if (data.why_image) {
          setWhyBannerPreview(data.why_image || DEFAULT_IMAGE);
        }

        // READY
        if (data.ready_title)
          setReadyTitle(buildHtmlFromParts(data.ready_title) || "");
        setReadyDescription(data.ready_description ?? "");
        setReadyButtonText(data.ready_button ?? "");
        setButtonLink(data.ready_button_link ?? "");
        if (data.ready_image)
          setReadyBannerPreview(data.ready_image || DEFAULT_IMAGE);

        // DEMO
        setPageHeading(data.demo_target ?? "");
        if (data.demo_title) {
          try {
            const dt = data.demo_title;
            if (dt.part1 || dt.part2) {
              setPageHeading(
                `${dt.part1 ?? ""}${dt.part2 ? `<span>${dt.part2}</span>` : ""}`
              );
            }
          } catch {}
        }
        setPageContent(data.demo_subtitle ?? "");
        if (Array.isArray(data.demo_points)) {
          const dp = data.demo_points;
          if (dp[0]) {
            setDemoPoint1(dp[0].title ?? dp[0].label ?? dp[0] ?? "");
            setDemoContent1(dp[0].description ?? dp[0].content ?? dp[0] ?? "");
          }
          if (dp[1]) {
            setDemoPoint2(dp[1].title ?? dp[1].label ?? dp[1] ?? "");
            setDemoContent2(dp[1].description ?? dp[1].content ?? dp[1] ?? "");
          }
          if (dp[2]) {
            setDemoPoint3(dp[2].title ?? dp[2].label ?? dp[2] ?? "");
            setDemoContent3(dp[2].description ?? dp[2].content ?? dp[2] ?? "");
          }
        }
      } catch (err) {
        console.error("Failed to load on-job-support content:", err);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add / Remove helpers (mostly kept but not used by default UI)
  // function addPoint() {
  //   setPoints((prev) => [
  //     ...prev,
  //     {
  //       id: `p${Date.now()}`,
  //       label: "",
  //       description: "",
  //       iconPreview: null,
  //       iconFile: null,
  //     },
  //   ]);
  // }
  // function removePoint(id: string) {
  //   setPoints((prev) => prev.filter((p) => p.id !== id));
  // }

  // function addProcess() {
  //   setProcesses((prev) => [
  //     ...prev,
  //     { id: `proc${Date.now()}`, label: "", description: "" },
  //   ]);
  // }
  // function removeProcess(id: string) {
  //   setProcesses((prev) => prev.filter((p) => p.id !== id));
  // }

  // Build final payload and POST to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    const who_cards = [
      {
        target: whoCardTitleTarget1 || "",
        title: whoCardTitle1 || "",
        content: whoCardTitleContent1 || "",
      },
      {
        target: whoCardTitleTarget2 || "",
        title: whoCardTitle2 || "",
        content: whoCardTitleContent2 || "",
      },
      {
        target: whoCardTitleTarget3 || "",
        title: whoCardTitle3 || "",
        content: whoCardTitleContent3 || "",
      },
      {
        target: whoCardTitleTarget4 || "",
        title: whoCardTitle4 || "",
        content: whoCardTitleContent4 || "",
      },
    ];

    const how_points = points.map((p) => ({
      label: p.label || "",
      description: p.description || "",
    }));
    const process_points = processes.map((pr) => ({
      label: pr.label || "",
      description: pr.description || "",
    }));

    const demo_points = [
      { title: demoPoint1 || "", description: demoContent1 || "" },
      { title: demoPoint2 || "", description: demoContent2 || "" },
      { title: demoPoint3 || "", description: demoContent3 || "" },
    ];

    const why_points_array = [whyContent || ""];

    const payload = {
      hero_title: parseTwoPart(pageTitle || ""),
      hero_description: pageDescription || "",
      hero_button_text: buttonName || "",
      hero_button_link: buttonLink || "",
      hero_image: heroBannerPreview || null,

      realtime_title: parseTwoPart(expertsTitle || ""),
      realtime_subheading: expertsSubTitle || "",
      realtime_description: expertsDescription || "",
      realtime_subsection_title1: expertsTitle1 || "",
      subsection_title1_description: expertsContent1 || "",
      realtime_subsection_title2: expertsTitle2 || "",
      subsection_title2_description: expertsContent2 || "",
      realtime_image: expertsBannerPreview || null,

      who_target: whoTitleTarget || "",
      who_title: parseTwoPart(whoTitle || ""),
      who_subtitle: whoContent || "",
      who_cards: who_cards,

      how_title: parseTwoPart(howCardTitle || ""),
      how_subtitle: howTitleContent || "",
      how_points: how_points,
      how_footer: howFooterTitle || "",

      process_title: parseTwoPart(processTitle || ""),
      process_subtitle: OurProcessTitleContent || "",
      process_points: process_points,

      why_title: parseTwoPart(whyTitle || ""),
      why_points: why_points_array,
      why_image: whyBannerPreview || null,

      ready_title: parseTwoPart(readyTitle || ""),
      ready_description: readyDescription || "",
      ready_button: readyButtonText || "",
      ready_button_link: buttonLink || "",
      ready_image: readyBannerPreview || null,

      demo_target: pageHeading || "",
      demo_title: parseTwoPart(pageHeading || ""),
      demo_subtitle: pageContent || "",
      demo_points: demo_points,
    };

    try {
      const res = await fetch("/api/on-job-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Read response as text first to avoid .json() crashes on HTML
      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        console.error(
          "POST /api/on-job-support returned non-JSON:",
          text.substring(0, 200)
        );
        toast.error(
          "Server error: received non-JSON response (see console for details)"
        );
        return;
      }

      if (res.ok) {
        toast.success("Saved successfully");
      } else {
        console.error("Backend error response:", { status: res.status, json });
        toast.error("Save failed: " + (json?.message || "Server error"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Network error, check the server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminCard title="">
      <div className="min-h-screen bg-gray-50 p-0">
        <Toaster />
        <div className="mx-auto space-y-4">
          <h1 className="text-2xl font-bold">On Job Support</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* HERO */}
            <AdminCard title="Hero Section">
              <div className="space-y-4">
                <AdminInput
                  label="Page Title*"
                  value={pageTitle ?? ""}
                  onChange={setPageTitle}
                />

                <div>
                  <label className="text-gray-600 font-semibold mb-1 block">
                    Page Description*
                  </label>
                  <div className="mt-2">
                    <TipTapEditor
                      value={pageDescription ?? ""}
                      onChange={setPageDescription}
                    />
                  </div>
                </div>

                <BannerBox
                  label="Select Banner Image"
                  image={heroBannerPreview || DEFAULT_IMAGE}
                  onUpload={(urlOrPreview) => {
                    // BannerBox returns final Cloudinary URL (or preview). Save URL.
                    setHeroBannerPreview(urlOrPreview || DEFAULT_IMAGE);
                  }}
                />

                <AdminInput
                  label="Button Name*"
                  value={buttonName ?? ""}
                  onChange={setButtonName}
                />

                <AdminInput
                  label="Button Link*"
                  value={buttonLink ?? ""}
                  onChange={setButtonLink}
                />
              </div>
            </AdminCard>

            {/* REAL TIME INDUSTRY EXPERTS */}
            <AdminCard title="Real Time Industry Experts Section">
              <div className="space-y-4">
                <AdminInput
                  label="Main Title*"
                  value={expertsTitle ?? ""}
                  onChange={setExpertsTitle}
                />

                <AdminInput
                  label="Sub Title*"
                  value={expertsSubTitle ?? ""}
                  onChange={setExpertsSubTitle}
                />

                <div>
                  <label className="text-gray-600 font-semibold mb-1 block">
                    Main Description*
                  </label>
                  <div className="mt-2">
                    <TipTapEditor
                      value={expertsDescription ?? ""}
                      onChange={setExpertsDescription}
                    />
                  </div>
                </div>

                <AdminCard title="Experts Sub Section 1">
                  <AdminInput
                    label="Title 1*"
                    value={expertsTitle1 ?? ""}
                    onChange={setExpertsTitle1}
                  />

                  <AdminTextarea
                    label="Description Content 1*"
                    value={expertsContent1 ?? ""}
                    onChange={setExpertsContent1}
                    rows={5}
                  />
                </AdminCard>

                <AdminCard title="Experts Sub Section 2">
                  <AdminInput
                    label="Title 2*"
                    value={expertsTitle2 ?? ""}
                    onChange={setExpertsTitle2}
                  />

                  <AdminTextarea
                    label="Description Content 2*"
                    value={expertsContent2 ?? ""}
                    onChange={setExpertsContent2}
                    rows={5}
                  />
                </AdminCard>

                <BannerBox
                  label="Select Banner Image"
                  image={expertsBannerPreview || DEFAULT_IMAGE}
                  onUpload={(preview) =>
                    setExpertsBannerPreview(preview || DEFAULT_IMAGE)
                  }
                />
              </div>
            </AdminCard>

            {/* WHO IS THIS FOR */}
            <AdminCard title="Who is this For Section">
              <div className="space-y-4">
                <AdminInput
                  label="Title target*"
                  value={whoTitleTarget ?? ""}
                  onChange={setWhoTitleTarget}
                />
                <AdminInput
                  label="Title*"
                  value={whoTitle ?? ""}
                  onChange={setWhoTitle}
                />
                <div>
                  <label className="text-gray-600 font-semibold mb-1 block">
                    Content*
                  </label>
                  <div className="mt-2">
                    <TipTapEditor
                      value={whoContent ?? ""}
                      onChange={setWhoContent}
                    />
                  </div>
                </div>

                {/* WHO Cards (1-4) */}
                <AdminCard title="">
                  <AdminInput
                    label="Card Title Target 1*"
                    value={whoCardTitleTarget1 ?? ""}
                    onChange={setWhoCardTitleTarget1}
                  />

                  <AdminInput
                    label="Card Title 1*"
                    value={whoCardTitle1 ?? ""}
                    onChange={setWhoCardTitle1}
                  />

                  <AdminTextarea
                    label="Card Title Content 1*"
                    value={whoCardTitleContent1 ?? ""}
                    onChange={setWhoCardTitleContent1}
                    rows={5}
                  />
                </AdminCard>

                <AdminCard title="">
                  <AdminInput
                    label="Card Title Target 2*"
                    value={whoCardTitleTarget2 ?? ""}
                    onChange={setWhoCardTitleTarget2}
                  />

                  <AdminInput
                    label="Card Title 2*"
                    value={whoCardTitle2 ?? ""}
                    onChange={setWhoCardTitle2}
                  />

                  <AdminTextarea
                    label="Card Title Content 2*"
                    value={whoCardTitleContent2 ?? ""}
                    onChange={setWhoCardTitleContent2}
                    rows={5}
                  />
                </AdminCard>

                <AdminCard title="">
                  <AdminInput
                    label="Card Title Target 3*"
                    value={whoCardTitleTarget3 ?? ""}
                    onChange={setWhoCardTitleTarget3}
                  />

                  <AdminInput
                    label="Card Title 3*"
                    value={whoCardTitle3 ?? ""}
                    onChange={setWhoCardTitle3}
                  />

                  <AdminTextarea
                    label="Card Title Content 3*"
                    value={whoCardTitleContent3 ?? ""}
                    onChange={setWhoCardTitleContent3}
                    rows={5}
                  />
                </AdminCard>

                <AdminCard title="">
                  <AdminInput
                    label="Card Title Target 4*"
                    value={whoCardTitleTarget4 ?? ""}
                    onChange={setWhoCardTitleTarget4}
                  />

                  <AdminInput
                    label="Card Title 4*"
                    value={whoCardTitle4 ?? ""}
                    onChange={setWhoCardTitle4}
                  />

                  <AdminTextarea
                    label="Card Title Content 4*"
                    value={whoCardTitleContent4 ?? ""}
                    onChange={setWhoCardTitleContent4}
                    rows={5}
                  />
                </AdminCard>
              </div>
            </AdminCard>

            {/* HOW WE HELP */}
            <div className="space-y-4">
              <AdminCard title="How We Help Section">
                <AdminInput
                  label="Title*"
                  value={howCardTitle ?? ""}
                  onChange={setHowCardTitle}
                />

                <AdminTextarea
                  label="Content*"
                  value={howTitleContent ?? ""}
                  onChange={setHowTitleContent}
                  rows={5}
                />

                {points.map((pt, idx) => (
                  <AdminCard key={pt.id} title={`Point ${idx + 1}`}>
                    <div className="space-y-4">
                      <AdminInput
                        label="Label*"
                        value={pt.label ?? ""}
                        onChange={(v) =>
                          setPoints((prev) =>
                            prev.map((p) =>
                              p.id === pt.id ? { ...p, label: v } : p
                            )
                          )
                        }
                      />

                      <div>
                        <label className="text-gray-600 font-semibold mb-1 block">
                          Description*
                        </label>
                        <div className="mt-2">
                          <TipTapEditor
                            value={pt.description ?? ""}
                            onChange={(html) =>
                              setPoints((prev) =>
                                prev.map((p) =>
                                  p.id === pt.id
                                    ? { ...p, description: html }
                                    : p
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </AdminCard>
                ))}

                <AdminInput
                  label="How We Help Footer*"
                  value={howFooterTitle ?? ""}
                  onChange={setHowFooterTitle}
                />
              </AdminCard>
            </div>

            {/* PROCESS */}
            <div className="space-y">
              <AdminCard title="">
                <h2 className="text-lg font-semibold text-gray-700">
                  Our Process Section
                </h2>

                <AdminCard title="">
                  <AdminInput
                    label="Title*"
                    value={processTitle ?? ""}
                    onChange={setProcessTitle}
                  />

                  <AdminTextarea
                    label="Content*"
                    value={OurProcessTitleContent ?? ""}
                    onChange={setOurProcessTitleContent}
                    rows={5}
                  />

                  {processes.map((proc, idx) => (
                    <AdminCard key={proc.id} title={`Process ${idx + 1}`}>
                      <div className="space-y-4">
                        <AdminInput
                          label="Label*"
                          value={proc.label ?? ""}
                          onChange={(v) =>
                            setProcesses((prev) =>
                              prev.map((p) =>
                                p.id === proc.id ? { ...p, label: v } : p
                              )
                            )
                          }
                        />

                        <div>
                          <label className="text-gray-600 font-semibold mb-1 block">
                            Description*
                          </label>
                          <div className="mt-2">
                            <TipTapEditor
                              value={proc.description ?? ""}
                              onChange={(html) =>
                                setProcesses((prev) =>
                                  prev.map((p) =>
                                    p.id === proc.id
                                      ? { ...p, description: html }
                                      : p
                                  )
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </AdminCard>
                  ))}
                </AdminCard>
              </AdminCard>
            </div>

            {/* WHY CHOOSE */}
            <AdminCard title="Why Choose SkillVedika Section">
              <div className="space-y-4">
                <AdminInput
                  label="Title*"
                  value={whyTitle ?? ""}
                  onChange={setWhyTitle}
                />
                <div>
                  <label className="text-gray-600 font-semibold mb-1 block">
                    Content*
                  </label>
                  <div className="mt-2">
                    <TipTapEditor
                      value={whyContent ?? ""}
                      onChange={setWhyContent}
                    />
                  </div>
                </div>

                <BannerBox
                  label="Select Banner Image"
                  image={whyBannerPreview || DEFAULT_IMAGE}
                  onUpload={(urlOrPreview) => {
                    // BannerBox returns final Cloudinary URL (or preview). Save URL.
                    setWhyBannerPreview(urlOrPreview || DEFAULT_IMAGE);
                  }}
                />
              </div>
            </AdminCard>

            {/* READY TO EMPOWER */}
            <AdminCard title="Ready to Empower Section">
              <div className="space-y-4">
                <AdminInput
                  label="Title*"
                  value={readyTitle ?? ""}
                  onChange={setReadyTitle}
                />
                <AdminInput
                  label="Button Text*"
                  value={readyButtonText ?? ""}
                  onChange={setReadyButtonText}
                />

                <div>
                  <label className="text-gray-600 font-semibold mb-1 block">
                    Description*
                  </label>
                  <div className="mt-2">
                    <TipTapEditor
                      value={readyDescription ?? ""}
                      onChange={setReadyDescription}
                    />
                  </div>
                </div>

                <BannerBox
                  label="Select Banner Image"
                  image={readyBannerPreview || DEFAULT_IMAGE}
                  onUpload={(pr) => setReadyBannerPreview(pr || DEFAULT_IMAGE)}
                />
              </div>
            </AdminCard>

            {/* DEMO SECTION */}
            <AdminCard title="Live Free Demo Section">
              <AdminInput
                label="Demo Section Heading*"
                value={pageHeading ?? ""}
                onChange={setPageHeading}
              />
              <AdminTextarea
                label="Demo Content*"
                value={pageContent ?? ""}
                onChange={setPageContent}
              />

              <AdminInput
                label="Demo Point 1*"
                value={demoPoint1 ?? ""}
                onChange={setDemoPoint1}
              />
              <AdminTextarea
                label="Demo Content 1"
                value={demoContent1 ?? ""}
                onChange={setDemoContent1}
              />

              <AdminInput
                label="Demo Point 2*"
                value={demoPoint2 ?? ""}
                onChange={setDemoPoint2}
              />
              <AdminTextarea
                label="Demo Content 2"
                value={demoContent2 ?? ""}
                onChange={setDemoContent2}
              />

              <AdminInput
                label="Demo Point 3*"
                value={demoPoint3 ?? ""}
                onChange={setDemoPoint3}
              />
              <AdminTextarea
                label="Demo Content 3"
                value={demoContent3 ?? ""}
                onChange={setDemoContent3}
              />
            </AdminCard>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-800 text-white rounded-xl disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminCard>
  );
}
