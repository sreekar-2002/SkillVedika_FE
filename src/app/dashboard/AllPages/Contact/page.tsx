"use client";

import React, { useEffect, useState } from "react";
// import axios from "axios";
// FiUploadCloud not required here — BannerBox handles upload UI
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  BannerBox,
} from "../CorporateTraining/components/AdminUI";
import toast from "react-hot-toast";

export default function ContactPage() {
  // API proxy endpoint
  const API_PROXY = "/api/contact";

  // --------------------------
  // HERO SECTION STATE (kept same names/styles)
  // --------------------------
  const [bannerHeading, setBannerHeading] = useState<string>("");
  const [bannerDescription, setBannerDescription] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<string>("/default-uploads/contact.png");
  // We now upload images via BannerBox -> cloud and store URL in `bannerImage`.
  const [bannerImageRemove, setBannerImageRemove] = useState<boolean>(false);

  const [buttonTitle, setButtonTitle] = useState<string>("");
  const [buttonTitleLink, setButtonTitleLink] = useState<string>("");
  const [heroSectionFooter, setHeroSectionFooter] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");

  // --------------------------
  // GET IN TOUCH SECTION
  // --------------------------
  const [touchHeading, setTouchHeading] = useState<string>("");

  // --------------------------
  // CONTACT DETAILS SECTION
  // --------------------------
  const [phoneLabel, setPhoneLabel] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [emailLabel, setEmailLabel] = useState<string>("");
  const [emailID, setEmailID] = useState<string>("");

  const [location1Label, setLocation1Label] = useState<string>("");
  const [location1Address, setLocation1Address] = useState<string>("");

  const [visitOurGlobalOfficeTitle, setVisitOurGlobalOfficeTitle] = useState<string>("");
  const [visitOurGlobalOfficeContent, setVisitOurGlobalOfficeContent] = useState<string>("");

  const [locationLink1, setLocationLink1] = useState<string>("");
  const [locationLink2, setLocationLink2] = useState<string>("");

  const [location2Label, setLocation2Label] = useState<string>("");
  const [location2Address, setLocation2Address] = useState<string>("");

  const [pageHeading, setPageHeading] = useState<string>("");
  const [pageContent, setPageContent] = useState<string>("");

  const [demoPoint1, setDemoPoint1] = useState<string>("");
  const [demoContent1, setDemoContent1] = useState<string>("");

  const [demoPoint2, setDemoPoint2] = useState<string>("");
  const [demoContent2, setDemoContent2] = useState<string>("");

  const [demoPoint3, setDemoPoint3] = useState<string>("");
  const [demoContent3, setDemoContent3] = useState<string>("");

  // Loading / status
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  // Notifications are shown with react-hot-toast

  // record id (if needed)
  const [recordId, setRecordId] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(true);

  /* ----------------------------
     Load existing content from backend
     GET /api/contact-page
  ---------------------------- */
  // Safe fetch/parse utility
  async function safeFetch(url: string, options?: RequestInit) {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      // fallback for HTML error pages
      return { message: text };
    }
  }

  useEffect(() => {
    let mounted = true;
    const load = async () => {
  setLoading(true);
      try {
        const body = await safeFetch(API_PROXY, { method: "GET" });
        if (!mounted) return;

        // map backend fields to your frontend variables
        if (body?.hero_title) {
          const ht = body.hero_title;
          if (typeof ht === "string") {
            setBannerHeading(ht);
          } else if (typeof ht === "object") {
            setBannerHeading(ht.text ?? `${ht.part1 ?? ""} ${ht.part2 ?? ""}`.trim());
          }
        }
        setBannerDescription(body?.hero_description ?? bannerDescription);
        setButtonTitle(body?.hero_button ?? buttonTitle);
        setButtonTitleLink(body?.hero_button_link ?? buttonTitleLink);
        setBannerImage(body?.hero_image ?? bannerImage);
        setHeroSectionFooter(body?.contactus_target ?? heroSectionFooter);
        setSubTitle(body?.contactus_subtitle ?? subTitle);

        if (body?.contactus_title) {
          const ct = body.contactus_title;
          if (typeof ct === "string") setTouchHeading(ct);
          else if (typeof ct === "object") setTouchHeading(ct.text ?? `${ct.part1 ?? ""} ${ct.part2 ?? ""}`.trim());
        }
        setPhoneLabel(body?.contacts_phone_label ?? phoneLabel);
        setPhoneNumber(body?.contacts_phone_number ?? phoneNumber);
        setEmailLabel(body?.contacts_email_label ?? emailLabel);
        setEmailID(body?.contacts_email_id ?? emailID);
        setLocation1Label(body?.contactus_location1_label ?? location1Label);
        setLocation1Address(body?.contactus_location1_address ?? location1Address);
        setVisitOurGlobalOfficeTitle(body?.map_title ? (typeof body.map_title === "string" ? body.map_title : (body.map_title.text ?? `${body.map_title.part1 ?? ""} ${body.map_title.part2 ?? ""}`)) : visitOurGlobalOfficeTitle);
        setVisitOurGlobalOfficeContent(body?.map_subtitle ?? visitOurGlobalOfficeContent);
        setLocationLink1(body?.map_link_india ?? locationLink1);
        setLocationLink2(body?.map_link ?? locationLink2);
        setLocation2Label(body?.contactus_location2_label ?? location2Label);
        setLocation2Address(body?.contactus_location2_address ?? location2Address);
        setPageHeading(body?.demo_title ? (typeof body.demo_title === "string" ? body.demo_title : (body.demo_title.text ?? pageHeading)) : pageHeading);
        setPageContent(body?.demo_subtitle ?? pageContent);
        if (Array.isArray(body?.demo_points) && body.demo_points.length > 0) {
          const dp = body.demo_points;
          if (dp[0]) {
            setDemoPoint1(dp[0].title ?? demoPoint1);
            setDemoContent1(dp[0].description ?? demoContent1);
          }
          if (dp[1]) {
            setDemoPoint2(dp[1].title ?? demoPoint2);
            setDemoContent2(dp[1].description ?? demoContent2);
          }
          if (dp[2]) {
            setDemoPoint3(dp[2].title ?? demoPoint3);
            setDemoContent3(dp[2].description ?? demoContent3);
          }
        }
        setRecordId(body?.id ?? null);
        setIsNewRecord(!body?.id); // Track if this is a new record
      } catch (err: any) {
        console.error("Failed to load contact page:", err);
        toast.error("Failed to load contact page.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  /* ----------------------------
     Image upload handler using BannerBox (uploads to Cloudinary in BannerBox)
  ---------------------------- */
  // Banner uploads handled by BannerBox -> onUpload gives remote URL

  /* ----------------------------
     Submit handler (POST /api/contact-page/update)
     Uses FormData to allow image upload
  ---------------------------- */
  const handleSubmit = async () => {
  setSaving(true);

    // Build payload as JSON (route.js proxy expects JSON)
    const heroTitlePayload = { text: bannerHeading, part1: "", part2: "" };
    const contactusTitlePayload = { text: touchHeading ?? "" };
    const mapTitlePayload = { text: visitOurGlobalOfficeTitle ?? "" };
    const demoTitlePayload = { text: pageHeading ?? "" };
    const demoPointsPayload = [
      { title: demoPoint1 ?? "", description: demoContent1 ?? "" },
      { title: demoPoint2 ?? "", description: demoContent2 ?? "" },
      { title: demoPoint3 ?? "", description: demoContent3 ?? "" },
    ];

    const payload: any = {
      hero_title: heroTitlePayload,
      hero_description: bannerDescription ?? "",
      hero_button: buttonTitle ?? "",
      hero_button_link: buttonTitleLink ?? "",
      contactus_title: contactusTitlePayload,
      contactus_subtitle: subTitle ?? "",
      contacts_email_label: emailLabel ?? "",
      contacts_email_id: emailID ?? "",
      contacts_email_id_link: "",
      contacts_phone_label: phoneLabel ?? "",
      contacts_phone_number: phoneNumber ?? "",
      contacts_phone_number_link: "",
      contactus_location1_label: location1Label ?? "",
      contactus_location1_address: location1Address ?? "",
      contactus_location1_address_link: locationLink1 ?? "",
      contactus_location2_label: location2Label ?? "",
      contactus_location2_address: location2Address ?? "",
      contactus_location2_address_link: locationLink2 ?? "",
      map_title: mapTitlePayload,
      map_subtitle: visitOurGlobalOfficeContent ?? "",
      map_link_india: locationLink1 ?? "",
      map_link: locationLink2 ?? "",
      demo_title: demoTitlePayload,
      demo_subtitle: pageContent ?? "",
      demo_points: demoPointsPayload,
      contactus_target: heroSectionFooter ?? "",
      demo_target: "",
    };

    // If an image URL is available, send it as hero_image; if flagged to remove, send a remove flag
    if (bannerImageRemove) {
      payload.hero_image_remove = 1;
    } else if (bannerImage) {
      payload.hero_image = bannerImage;
    }

    try {
      // Send JSON and inspect raw response for debugging and correctness
      const res = await fetch(API_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }

      // Log for debugging (open browser console / network to inspect)
      console.debug("POST /api/contact response status:", res.status, "body:", parsed ?? text);

      if (!res.ok) {
        // parsed might be an object with message or error fields
        const parsedObj = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : undefined;
        const msg = parsedObj && ("message" in parsedObj || "error" in parsedObj)
          ? String(parsedObj["message"] ?? parsedObj["error"])
          : text || `Status ${res.status}`;
        toast.error(String(msg));
        throw new Error(String(msg));
      }

      // success path
      const data = (parsed && typeof parsed === "object") ? (parsed as Record<string, unknown>) : { __rawText: text } as Record<string, unknown>;
      const updated = data && typeof data === "object" ? data["content"] : undefined;
      if (updated && typeof updated === "object" && (updated as Record<string, unknown>)["hero_image"]) {
        setBannerImage(String((updated as Record<string, unknown>)["hero_image"]));
      }
      const successMsg = isNewRecord ? "Contact Page Saved successfully." : "Contact Page Updated successfully.";
      toast.success(successMsg);
      setIsNewRecord(false);

      // re-fetch fresh data to ensure UI matches backend
      try {
        const body = await safeFetch(API_PROXY, { method: "GET" });
        // update many fields conservatively from returned body
        if (body?.hero_title) {
          const ht = body.hero_title;
          if (typeof ht === "string") setBannerHeading(ht);
          else if (typeof ht === "object") setBannerHeading(ht.text ?? bannerHeading);
        }
        setBannerDescription(body?.hero_description ?? bannerDescription);
        setButtonTitle(body?.hero_button ?? buttonTitle);
        setButtonTitleLink(body?.hero_button_link ?? buttonTitleLink);
        setBannerImage(body?.hero_image ?? bannerImage);
        setHeroSectionFooter(body?.contactus_target ?? heroSectionFooter);
        setSubTitle(body?.contactus_subtitle ?? subTitle);
      } catch (e) {
        console.debug("Failed to re-fetch after save:", e);
      }
    } catch (err: unknown) {
      let msg = "Failed to save content.";
      if (err instanceof Error) msg = err.message;
      else if (typeof err === "string") msg = err;
      else msg = String(err ?? msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
      {/* Header / status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contact Page</h1>

      </div>

  {/* Notifications use react-hot-toast; inline banners removed */}

      {/* -------------------------------------- */}
      {/* CONTACT HERO SECTION */}
      {/* -------------------------------------- */}
      <div
        className="bg-gray-50 p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(16,24,40,0.08)" }}
      >
        <h2 className="text-lg font-semibold text-gray-700">Hero Section</h2>

        <AdminInput label="Button Title*" value={buttonTitle} onChange={setButtonTitle} />

        <AdminInput label="Button Title Link*" value={buttonTitleLink} onChange={setButtonTitleLink} />

        {/* Banner Heading */}
        <div>
          <label className="text-gray-600 block mb-1 font-semibold">Heading*</label>
          <input value={bannerHeading} onChange={(e) => setBannerHeading(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>

        {/* Banner Description */}
        <div>
          <label className="text-gray-600 block mb-1 font-semibold">Description*</label>
          <textarea rows={4} value={bannerDescription} onChange={(e) => setBannerDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300"></textarea>
        </div>

        {/* Banner Image (uses Admin BannerBox which uploads to cloud) */}
        <div>
          <BannerBox
            label="Banner Image"
            image={bannerImage}
            onUpload={(url: string) => {
              setBannerImage(url);
              // bannerImageFile removed — BannerBox returns remote URLs
              setBannerImageRemove(false);
            }}
          />

          {bannerImage && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setBannerImage("");
                  // bannerImageFile removed — BannerBox returns remote URLs
                  setBannerImageRemove(true);
                  toast("Banner image removed", { icon: "🗑️" });
                }}
                // className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
              >
                {/* Remove */}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* GET IN TOUCH SECTION */}
      {/* -------------------------------------- */}
      <div
        className="bg-gray-50 p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(16,24,40,0.08)" }}
      >
        <h2 className="text-lg font-semibold text-gray-700">Get In Touch Heading Section</h2>

        <AdminInput label="Hero Section Footer*" value={heroSectionFooter} onChange={setHeroSectionFooter} />

        <div>
          <label className="text-gray-600 font-semibold mb-1 block">Section Heading*</label>
          <input value={touchHeading} onChange={(e) => setTouchHeading(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>

        <AdminInput label="Sub Title*" value={subTitle} onChange={setSubTitle} />
      </div>

      {/* -------------------------------------- */}
      {/* CONTACT DETAILS SECTION */}
      {/* -------------------------------------- */}
      <div
        className="bg-gray-50 p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(16,24,40,0.08)" }}
      >
        <h2 className="text-lg font-semibold text-gray-700">Contact Details Section</h2>

        {/* PHONE + EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Label */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Phone Label*</label>
            <input value={phoneLabel} onChange={(e) => setPhoneLabel(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
          </div>

          {/* Email Label */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Email Label*</label>
            <input value={emailLabel} onChange={(e) => setEmailLabel(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Phone Number*</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
          </div>

          {/* Email ID */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">Email ID*</label>
            <input value={emailID} onChange={(e) => setEmailID(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
          </div>
        </div>

        {/* LOCATION 1 */}
        <div>
          <label className="text-gray-600 font-semibold mb-1 block">Location1 Label*</label>
          <input value={location1Label} onChange={(e) => setLocation1Label(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>

        <div>
          <label className="text-gray-600 font-semibold mb-1 block">Location1 Address*</label>
          <input value={location1Address} onChange={(e) => setLocation1Address(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>

        {/* LOCATION 2 */}
        <div>
          <label className="text-gray-600 font-semibold mb-1 block">Location2 Label*</label>
          <input value={location2Label} onChange={(e) => setLocation2Label(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>

        <div>
          <label className="text-gray-600 font-semibold mb-1 block">Location2 Address*</label>
          <input value={location2Address} onChange={(e) => setLocation2Address(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300" />
        </div>
      </div>

      <AdminCard title="Visit Our Global Office Section">
        <AdminInput label="Title*" value={visitOurGlobalOfficeTitle} onChange={setVisitOurGlobalOfficeTitle} />

        <AdminTextarea label="Sub Title*" value={visitOurGlobalOfficeContent} onChange={setVisitOurGlobalOfficeContent} rows={4} />

        <AdminInput label="Google Map Embed Link1*" value={locationLink1} onChange={setLocationLink1} />

        <AdminInput label="Google Map Embed Link2*" value={locationLink2} onChange={setLocationLink2} />
      </AdminCard>

      {/* DEMO SECTION */}
      <AdminCard title="Live Free Demo Section">
        <AdminInput label="Demo Section Heading*" value={pageHeading ?? ""} onChange={setPageHeading} />
        <AdminTextarea label="Demo Content*" value={pageContent ?? ""} onChange={setPageContent} />

        <AdminInput label="Demo Point 1*" value={demoPoint1 ?? ""} onChange={setDemoPoint1} />
        <AdminTextarea label="Demo Content 1" value={demoContent1 ?? ""} onChange={setDemoContent1} />

        <AdminInput label="Demo Point 2*" value={demoPoint2 ?? ""} onChange={setDemoPoint2} />
        <AdminTextarea label="Demo Content 2" value={demoContent2 ?? ""} onChange={setDemoContent2} />

        <AdminInput label="Demo Point 3*" value={demoPoint3 ?? ""} onChange={setDemoPoint3} />
        <AdminTextarea label="Demo Content 3" value={demoContent3 ?? ""} onChange={setDemoContent3} />
      </AdminCard>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={saving} className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm">
          {saving ? "Saving..." : "Submit"}
        </button>
      </div>
    </section>
  );
}
