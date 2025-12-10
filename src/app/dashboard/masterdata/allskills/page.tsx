"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const API = "http://127.0.0.1:8000/api/skills";

export default function AllSkills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  // Fetch skills
  async function fetchSkills() {
    try {
      const res = await fetch(API, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.body)) {
        items = data.body;
      } else if (data && typeof data.body === "object") {
        items = [data.body];
      } else if (data && Array.isArray(data.data)) {
        items = data.data;
      }

      setSkills(items);
    } catch (err) {
      console.error("Failed to load skills:", err);
      toast.error("Failed to load skills.");
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  // (fetchSkills moved above to avoid hoisting issue)

  // Add skill
  const addSkill = async () => {
    if (!newSkillName.trim()) return toast.error("Skill name is required.");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: newSkillName,
          description: newSkillDescription,
          category: newSkillCategory,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        return toast.error(json.errors?.name?.[0] || "Failed to add skill.");
      }

      const { skill } = await res.json();
      setSkills([skill, ...skills]);
      setNewSkillName("");
      setNewSkillDescription("");
      setNewSkillCategory("");
      setIsModalOpen(false);
      toast.success("Skill added successfully!");
    } catch (err) {
      toast.error("Error adding skill.");
    }
  };

  // Update skill
  const updateSkill = async (id) => {
    if (!editName.trim()) return toast.error("Skill name is required.");

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          category: editCategory,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        return toast.error(json.errors?.name?.[0] || "Failed to update skill.");
      }

      const { skill } = await res.json();
      setSkills(skills.map((s) => (s.id === id ? skill : s)));
      setEditingId(null);
      toast.success("Skill updated successfully!");
    } catch (err) {
      toast.error("Error updating skill.");
    }
  };

  // Delete skill
  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return toast.error("Failed to delete skill.");

      setSkills(skills.filter((s) => s.id !== id));
      toast.success("Skill deleted successfully!");
    } catch (err) {
      toast.error("Error deleting skill.");
    }
  };

  const filteredSkills = Array.isArray(skills)
    ? skills.filter((skill) =>
        (skill && skill.name ? skill.name.toLowerCase() : "").includes(
          searchTerm.toLowerCase()
        )
      )
    : [];

  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
      <Toaster />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          All Skills
        </h2>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            Add New Skill
          </button>

          <input
            type="text"
            placeholder="Search skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm bg-white w-64 focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm bg-white/80 backdrop-blur-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100/60 backdrop-blur-xl">
              {[
                "Skill ID",
                "Skill Name",
                "Category",
                "Created",
                "Updated",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="py-4 px-6 font-semibold text-gray-700 border-b"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill, index) => (
                <tr
                  key={skill.id}
                  className={`transition-all ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                  } hover:bg-blue-50/70 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-[1px] duration-200`}
                >
                  <td className="py-4 px-6 text-gray-900 font-semibold">
                    {skill.id}
                  </td>
                  <td className="py-4 px-6 text-gray-800">{skill.name}</td>
                  <td className="py-4 px-6 text-gray-700">
                    {skill.category || "-"}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(skill.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(skill.updated_at).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          setEditingId(skill.id);
                          setEditName(skill.name);
                          setEditDescription(skill.description || "");
                          setEditCategory(skill.category || "");
                        }}
                        className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <FaEdit size={15} />
                      </button>

                      <button
                        onClick={() => deleteSkill(skill.id)}
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
                  colSpan={6}
                  className="py-8 text-center text-gray-500 italic bg-gray-50"
                >
                  No skills found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD SKILL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Skill
            </h3>

            <input
              type="text"
              placeholder="Skill Name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <textarea
              placeholder="Description (optional)"
              value={newSkillDescription}
              onChange={(e) => setNewSkillDescription(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows="3"
            />

            <input
              type="text"
              placeholder="Category (optional)"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <div className="flex gap-4">
              <button
                onClick={addSkill}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Add Skill
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewSkillName("");
                  setNewSkillDescription("");
                  setNewSkillCategory("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SKILL MODAL */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Skill
            </h3>

            <input
              type="text"
              placeholder="Skill Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <textarea
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows="3"
            />

            <input
              type="text"
              placeholder="Category (optional)"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            <div className="flex gap-4">
              <button
                onClick={() => updateSkill(editingId)}
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
