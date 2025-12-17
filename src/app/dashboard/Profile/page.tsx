"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { BannerBox } from "@/app/dashboard/AllPages/CorporateTraining/components/AdminUI";

interface AdminProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<string>("");

  // Fetch admin profile from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Attach stored token if available (some login flows store the token in localStorage)
      const tokenKeys = ["token", "admin_token", "access_token"];
      let token: string | null = null;
      if (typeof window !== "undefined") {
        for (const k of tokenKeys) {
          const t = localStorage.getItem(k);
          if (t) {
            token = t;
            break;
          }
        }
      }

      const config: {
        withCredentials: boolean;
        headers?: Record<string, string>;
      } = { withCredentials: true };
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get("/admin/profile", config);
      const data = res.data.data || res.data;
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setAvatar(data.avatar || "");
      // persist avatar for header
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_avatar", data.avatar || "");
          window.dispatchEvent(
            new CustomEvent("admin:profileUpdated", {
              detail: { avatar: data.avatar || "" },
            })
          );
        }
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      // If unauthorized, give a clearer message
      if (isAxiosError(err) && err.response?.status === 401) {
        toast.error("Unauthenticated. Please login.");
      }
      setName("");
      setEmail("");
      setAvatar("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProfile();
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
  };

  // Save profile with avatar
  const handleSave = async () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setSaving(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
      };

      if (avatar) {
        payload.avatar = avatar;
      }

      if (password) {
        payload.password = password;
      }

      // Ensure CSRF cookie is present for stateful Sanctum auth
      try {
        await axios.get("/sanctum/csrf-cookie");
      } catch (e) {
        // ignore - interceptor will handle failures, but this improves reliability
        console.debug("CSRF cookie fetch failed (continuing):", e);
      }

      // Attach stored token if available as fallback
      const tokenKeys = ["token", "admin_token", "access_token"];
      let token: string | null = null;
      if (typeof window !== "undefined") {
        for (const k of tokenKeys) {
          const t = localStorage.getItem(k);
          if (t) {
            token = t;
            break;
          }
        }
      }

      const config: {
        withCredentials: boolean;
        headers?: Record<string, string>;
      } = { withCredentials: true };
      if (token) config.headers = { Authorization: `Bearer ${token}` };

      const res = await axios.post("/admin/update", payload, config);

      if (res.data.status === true || res.status === 200) {
        const returned = res.data.data || res.data.user || res.data;
        setProfile({
          id: returned?.id || profile?.id || 0,
          name: returned?.name || name,
          email: returned?.email || email,
          avatar: returned?.avatar || avatar,
        });
        setPassword("");
        toast.success("Profile updated successfully!");
        // Persist avatar in localStorage for header preview and notify other components
        const newAvatar = returned?.avatar || avatar || "";
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("admin_avatar", newAvatar);
            // notify other tabs/components in same window
            window.dispatchEvent(
              new CustomEvent("admin:profileUpdated", {
                detail: { avatar: newAvatar },
              })
            );
          }
        } catch {
          // ignore storage exceptions
        }
      }
    } catch (error) {
        console.error("Failed to save profile:", error);
        // Log server response body if available for easier debugging
        try {
          if (isAxiosError(error) && error.response) {
            console.error('Server response:', JSON.stringify(error.response.data));
          }
        } catch (e) {
          // ignore stringify errors
        }
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error("Unauthenticated. Please login.");
      } else {
        let errorMessage = "Failed to save profile";
        if (isAxiosError(error)) {
          const respData = error.response?.data as
            | { message?: string; error?: string }
            | undefined;
          errorMessage = respData?.message || respData?.error || errorMessage;
        }
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        {/* Avatar Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Avatar
          </h2>
          <BannerBox
            label="Upload Profile Avatar"
            image={avatar}
            onUpload={handleAvatarUpload}
          />
        </div>

        {/* Admin Profile Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Admin Profile Update
          </h2>

          {/* Name Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Password (Leave empty to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter new password (optional)"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
