"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";

import { uploadToCloudinary } from "@/services/cloudinaryUpload";

/* -------------------------
   Small UI helpers (unchanged CSS)
---------------------------*/

// OUTER CARD
function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-8 mb-8 border border-gray-200">
      {children}
    </div>
  );
}

// INNER LIGHT GRAY CARD
function InnerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-6">{children}</div>
  );
}

// UPLOAD BOX (unchanged look)
function UploadBox({
  label,
  preview,
  onChange,
}: {
  label: string;
  preview: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <InnerCard>
      <p className="font-semibold mb-3 text-gray-600">{label}</p>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 bg-blue-800 text-white px-5 py-3 rounded-lg shadow cursor-pointer hover:bg-blue-700 transition ">
          <FiUploadCloud size={20} /> Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onChange}
          />
        </label>

        {preview && (
          <div className="w-28 h-28 rounded-xl bg-white shadow flex items-center justify-center">
            {/* Use plain img tag for remote URLs & object URLs to avoid next/image domain config */}
            <img
              src={preview}
              alt="preview"
              width={110}
              height={110}
              className="rounded-xl object-cover"
            />
          </div>
        )}
      </div>
    </InnerCard>
  );
}

/* -------------------------
   SETTINGS PAGE
--------------------------- */

// Use 127.0.0.1 to match Laragon backend
const API_BASE = "http://127.0.0.1:8000";
const GET_ENDPOINT = `${API_BASE}/api/settings`;
const POST_ENDPOINT = `${API_BASE}/api/settings/update`;

// default local preview image (from your uploaded assets)
// Developer-provided local file path:
const DEFAULT_LOCAL_IMAGE =
  "/mnt/data/ec989779-babf-41a3-9255-650182657d0c.png";

export default function SettingsPage() {
  // ADMIN PROFILE
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");

  // WEBSITE CONTROLS
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [googleAnalytics, setGoogleAnalytics] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");

  // FOOTER / SOCIAL
  const [footerDescription, setFooterDescription] = useState("");
  const [copyrightText, setCopyrightText] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // IMAGES (preview URL + File object)
  const [headerLogoPreview, setHeaderLogoPreview] = useState<string | null>(
    DEFAULT_LOCAL_IMAGE
  );
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);

  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(
    DEFAULT_LOCAL_IMAGE
  );
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);

  const [courseBannerPreview, setCourseBannerPreview] = useState<string | null>(
    DEFAULT_LOCAL_IMAGE
  );
  const [courseBannerFile, setCourseBannerFile] = useState<File | null>(null);

  const [blogBannerPreview, setBlogBannerPreview] = useState<string | null>(
    DEFAULT_LOCAL_IMAGE
  );
  const [blogBannerFile, setBlogBannerFile] = useState<File | null>(null);

  // loading indicators - SEPARATE for admin and non-admin
  const [adminLoading, setAdminLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Helper to fetch and update all settings from backend
  async function fetchAndUpdateSettings() {
    try {
      const res = await fetch(GET_ENDPOINT, { credentials: "include" });
      if (!res.ok) {
        console.warn("Could not fetch settings:", res.status);
        alert(
          `Could not fetch settings from backend.\n\nPossible reasons:\n- Backend is not running at ${GET_ENDPOINT}\n- CORS is not configured to allow requests from your frontend\n- Network error or wrong API URL.\n\nCheck your backend server and CORS config.`
        );
        return;
      }
      const data = await res.json();
      setName(data.admin_name ?? "");
      setAdminEmail(data.admin_email ?? "");
      setWebsiteTitle(data.website_title ?? "");
      setWebsiteUrl(data.website_url ?? "");
      setGoogleAnalytics(data.google_analytics ?? "");
      setVideoUrl(data.video_url ?? "");
      setPhone(data.phone ?? "");
      setSupportEmail(data.support_email ?? data.email ?? "");
      setLocation1(data.location1 ?? "");
      setLocation2(data.location2 ?? "");
      setFooterDescription(data.footer_description ?? "");
      setCopyrightText(data.copyright_text ?? "");
      setFacebookUrl(data.facebook_url ?? "");
      setInstagramUrl(data.instagram_url ?? "");
      setLinkedinUrl(data.linkedin_url ?? "");
      setYoutubeUrl(data.youtube_url ?? "");
      if (data.header_logo_url) setHeaderLogoPreview(data.header_logo_url);
      if (data.footer_logo_url) setFooterLogoPreview(data.footer_logo_url);
      if (data.course_banner_url) setCourseBannerPreview(data.course_banner_url);
      if (data.blog_banner_url) setBlogBannerPreview(data.blog_banner_url);
    } catch (err) {
      console.error("Failed to load settings:", err);
      alert(
        `Network or CORS error: Could not reach backend at ${GET_ENDPOINT}.\n\nPossible reasons:\n- Backend is not running\n- CORS is not configured\n- Wrong API URL or port\n\nCheck your backend server and CORS config.`
      );
    }
  }

  // On mount -> load settings from backend and set states
  useEffect(() => {
    fetchAndUpdateSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save non-admin settings (called on submit)
  async function saveNonAdminSettings() {
    try {
      setSettingsLoading(true);
      // Ensure any selected files are uploaded to Cloudinary before building FormData.
      const isRemote = (u: string | null | undefined) => !!u && /^https?:\/\//i.test(u);
      // If preview isn't a remote URL but a file was selected, try uploading now.
      if (!isRemote(headerLogoPreview) && headerLogoFile) {
        try {
          const url = await uploadToCloudinary(headerLogoFile);
          if (url) {
            setHeaderLogoPreview(url);
            setHeaderLogoFile(null);
          }
        } catch (err) {
          console.error("Header upload on submit failed:", err);
          alert("Header image upload failed during save. Please try again or re-select the image.");
        }
      }
      if (!isRemote(footerLogoPreview) && footerLogoFile) {
        try {
          const url = await uploadToCloudinary(footerLogoFile);
          if (url) {
            setFooterLogoPreview(url);
            setFooterLogoFile(null);
          }
        } catch (err) {
          console.error("Footer upload on submit failed:", err);
          alert("Footer image upload failed during save. Please try again or re-select the image.");
        }
      }
      if (!isRemote(courseBannerPreview) && courseBannerFile) {
        try {
          const url = await uploadToCloudinary(courseBannerFile);
          if (url) {
            setCourseBannerPreview(url);
            setCourseBannerFile(null);
          }
        } catch (err) {
          console.error("Course banner upload on submit failed:", err);
          alert("Course banner image upload failed during save. Please try again or re-select the image.");
        }
      }
      if (!isRemote(blogBannerPreview) && blogBannerFile) {
        try {
          const url = await uploadToCloudinary(blogBannerFile);
          if (url) {
            setBlogBannerPreview(url);
            setBlogBannerFile(null);
          }
        } catch (err) {
          console.error("Blog banner upload on submit failed:", err);
          alert("Blog banner image upload failed during save. Please try again or re-select the image.");
        }
      }

      const form = new FormData();
  // Website Controls
  form.append("website_title", websiteTitle);
  form.append("website_url", websiteUrl);
  form.append("google_analytics", googleAnalytics);
  form.append("video_url", videoUrl);
  form.append("phone", phone);
  // backend uses `support_email` (or `email` historically) — send support_email to be explicit
  form.append("support_email", supportEmail);
  // normalize to the same keys the backend returns: location1 / location2
  form.append("location1", location1);
  form.append("location2", location2);
      // Footer / Social
  form.append("footer_description", footerDescription);
  // backend returns `copyright_text` — send same key so fetch updates the UI consistently
  form.append("copyright_text", copyrightText);
      form.append("facebook_url", facebookUrl);
      form.append("instagram_url", instagramUrl);
      form.append("linkedin_url", linkedinUrl);
      form.append("youtube_url", youtubeUrl);
      // Images
      // if (headerLogoFile) form.append("header_logo", headerLogoFile);
      // if (footerLogoFile) form.append("footer_logo", footerLogoFile);
      // if (courseBannerFile) form.append("course_banner", courseBannerFile);
      // if (blogBannerFile) form.append("blog_banner", blogBannerFile);

    // Only include image URLs if they're remote (uploaded to Cloudinary). This avoids sending
    // local/object URLs which won't persist after refresh and could overwrite server values.
    if (isRemote(headerLogoPreview)) form.append("header_logo_url", headerLogoPreview || "");
    if (isRemote(footerLogoPreview)) form.append("footer_logo_url", footerLogoPreview || "");
    if (isRemote(courseBannerPreview)) form.append("course_banner_url", courseBannerPreview || "");
    if (isRemote(blogBannerPreview)) form.append("blog_banner_url", blogBannerPreview || "");


      // Obtain CSRF cookie (required for Laravel Sanctum in some setups)
      try {
        await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });
      } catch (csrfErr) {
        console.warn("Could not fetch CSRF cookie:", csrfErr);
      }
      // Read XSRF-TOKEN cookie (if present) and send it as header.
      let xsrfToken = null;
      try {
          const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN=([^;]+)'));
        xsrfToken = m ? decodeURIComponent(m[2]) : null;
        } catch {
        xsrfToken = null;
      }
      // Build headers carefully — do NOT set Content-Type when sending FormData
      const headers: Record<string, string> = xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {};
      // If a bearer/admin token is stored (from admin login), include it so token auth works
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch(POST_ENDPOINT, {
        method: "POST",
        body: form,
        credentials: "include",
        headers,
      });
      if (!res.ok) {
        let txt = await res.text();
        // Try parse JSON error message if possible
        try {
          const j = JSON.parse(txt);
          if (j.message) txt = j.message;
        } catch {}
        console.error("Save error:", res.status, txt);
        if (res.status === 401) {
          alert("Save failed: unauthenticated. Please log in as admin and try again.");
        } else {
          alert(`Save failed: ${txt}`);
        }
        setSettingsLoading(false);
        return;
      }
      // After successful save, fetch latest settings and update UI
      await fetchAndUpdateSettings();
      // clear file objects after successful upload
      setHeaderLogoFile(null);
      setFooterLogoFile(null);
      setCourseBannerFile(null);
      setBlogBannerFile(null);
      alert("Settings saved successfully.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. Check console for details.");
    } finally {
      setSettingsLoading(false);
    }
  }

  // Handlers for file changes: create preview and set file variable
  // function handleHeaderLogoChange(e: ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0] ?? null;
  //   if (!file) return;
  //   setHeaderLogoFile(file);
  //   setHeaderLogoPreview(URL.createObjectURL(file));
  // }

  async function handleHeaderLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // keep the selected file in state (fallback upload on submit if immediate upload fails)
    setHeaderLogoFile(file);
    // show a quick local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setHeaderLogoPreview(objectUrl);
    try {
      const url = await uploadToCloudinary(file); // upload to cloudinary
      if (url) {
      setHeaderLogoPreview(url); // replace preview with cloud URL
      setHeaderLogoFile(null); // upload succeeded, no need to keep file
    }
    } catch (err) {
      console.error("Header logo upload failed:", err);
      alert("Header image upload failed. Please try again.");
      // keep local preview so user can retry or re-select
      setHeaderLogoPreview(objectUrl);
    }
}


  // function handleFooterLogoChange(e: ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0] ?? null;
  //   if (!file) return;
  //   setFooterLogoFile(file);
  //   setFooterLogoPreview(URL.createObjectURL(file));
  // }

  async function handleFooterLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFooterLogoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFooterLogoPreview(objectUrl);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
      setFooterLogoPreview(url);
      setFooterLogoFile(null);
    }
    } catch (err) {
      console.error("Footer logo upload failed:", err);
      alert("Footer image upload failed. Please try again.");
      setFooterLogoPreview(objectUrl);
    }
}

  // function handleCourseBannerChange(e: ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0] ?? null;
  //   if (!file) return;
  //   setCourseBannerFile(file);
  //   setCourseBannerPreview(URL.createObjectURL(file));
  // }

  async function handleCourseBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCourseBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCourseBannerPreview(objectUrl);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
      setCourseBannerPreview(url);
      setCourseBannerFile(null);
    }
    } catch (err) {
      console.error("Course banner upload failed:", err);
      alert("Course banner upload failed. Please try again.");
      setCourseBannerPreview(objectUrl);
    }
}


  // function handleBlogBannerChange(e: ChangeEvent<HTMLInputElement>) {
  //   const file = e.target.files?.[0] ?? null;
  //   if (!file) return;
  //   setBlogBannerFile(file);
  //   setBlogBannerPreview(URL.createObjectURL(file));
  // }


  async function handleBlogBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBlogBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBlogBannerPreview(objectUrl);
    try {
      const url = await uploadToCloudinary(file);
      if (url) {
      setBlogBannerPreview(url);
      setBlogBannerFile(null);
    }
    } catch (err) {
      console.error("Blog banner upload failed:", err);
      alert("Blog banner upload failed. Please try again.");
      setBlogBannerPreview(objectUrl);
    }
}


  // quick-per-section save helpers (they call the same saveSettings)
  // Update only admin profile (calls protected admin endpoint). Returns new token if provided.
  const updateAdminProfile = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    try {
      setAdminLoading(true);

      // Try to get CSRF cookie for Sanctum
      try {
        await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });
      } catch (csrfErr) {
        console.warn("Could not fetch CSRF cookie:", csrfErr);
      }

      // read xsrf token cookie if present
      let xsrfToken = null;
      try {
          const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN=([^;]+)'));
        xsrfToken = m ? decodeURIComponent(m[2]) : null;
        } catch {
        xsrfToken = null;
      }

      const body: Record<string, unknown> = { name };
      body.email = adminEmail;
      if (password) body.password = password;

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (xsrfToken) headers["X-XSRF-TOKEN"] = xsrfToken;

      // If a bearer token is stored, include it (login saves as 'admin_token')
      const storedToken = localStorage.getItem("admin_token");
      if (storedToken) headers["Authorization"] = `Bearer ${storedToken}`;

      const res = await fetch(`${API_BASE}/api/admin/update`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Admin update failed:", res.status, txt);
        alert("Admin update failed. Check console for details.");
        return;
      }

      const respJson = await res.json();
      if (respJson.token) {
        localStorage.setItem("admin_token", respJson.token);
      }
      if (respJson.user) {
        setName(respJson.user.name || name);
        setAdminEmail(respJson.user.email || adminEmail);
      }
      // clear password field after successful update
      setPassword("");

      alert(respJson.message || "Admin profile updated successfully.");
    } catch (err) {
      console.error("Admin update error:", err);
      alert("Admin update failed. Check console for details.");
    } finally {
      setAdminLoading(false);
    }
  };

  // handle final submit (saves all non-admin settings)
  const handleFinalSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    await saveNonAdminSettings();
  };

  return (
    <PageCard>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* ADMIN PROFILE */}
        <PageCard>
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Admin Profile Update
          </h2>

          <InnerCard>
            <label className="font-semibold block mb-2 text-gray-600">
              Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Email*
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <div className="flex justify-end">
              <button
                onClick={updateAdminProfile}
                className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                disabled={adminLoading}
              >
                {adminLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </InnerCard>
        </PageCard>

        {/* WEBSITE CONTROLS */}
        <PageCard>
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Website Controls
          </h2>

          <InnerCard>
            <label className="font-semibold block mb-2 text-gray-600">
              Website Title*
            </label>
            <input
              type="text"
              value={websiteTitle}
              onChange={(e) => setWebsiteTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Website URL*
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Google Analytics*
            </label>
            <input
              type="text"
              value={googleAnalytics}
              onChange={(e) => setGoogleAnalytics(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Video URL*
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold block mb-2 text-gray-600">
                  Phone Number*
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
                />
              </div>

              <div>
                <label className="font-semibold block mb-2 text-gray-600">
                  Email ID*
                </label>
                <input
                  type="text"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
                />
              </div>
            </div>

            <label className="font-semibold block mb-2 text-gray-600">
              Location1 Address*
            </label>
            <input
              type="text"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Location2 Address*
            </label>
            <input
              type="text"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />
          </InnerCard>
        </PageCard>

        {/* LOGO & BANNERS */}
        <PageCard>
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Controls</h2>
          <InnerCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-600">
                  Select Logo
                </h3>

                <UploadBox
                  label="Select Header Logo"
                  preview={headerLogoPreview}
                  onChange={handleHeaderLogoChange}
                />

                <UploadBox
                  label="Select Footer Logo"
                  preview={footerLogoPreview}
                  onChange={handleFooterLogoChange}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-600">
                  Select Banner
                </h3>

                <UploadBox
                  label="Select Default Course Banner"
                  preview={courseBannerPreview}
                  onChange={handleCourseBannerChange}
                />

                <UploadBox
                  label="Select Default Blog Banner"
                  preview={blogBannerPreview}
                  onChange={handleBlogBannerChange}
                />
              </div>
            </div>

            <label className="font-semibold block mb-2 text-gray-600">
              Footer Short Description*
            </label>
            <textarea
              rows={4}
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold text-gray-600 block mb-2">
              CopyRight*
            </label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Facebook URL*
            </label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Instagram URL*
            </label>
            <input
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Linkedin URL*
            </label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Youtube URL*
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />
          </InnerCard>
        </PageCard>

        {/* SUBMIT */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleFinalSubmit}
            className="bg-blue-800 text-white px-10 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            disabled={settingsLoading}
          >
            {settingsLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </PageCard>
  );
}
