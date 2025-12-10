"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";

// Outer card
function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-200 mb-8">
      {children}
    </div>
  );
}

// Inner gray card
function InnerCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
      {children}
    </div>
  );
}

export default function ForCorporateSectionPage() {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  return (
    <PageCard>
      <div className="w-full">
        {/* MAIN PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6">Corporate Section</h1>

        <PageCard>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Hero Section
          </h2>

          <InnerCard>
            {/* TITLE HEADING */}
            <label className="block mb-2 font-semibold text-gray-600">
              Title Heading <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              defaultValue="<h2>For Corporates</h2>"
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6
                     focus:ring focus:ring-blue-200"
            />

            {/* DESCRIPTION */}
            <label className="block mb-2 font-semibold text-gray-600">
              Description <span className="text-red-500">*</span>
            </label>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
              <textarea
                rows={8}
                defaultValue={`Urna facilisis porttitor risus, erat aptent aliquam. Pellentesque quisque curae imperdiet mi accumsan mauris curabitur nibh...`}
                className="w-full focus:outline-none text-gray-700 resize-none"
              />
            </div>

            {/* IMAGE UPLOAD CARD */}
            <InnerCard>
              <label className="block mb-3 font-semibold text-gray-600">
                Select Banner Image
              </label>

              <div className="flex items-center gap-6">
                {/* Upload Button */}
                <label
                  className="flex items-center gap-2 bg-blue-800 text-white
                                px-5 py-3 rounded-lg shadow cursor-pointer
                                hover:bg-blue-700 transition"
                >
                  <FiUploadCloud size={20} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {bannerPreview && (
                  <div className="border border-gray-300 rounded-lg w-28 h-28 bg-white shadow flex items-center justify-center">
                    <Image
                      src={bannerPreview}
                      width={100}
                      height={100}
                      alt="Preview"
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </InnerCard>
          </InnerCard>
        </PageCard>
        {/* SUBMIT BUTTON RIGHT */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold
                       shadow hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </PageCard>
  );
}
