"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function BecomeInstructorPage() {
  const [heading, setHeading] = useState("Become Instructor at <span>Skill Vedika</span>");
  const [content, setContent] = useState(
    "You want to join as instructor and join the wonderful team!"
  );
  const [banner, setBanner] = useState("/default-uploads/instructor-banner.png");
  const [formTitle, setFormTitle] = useState("<h2>Join <span>Our Team</span></h2>");

  const handleSubmit = () => {
    alert("Saved Successfully!");
    console.log({ heading, content, banner, formTitle });
  };

  return (
    <section
      className="bg-white p-8 rounded-2xl shadow-sm"
      style={{ border: "1px solid rgba(16, 24, 40, 0.08)" }}
    >
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Become An Instructor Page
      </h1>

      <div className="space-y-10">

        {/* HERO SECTION */}
        <div
          className="bg-gray-50 p-6 rounded-xl space-y-5 shadow-sm"
          style={{ border: "1px solid rgba(16, 24, 40, 0.08)" }}
        >
          <h2 className="text-lg font-semibold text-gray-700">
            Hero Section
          </h2>

          {/* Page Heading */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">
              Page Heading*
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Page Content */}
          <div>
            <label className="text-gray-600 font-semibold mb-1 block">
              Page Content*
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Banner Image */}
          <div>
            <label className="text-gray-600 font-semibold mb-2 block">
              Select Banner Image
            </label>

            <div className="flex items-center gap-4">
              <label className="px-4 py-2 bg-blue-800 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center gap-2">
                <FiUploadCloud size={18} />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setBanner(URL.createObjectURL(file));
                  }}
                />
              </label>

              <img
                src={banner}
                className="h-16 w-16 rounded-lg object-cover border border-gray-300"
                alt="Preview"
              />
            </div>
          </div>
        </div>

        {/* FORM SECTION TITLE */}
        <div
          className="bg-gray-50 p-6 rounded-xl space-y-5 shadow-sm"
          style={{ border: "1px solid rgba(16, 24, 40, 0.08)" }}
        >
          <h2 className="text-lg font-semibold text-gray-800">Form Section Title</h2>

          <div>
            <label className="text-gray-700 font-semibold mb-1 block">
              Form Section Title*
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}
