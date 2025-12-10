"use client";

// import { useState, ChangeEvent } from "react";
import{ ReactNode } from "react";
// import Image from "next/image";
// import { FiUploadCloud } from "react-icons/fi";

// OUTER WHITE CARD
function PageCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 mb-8">
      {children}
    </div>
  );
}

// INNER GREY CARD
function InnerCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
      {children}
    </div>
  );
}

export default function JobAssistanceProgramPage() {
  // const [preview, setPreview] = useState<any>({});

  // const handleUpload = (e: ChangeEvent<HTMLInputElement>, key: string) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreview((prev: any) => ({
  //       ...prev,
  //       [key]: URL.createObjectURL(file),
  //     }));
  //   }
  // };

  const programList = [
    {
      id: 1,
      title: "Course Completion",
      desc: "Get hands on training from experts",
    },
    { id: 2, title: "Quizzes", desc: "Know where you stand in mastering" },
    {
      id: 3,
      title: "Mock Interview",
      desc: "Experience real time interviews with SMEs",
    },
    {
      id: 4,
      title: "Skillvedika Rating",
      desc: "Understand your learning performance through SV score",
    },
    {
      id: 5,
      title: "Resume Building",
      desc: "Build your portfolio with our experts assistance",
    },
    {
      id: 6,
      title: "Marketing Profile",
      desc: "Take advantage of Skill Vedika marketing your skills",
    },
  ];

  return (
    <PageCard>
      <div className="w-full">
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-8">
          Job Assistance Program Section
        </h1>

        {/* ================================================= */}
        {/*                HERO SECTION CARD                  */}
        {/* ================================================= */}

        <PageCard>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Hero Section
          </h2>

          <InnerCard>
            <label className="font-semibold block mb-2 text-gray-600">
              Title Heading <span className="text-red-500 ">*</span>
            </label>
            <input
              type="text"
              defaultValue="Job Assistance <span>Program</span>"
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

            <label className="font-semibold block mb-2 text-gray-600">
              Title Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              defaultValue="We take pride in being part of 5 lakh plus career transitions worldwide"
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
            />

          </InnerCard>
        </PageCard>

        {/* ================================================= */}
        {/*              PROGRAM LIST CARDS                   */}
        {/* ================================================= */}

        {programList.map((p) => (
          <PageCard key={p.id}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Job Assistance Program {p.id}
            </h2>

            <InnerCard>
              <label className="font-semibold block mb-2 text-gray-600">
                Program Title
              </label>
              <input
                type="text"
                defaultValue={p.title}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
              />

              <label className="font-semibold block mb-2 text-gray-600">
                Program Description
              </label>
              <textarea
                rows={3}
                defaultValue={p.desc}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm mb-6"
              />

              {/* <InnerCard>
                <label className="font-semibold block mb-3 text-gray-600">
                  Select Icon Image
                </label>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 bg-blue-800 text-white px-5 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                    <FiUploadCloud size={20} />
                    Choose Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, `program_${p.id}`)}
                    />
                  </label>

                  {preview[`program_${p.id}`] && (
                    <Image
                      src={preview[`program_${p.id}`]}
                      width={120}
                      height={120}
                      alt="preview"
                      className="rounded-lg border shadow object-cover"
                    />
                  )}
                </div>
              </InnerCard> */}
            </InnerCard>
          </PageCard>
        ))}

        {/* SUBMIT BUTTON – RIGHT SIDE */}
        <div className="flex justify-end mt-8">
          <button className="bg-blue-800 text-white px-10 py-3 rounded-lg shadow hover:bg-blue-700 transition font-semibold">
            Submit
          </button>
        </div>
      </div>
    </PageCard>
  );
}
