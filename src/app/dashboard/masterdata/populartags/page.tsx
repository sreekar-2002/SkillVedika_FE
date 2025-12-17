"use client";

import { useState, useEffect, useMemo } from "react";
import useDebounce from "@/utils/useDebounce";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const API = "/api/popular-tags"; // use frontend proxy route

export default function AllPopularTags() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [tags, setTags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUsageCount, setEditUsageCount] = useState("");

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [newTagUsageCount, setNewTagUsageCount] = useState("");

  // Fetch tags
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
  const res = await fetch(API, { credentials: "include" });
      const text = await res.text();
  let parsed = null;
  try { parsed = JSON.parse(text); } catch { parsed = null; }
  const data = parsed ?? [];
  setTags(Array.isArray(data) ? data : data?.data || []);
    } catch (_err) {
      toast.error("Failed to load tags.");
    }
  };

  // Add tag
  const addTag = async () => {
    if (!newTagName.trim()) return toast.error("Tag name is required.");

    // Ensure CSRF cookie exists for Laravel Sanctum (XSRF-TOKEN)
    // Client-side duplicate prevention
    const exists = tags.some(
      (t) => t?.name && t.name.toLowerCase() === newTagName.trim().toLowerCase()
    );
    if (exists) return toast.error("Duplicate tags are not allowed.");

    try {
      const hasXsrf = typeof document !== 'undefined' && document.cookie.includes('XSRF-TOKEN=');
      if (!hasXsrf) {
        // call proxied sanctum csrf endpoint to set XSRF-TOKEN and session cookie on frontend origin
        await fetch('/api/sanctum/csrf-cookie', { method: 'GET', credentials: 'include' });
        // small pause to allow cookie to be set
        await new Promise((r) => setTimeout(r, 150));
      }
    } catch (e) {
      console.warn('Failed to ensure CSRF cookie before addTag', e);
    }

    try {
      // Use temporary public endpoint while auth/session is being debugged
      const res = await fetch('/api/public/popular-tags', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newTagName,
          description: newTagDescription,
          usage_count: parseInt(newTagUsageCount) || 0,
        }),
      });

      const text = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }

      if (!res.ok) {
        const msg = parsed && (parsed.message || parsed.error) ? (parsed.message || parsed.error) : (parsed?.errors?.name?.[0] ?? text ?? "Failed to add tag.");
        return toast.error(String(msg));
      }

      const newTagObj = parsed?.tag ?? parsed?.data?.tag ?? (parsed && parsed.id ? parsed : null);
      if (newTagObj) {
        setTags([newTagObj, ...tags]);
        setNewTagName("");
        setNewTagDescription("");
        setNewTagUsageCount("");
        setIsModalOpen(false);
        toast.success("Tag added successfully!");
      } else {
        // If server returned success but unexpected shape, still close modal and show success
        setNewTagName("");
        setNewTagDescription("");
        setNewTagUsageCount("");
        setIsModalOpen(false);
        toast.success("Tag added (response parsed unexpectedly)");
      }
    } catch (_err) {
      console.error("addTag error:", _err);
      toast.error("Error adding tag.");
    }
  };

  // Update tag
  const updateTag = async (id) => {
    if (!editName.trim()) return toast.error("Tag name is required.");

    // Prevent duplicates when renaming
    const exists = tags.some(
      (t) => t.id !== id && t?.name && t.name.toLowerCase() === editName.trim().toLowerCase()
    );
    if (exists) return toast.error("Duplicate tags are not allowed.");

    try {
      const res = await fetch(`/api/public/popular-tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          usage_count: parseInt(editUsageCount) || 0,
        }),
      });

      const text = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(text); } catch { parsed = null; }
      if (!res.ok) {
        // Log full response for debugging, show short preview to user
        console.error('updateTag backend response:', { status: res.status, text });
        const preview = (typeof text === 'string' && text.length > 300) ? text.substring(0,300) + '...' : (text || 'Failed to update tag.');
        return toast.error(preview);
      }

      const tag = parsed?.tag ?? parsed?.data?.tag ?? null;
      if (tag) setTags(tags.map((t) => (t.id === id ? tag : t)));
      setEditingId(null);
      toast.success("Tag updated successfully!");
    } catch (_err) {
      toast.error("Error updating tag.");
    }
  };

  // Delete tag
  const deleteTag = async (id) => {
    if (!confirm("Delete this tag?")) return;

    try {
      const res = await fetch(`/api/public/popular-tags/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('deleteTag backend response:', { status: res.status, text });
        const preview = (typeof text === 'string' && text.length > 300) ? text.substring(0,300) + '...' : (text || 'Failed to delete tag.');
        return toast.error(preview);
      }

      setTags(tags.filter((t) => t.id !== id));
      toast.success("Tag deleted successfully!");
    } catch (_err) {
      toast.error("Error deleting tag.");
    }
  };

  const filteredTags = useMemo(
    () => tags.filter((tag) =>
      (tag.name || "").toLowerCase().includes((debouncedSearchTerm || "").toLowerCase())
    ),
    [tags, debouncedSearchTerm]
  );

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          All Popular Tags
        </h2>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            Add New Popular Tag
          </button>

          <input
            type="text"
            placeholder="Search Tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 transition w-64 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm bg-white/80 backdrop-blur-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100/60 backdrop-blur-xl">
              {[
                "Tag ID",
                "Tag Name",
                "Description",
                "Usage Count",
                "Created",
                "Updated",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-4 px-6 font-semibold text-gray-700 border-b text-sm"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag, index) => (
                <tr
                  key={tag.id}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                  } hover:bg-blue-50/80 hover:shadow-sm hover:-translate-y-[1px]`}
                >
                  <td className="py-4 px-6 text-gray-900 font-semibold">
                    {tag.id}
                  </td>
                  <td className="py-4 px-6 text-gray-800">{tag.name}</td>
                  <td className="py-4 px-6 text-gray-700 text-sm">
                    {tag.description || "-"}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {tag.usage_count || 0}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(tag.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(tag.updated_at).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setEditingId(tag.id);
                          setEditName(tag.name);
                          setEditDescription(tag.description || "");
                          setEditUsageCount(String(tag.usage_count || 0));
                        }}
                        className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <FaEdit size={15} />
                      </button>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <FaTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500 italic bg-gray-50"
                >
                  No tags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD TAG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Popular Tag
            </h3>

            <input
              type="text"
              placeholder="Tag Name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <textarea
              placeholder="Description (optional)"
              value={newTagDescription}
              onChange={(e) => setNewTagDescription(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows={3}
            />

            <input
              type="number"
              placeholder="Usage Count (optional)"
              value={newTagUsageCount}
              onChange={(e) => setNewTagUsageCount(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              min="0"
            />

            <div className="flex gap-4">
              <button
                onClick={addTag}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Add Tag
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTagName("");
                  setNewTagDescription("");
                  setNewTagUsageCount("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TAG MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Popular Tag
            </h3>

            <input
              type="text"
              placeholder="Tag Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <textarea
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows={3}
            />

            <input
              type="number"
              placeholder="Usage Count (optional)"
              value={editUsageCount}
              onChange={(e) => setEditUsageCount(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              min="0"
            />

            <div className="flex gap-4">
              <button
                onClick={() => updateTag(editingId)}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
