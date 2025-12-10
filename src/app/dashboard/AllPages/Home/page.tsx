// "use client";

// import { useState } from "react";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FiUploadCloud } from "react-icons/fi";
// import {
//   AdminCard,
//   AdminInput,
//   AdminTextarea,
//   BannerBox,
// } from "../CorporateTraining/components/AdminUI";


// /* =========================================================
//    MAIN PAGE COMPONENT
// ========================================================= */
// export default function HomepageDetails() {
//   /* ----------------------- STATE ----------------------- */
//   const [reviews, setReviews] = useState([
//     "Great course! Learned a lot and the instructor was very clear.",
//     "Very helpful content. Enjoyed the learning experience!",
//     "Excellent experience. Would definitely recommend to others.",
//   ]);

//   const [openIndex, setOpenIndex] = useState(null);

//   const [heroHeading, setHeroHeading] = useState(
//     "Master In-Demand Skills with India’s Top Trainers"
//   );
//   const [heroContent, setHeroContent] = useState(
//     "Upskill in SAP, Snowflake, Data Science, AI, Cloud & more. Flexible schedules. Real projects. Job-ready programs."
//   );

//   const [popularContent, setPopularContent] = useState(
//     "Upskill in SAP, Snowflake, Data Science, AI, Cloud & more."
//   );
//   const [heroBanner, setHeroBanner] = useState("/default-uploads/banner1.png");

//   const [getStartedHeading, setGetStartedHeading] = useState(
//     "Ready to start building your career?"
//   );

//   const [getJobAssistanceProgramHeading, setJobAssistanceProgramHeading] = useState(
//     "Job Assistance Programme"
//   );

//   const [getJobAssistanceProgramContent, setJobAssistanceProgramContent] = useState(
//     "We take pride in part of 5 lakh plus career transitions worldwide"
//   );

//    const [ jobAssistance1, setJobAssistance1] = useState(
//     "Course Completion"
//   );

//   const [ jobAssistance2, setJobAssistance2] = useState(
//     "Quizzes"
//   );

//   const [ jobAssistance3, setJobAssistance3] = useState(
//     "Mock Interviews"
//   );

//   const [ jobAssistance4, setJobAssistance4] = useState(
//     "Resume Building"
//   );            

//   const [ jobAssistance5, setJobAssistance5] = useState(
//     "Rating"
//   );
  
//   const [ jobAssistance6, setJobAssistance6] = useState(
//     "Profile Marketing"
//   );

//   const [ getJobAssistance1Content, setJobAssistance1Content] = useState(
//     "Get hands-on training from experts"
//   );

//   const [ getJobAssistance2Content, setJobAssistance2Content] = useState(
//     "Know where you stand in mastering"
//   );

//   const [ getJobAssistance3Content, setJobAssistance3Content] = useState(
//     "Experience real-time interviews with SMEs"
//   );

//   const [ getJobAssistance4Content, setJobAssistance4Content] = useState(
//     "Build your portfolio with our experts' assistance"
//   );

//   const [ getJobAssistance5Content, setJobAssistance5Content] = useState(
//     "Understand your learning performance through SV score"
//   );

//   const [ getJobAssistance6Content, setJobAssistance6Content] = useState(
//     "Take advantage of Skill Vedika marketing your skills"
//   );    

//   const [keyFeaturedContent, setKeyFeaturedContent] = useState(
//     "We believe in delivering top-tier technology training enriched with essential features to create an outstanding and immersive learning experience."
//   );

//   const [ featuredPoint1, setFeaturedPoint1] = useState(
//     "Industry standard curriculum"
//   );

//   const [ featuredPoint2, setFeaturedPoint2] = useState(
//     "Official certification guidance"
//   );

//   const [ featuredPoint3, setFeaturedPoint3] = useState(
//     "Flexible schedules"
//   );
  
//   const [ featuredPoint4, setFeaturedPoint4] = useState(
//     "Real world projects"
//   );

//   const [homeSectionHeading, setHomeSectionHeading] = useState(
//     "Explore Skills for a Changing World"
//   );
//   const [homeSectionContent, setHomeSectionContent] = useState(
//     "Choose an upskilling program aligned with your passion and goals."
//   );

//   const [jobSupportHeading, setJobSupportHeading  ] = useState(
//     "Job Programme Support"
//   );

//   const [getJobSupportContent, setJobSupportContent] = useState(
//     "Our Job Support Program is designed to assist you in your job search journey by providing personalized guidance, resume building, interview preparation, and access to a network of industry professionals to help you secure your desired job."
//   );

//   const [gettime1Heading, setTime1Heading] = useState(
//     "Hourly"
//   );

//   const [gettime2Heading, setTime2Heading] = useState(
//     "Weekly"
//   );

//   const [gettime3Heading, setTime3Heading] = useState(
//     "Monthly"
//   );

//   const [getbuttonHeading, setButtonHeading] = useState(
//     "Contact Us"
//   );

//   const [getbuttonLink, setButtonLink] = useState(
//     "www.skillvedika.com/contact"
//   );

//   const [blogHeading, setBlogHeading] = useState("Our Recent Blog");
//   // const [learnersHeading, setLearnersHeading] = useState(
//   //   "Hear From Our Learners"
//   // );

//   /* ----------------------- REVIEW LOGIC ----------------------- */
//   // const toggleAccordion = (index) => {
//   //   setOpenIndex((prev) => (prev === index ? null : index));
//   // };

//   // const updateReview = (index, value) => {
//   //   const temp = [...reviews];
//   //   temp[index] = value;
//   //   setReviews(temp);
//   // };

//   // const addReview = () => {
//   //   setReviews((prev) => [...prev, ""]);
//   //   setOpenIndex(reviews.length);
//   // };

//   // const removeReview = (index) => {
//   //   const updated = reviews.filter((_, i) => i !== index);
//   //   setReviews(updated);
//   //   setOpenIndex(null);
//   // };

//   /* ----------------------- UI ----------------------- */
//   return (
//     <section
//       className="bg-white p-8 rounded-2xl shadow-sm"
//       style={{ border: "1px solid rgba(16,24,40,0.08)" }}
//     >
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">
//         Homepage Details
//       </h1>

//       <div className="space-y-10">
//         {/* HERO SECTION */}
//         <AdminCard title="Hero Section">
//           <AdminInput
//             label="Title Heading"
//             value={heroHeading}
//             onChange={setHeroHeading}
//           />

//           <AdminTextarea
//             label="Title Content"
//             value={heroContent}
//             onChange={setHeroContent}
//           />

//           <AdminTextarea
//             label="Popular Content"
//             value={popularContent}
//             onChange={setPopularContent}
//           />

//           <BannerBox
//             label="Hero Banner"
//             image={heroBanner}
//             onUpload={(url) => setHeroBanner(url)}
//           />
//         </AdminCard>

//         {/* EXPLORE SECTION */}
//         <AdminCard title="Home Explore Section">
//           <AdminInput
//             label="Title Heading"
//             value={homeSectionHeading}
//             onChange={setHomeSectionHeading}
//           />

//           <AdminTextarea
//             label="Content"
//             value={homeSectionContent}
//             onChange={setHomeSectionContent}
//           />

//           <div className="space-y-3">
//             <label className="block text-gray-700 font-medium mb-1">Tabs</label>
//             {["Trending", "Popular", "Free"].map((t, i) => (
//               <input
//                 key={i}
//                 defaultValue={t}
//                 className="w-full px-4 py-2 rounded-lg border border-gray-300"
//               />
//             ))}
//           </div>
//         </AdminCard>

//         {/* KEY FEATURED */}
//         <AdminCard title="Key Featured Section">
//           <AdminInput
//             label="Heading"
//             value={getStartedHeading}
//             onChange={setGetStartedHeading}
//           />

//           <AdminTextarea
//             label="Content"
//             value={keyFeaturedContent}
//             onChange={setKeyFeaturedContent}
//           />


//           <AdminInput
//             label="Feature Point 1"
//             value={featuredPoint1}
//             onChange={setFeaturedPoint1}
//           />

//           <AdminInput
//             label="Feature Point 2"
//             value={featuredPoint2}
//             onChange={setFeaturedPoint2}
//           />

//           <AdminInput
//             label="Feature Point 3"
//             value={featuredPoint3}
//             onChange={setFeaturedPoint3}
//           />

//           <AdminInput
//             label="Feature Point 4"
//             value={featuredPoint4}
//             onChange={setFeaturedPoint4}
//           />
//         </AdminCard>

//          <AdminCard title="Job Assistance Program Section">
//           <AdminInput
//             label="Heading"
//             value={getJobAssistanceProgramHeading}
//             onChange={setJobAssistanceProgramHeading}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistanceProgramContent}
//             onChange={setJobAssistanceProgramContent}
//           />

//           <AdminInput
//             label="Job Assistance 1"
//             value={jobAssistance1}
//             onChange={setJobAssistance1}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance1Content}
//             onChange={setJobAssistance1Content}
//           />

//           <AdminInput
//             label="Job Assistance 2"
//             value={jobAssistance2}
//             onChange={setJobAssistance2}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance2Content}
//             onChange={setJobAssistance2Content}
//           />

//           <AdminInput
//             label="Job Assistance 3"
//             value={jobAssistance3}
//             onChange={setJobAssistance3}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance3Content}
//             onChange={setJobAssistance3Content}
//           />

//           <AdminInput
//             label="Job Assistance 4"
//             value={jobAssistance4}
//             onChange={setJobAssistance4}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance4Content}
//             onChange={setJobAssistance4Content}
//           />

//           <AdminInput
//             label="Job Assistance 5"
//             value={jobAssistance5}
//             onChange={setJobAssistance5}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance5Content}
//             onChange={setJobAssistance5Content}
//           />

//           <AdminInput
//             label="Job Assistance 6"
//             value={jobAssistance6}
//             onChange={setJobAssistance6}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobAssistance6Content}
//             onChange={setJobAssistance6Content}
//           />
//         </AdminCard>

//         <AdminCard title="Job Support Program">
//           <AdminCard title="">
//             <AdminInput
//             label="Title Heading"
//             value={jobSupportHeading}
//             onChange={setJobSupportHeading}
//           />

//           <AdminTextarea
//             label="Content"
//             value={getJobSupportContent}
//             onChange={setJobSupportContent}
//           />
//           </AdminCard>

//           <AdminCard title="Payment Types">
//             <AdminInput
//             label="Time1"
//             value={gettime1Heading}
//             onChange={setTime1Heading}
//           />

//           <AdminInput
//             label="Time2"
//             value={gettime2Heading}
//             onChange={setTime2Heading}
//           />

//           <AdminInput
//             label="Time3"
//             value={gettime3Heading}
//             onChange={setTime3Heading}
//           />
//           </AdminCard>
          

//           <AdminInput
//             label="Button Heading"
//             value={getbuttonHeading}
//             onChange={setButtonHeading}
//           />

//           <AdminInput
//             label="Button Link"
//             value={getbuttonLink}
//             onChange={setButtonLink}
//           />
//         </AdminCard>


//         {/* BLOG SECTION */}
//         <AdminCard title="Blog Section">
//           <AdminInput
//             label="Blog Heading"
//             value={blogHeading}
//             onChange={setBlogHeading}
//           />
//         </AdminCard>

//         {/* LEARNERS SECTION */}
//         {/* <AdminCard title="Hear From Our Learners">
//           <AdminInput
//             label="Title Heading"
//             value={learnersHeading}
//             onChange={setLearnersHeading}
//           />
//         </AdminCard> */}

//         {/* REVIEWS */}
//         {/* <AdminCard title="Learner Reviews">
//           <div className="space-y-4">
//             {reviews.map((review, index) => (
//               <ReviewItem
//                 key={index}
//                 index={index}
//                 review={review}
//                 openIndex={openIndex}
//                 toggleAccordion={toggleAccordion}
//                 updateReview={updateReview}
//                 removeReview={removeReview}
//               />
//             ))}
//           </div>

//           <button
//             onClick={addReview}
//             className="mt-3 px-4 py-2 bg-blue-800 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition"
//           >
//             Add Review
//           </button>
//         </AdminCard> */}

//         {/* SUBMIT */}
//         <div className="flex justify-end">
//           <button className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm">
//             Submit
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* =========================================================
//    REUSABLE COMPONENTS
// ========================================================= */

// // function AdminCard({ title, children }) {  
// //   return (
// //     <div
// //       className="bg-gray-50 p-6 rounded-xl space-y-5"
// //       style={{ border: "1px solid rgba(16,24,40,0.08)" }}
// //     >
// //       <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
// //       {children}
// //     </div>
// //   );
// // }

// // function AdminInput({ label, value, onChange }) {
// //   return (
// //     <div>
// //       <label className="text-gray-700 font-semibold mb-1 block">{label}</label>
// //       <input
// //         type="text"
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className="w-full px-4 py-2 rounded-lg border border-gray-300"
// //       />
// //     </div>
// //   );
// // }

// // function AdminTextarea({ label, value, onChange }) {
// //   return (
// //     <div>
// //       <label className="text-gray-700 font-semibold mb-1 block">{label}</label>
// //       <textarea
// //         rows={3}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className="w-full px-4 py-2 rounded-lg border border-gray-300"
// //       />
// //     </div>
// //   );
// // }

// // /* -------- BANNER UPLOAD COMPONENT -------- */
// // function BannerBox({ label, image, onUpload }) {
// //   return (
// //     <div
// //       className="p-4 rounded-xl bg-white"
// //       style={{ border: "1px solid rgba(16,24,40,0.08)" }}
// //     >
// //       <label className="block text-gray-700 font-semibold mb-2">{label}</label>

// //       <div className="flex items-center gap-4">
// //         <label className="px-4 py-2 bg-blue-800 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center gap-2">
// //           <FiUploadCloud size={18} />
// //           Upload Image
// //           <input
// //             type="file"
// //             accept="image/*"
// //             className="hidden"
// //             onChange={(e) => {
// //               const file = e.target.files?.[0];
// //               if (file) onUpload(URL.createObjectURL(file));
// //             }}
// //           />
// //         </label>

// //         <img
// //           src={image}
// //           className="h-16 w-16 rounded-lg object-cover border"
// //           alt="Preview"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// /* -------- SINGLE REVIEW ITEM -------- */
// // function ReviewItem({
// //   index,
// //   review,
// //   openIndex,
// //   toggleAccordion,
// //   updateReview,
// //   removeReview,
// // }) {
// //   return (
// //     <div
// //       className="border rounded-xl bg-gray-50"
// //       style={{ border: "1px solid rgba(16,24,40,0.08)" }}
// //     >
// //       <button
// //         onClick={() => toggleAccordion(index)}
// //         className="w-full flex justify-between px-4 py-3 text-gray-800"
// //       >
// //         Review {index + 1}
// //         {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
// //       </button>

// //       {openIndex === index && (
// //         <div className="p-4 border-t border-gray-200 bg-white">
// //           <textarea
// //             rows={3}
// //             value={review}
// //             onChange={(e) => updateReview(index, e.target.value)}
// //             className="w-full px-4 py-2 rounded-lg border border-gray-300"
// //           />
// //           <button
// //             onClick={() => removeReview(index)}
// //             className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
// //           >
// //             Remove
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // } 








"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AdminCard, AdminInput, AdminTextarea, BannerBox } from "../CorporateTraining/components/AdminUI";
import { uploadToCloudinary } from "@/services/cloudinaryUpload";

const API_URL = "http://127.0.0.1:8000/api";

export default function HomepageDetails() {
  const [isSaving, setIsSaving] = useState(false);

  /* ========================= STATES ========================= */

  // HERO
  const [heroHeading, setHeroHeading] = useState("");
  const [heroContent, setHeroContent] = useState("");
  const [popularContent, setPopularContent] = useState("");
  const [heroBanner, setHeroBanner] = useState("");

  // EXPLORE
  const [homeSectionHeading, setHomeSectionHeading] = useState("");
  const [homeSectionContent, setHomeSectionContent] = useState("");
  const [exploreTabs, setExploreTabs] = useState(["Trending", "Popular", "Free"]);

  // KEY FEATURES
  const [getStartedHeading, setGetStartedHeading] = useState("");
  const [keyFeaturedContent, setKeyFeaturedContent] = useState("");
  const [featuredPoint1, setFeaturedPoint1] = useState("");
  const [featuredPoint2, setFeaturedPoint2] = useState("");
  const [featuredPoint3, setFeaturedPoint3] = useState("");
  const [featuredPoint4, setFeaturedPoint4] = useState("");

  // JOB ASSISTANCE
  const [jobAssistanceHeading, setJobAssistanceHeading] = useState("");
  const [jobAssistanceContent, setJobAssistanceContent] = useState("");

  const [job1Title, setJob1Title] = useState("");
  const [job1Content, setJob1Content] = useState("");

  const [job2Title, setJob2Title] = useState("");
  const [job2Content, setJob2Content] = useState("");

  const [job3Title, setJob3Title] = useState("");
  const [job3Content, setJob3Content] = useState("");

  const [job4Title, setJob4Title] = useState("");
  const [job4Content, setJob4Content] = useState("");

  const [job5Title, setJob5Title] = useState("");
  const [job5Content, setJob5Content] = useState("");

  const [job6Title, setJob6Title] = useState("");
  const [job6Content, setJob6Content] = useState("");

  // JOB SUPPORT
  const [jobSupportTitle, setJobSupportTitle] = useState("");
  const [jobSupportContent, setJobSupportContent] = useState("");
  const [payment1, setPayment1] = useState("Hourly");
  const [payment2, setPayment2] = useState("Weekly");
  const [payment3, setPayment3] = useState("Monthly");
  const [buttonHeading, setButtonHeading] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  // BLOG
  const [blogHeading, setBlogHeading] = useState("");

  /* ========================= FETCH EXISTING DATA ========================= */
  useEffect(() => {
    fetch(`${API_URL}/homepage`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        // HERO
        setHeroHeading(data.hero_heading || "");
        setHeroContent((data.hero_content?.join("\n")) || "");
        setPopularContent((data.hero_popular?.join("\n")) || "");
        setHeroBanner(data.hero_image || "");

        // EXPLORE
        setHomeSectionHeading(data.explore_heading || "");
        setHomeSectionContent(data.explore_content || "");
        setExploreTabs(data.explore_tabs || ["Trending", "Popular", "Free"]);

        // KEY FEATURES
        setGetStartedHeading(data.key_features_title || "");
        setKeyFeaturedContent(data.key_features_content || "");

        if (data.key_features_points) {
          setFeaturedPoint1(data.key_features_points[0] || "");
          setFeaturedPoint2(data.key_features_points[1] || "");
          setFeaturedPoint3(data.key_features_points[2] || "");
          setFeaturedPoint4(data.key_features_points[3] || "");
        }

        // JOB ASSISTANCE
        setJobAssistanceHeading(data.job_assistance_heading || "");
        setJobAssistanceContent(data.job_assistance_content || "");

        if (data.job_assistance_points) {
          setJob1Title(data.job_assistance_points[0]?.title || "");
          setJob1Content(data.job_assistance_points[0]?.content || "");

          setJob2Title(data.job_assistance_points[1]?.title || "");
          setJob2Content(data.job_assistance_points[1]?.content || "");

          setJob3Title(data.job_assistance_points[2]?.title || "");
          setJob3Content(data.job_assistance_points[2]?.content || "");

          setJob4Title(data.job_assistance_points[3]?.title || "");
          setJob4Content(data.job_assistance_points[3]?.content || "");

          setJob5Title(data.job_assistance_points[4]?.title || "");
          setJob5Content(data.job_assistance_points[4]?.content || "");

          setJob6Title(data.job_assistance_points[5]?.title || "");
          setJob6Content(data.job_assistance_points[5]?.content || "");
        }

        // JOB SUPPORT
        setJobSupportTitle(data.job_support_title || "");
        setJobSupportContent(data.job_support_content || "");

        if (data.job_support_payment_types) {
          setPayment1(data.job_support_payment_types[0] || "");
          setPayment2(data.job_support_payment_types[1] || "");
          setPayment3(data.job_support_payment_types[2] || "");
        }

        setButtonHeading(data.job_support_button || "");
        setButtonLink(data.job_support_button_link || "");

        // BLOG
        setBlogHeading(data.blog_section_heading || "");
      });
  }, []);

  /* ========================= SAVE HOMEPAGE ========================= */
  async function saveHomepage() {
    setIsSaving(true);

    const heroContentArray = heroContent.split("\n").filter((x) => x.trim() !== "");
    const popularContentArray = popularContent.split("\n").filter((x) => x.trim() !== "");

    const jobAssistanceArray = [
      { title: job1Title, content: job1Content },
      { title: job2Title, content: job2Content },
      { title: job3Title, content: job3Content },
      { title: job4Title, content: job4Content },
      { title: job5Title, content: job5Content },
      { title: job6Title, content: job6Content },
    ];

    const payload = {
      hero_heading: heroHeading,
      hero_content: heroContentArray,
      hero_popular: popularContentArray,
      hero_image: heroBanner,

      explore_heading: homeSectionHeading,
      explore_content: homeSectionContent,
      explore_tabs: exploreTabs,

      key_features_title: getStartedHeading,
      key_features_content: keyFeaturedContent,
      key_features_points: [
        featuredPoint1,
        featuredPoint2,
        featuredPoint3,
        featuredPoint4,
      ],

      job_assistance_heading: jobAssistanceHeading,
      job_assistance_content: jobAssistanceContent,
      job_assistance_points: jobAssistanceArray,

      job_support_title: jobSupportTitle,
      job_support_content: jobSupportContent,
      job_support_payment_types: [payment1, payment2, payment3],
      job_support_button: buttonHeading,
      job_support_button_link: buttonLink,

      blog_section_heading: blogHeading,
    };

    const res = await fetch(`${API_URL}/homepage/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setIsSaving(false);

    if (res.ok) {
      toast.success("Homepage Updated Successfully!");
    } else {
      toast.error(result.message || "Failed to update.");
    }
  }

  /* ========================= UI ========================= */
  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Homepage Details</h1>

      <div className="space-y-10">

        {/* HERO SECTION */}
        <AdminCard title="Hero Section">
          <AdminInput label="Heading" value={heroHeading} onChange={setHeroHeading} />
          <AdminTextarea label="Content (multi-line)" value={heroContent} onChange={setHeroContent} />
          <AdminTextarea label="Popular Content (multi-line)" value={popularContent} onChange={setPopularContent} />

          <BannerBox
            label="Hero Banner"
            image={heroBanner}
            onUpload={async (file) => {
              const url = await uploadToCloudinary(file);
              setHeroBanner(url);
            }}
          />
        </AdminCard>

        {/* EXPLORE SECTION */}
        <AdminCard title="Home Explore Section">
          <AdminInput label="Heading" value={homeSectionHeading} onChange={setHomeSectionHeading} />
          <AdminTextarea label="Content" value={homeSectionContent} onChange={setHomeSectionContent} />

          <label className="block text-gray-700 font-medium mb-1">Tabs</label>
          {exploreTabs.map((tab, i) => (
            <input
              key={i}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2"
              value={exploreTabs[i]}
              onChange={(e) => {
                const updated = [...exploreTabs];
                updated[i] = e.target.value;
                setExploreTabs(updated);
              }}
            />
          ))}
        </AdminCard>

        {/* KEY FEATURES */}
        <AdminCard title="Key Features Section">
          <AdminInput label="Heading" value={getStartedHeading} onChange={setGetStartedHeading} />
          <AdminTextarea label="Content" value={keyFeaturedContent} onChange={setKeyFeaturedContent} />

          <AdminInput label="Feature 1" value={featuredPoint1} onChange={setFeaturedPoint1} />
          <AdminInput label="Feature 2" value={featuredPoint2} onChange={setFeaturedPoint2} />
          <AdminInput label="Feature 3" value={featuredPoint3} onChange={setFeaturedPoint3} />
          <AdminInput label="Feature 4" value={featuredPoint4} onChange={setFeaturedPoint4} />
        </AdminCard>

        {/* JOB ASSISTANCE */}
        <AdminCard title="Job Assistance Program Section">
          <AdminInput label="Heading" value={jobAssistanceHeading} onChange={setJobAssistanceHeading} />
          <AdminTextarea label="Content" value={jobAssistanceContent} onChange={setJobAssistanceContent} />

          <AdminInput label="Job 1 Title" value={job1Title} onChange={setJob1Title} />
          <AdminTextarea label="Job 1 Content" value={job1Content} onChange={setJob1Content} />

          <AdminInput label="Job 2 Title" value={job2Title} onChange={setJob2Title} />
          <AdminTextarea label="Job 2 Content" value={job2Content} onChange={setJob2Content} />

          <AdminInput label="Job 3 Title" value={job3Title} onChange={setJob3Title} />
          <AdminTextarea label="Job 3 Content" value={job3Content} onChange={setJob3Content} />

          <AdminInput label="Job 4 Title" value={job4Title} onChange={setJob4Title} />
          <AdminTextarea label="Job 4 Content" value={job4Content} onChange={setJob4Content} />

          <AdminInput label="Job 5 Title" value={job5Title} onChange={setJob5Title} />
          <AdminTextarea label="Job 5 Content" value={job5Content} onChange={setJob5Content} />

          <AdminInput label="Job 6 Title" value={job6Title} onChange={setJob6Title} />
          <AdminTextarea label="Job 6 Content" value={job6Content} onChange={setJob6Content} />
        </AdminCard>

        {/* JOB SUPPORT */}
        <AdminCard title="Job Support Program">
          <AdminInput label="Title" value={jobSupportTitle} onChange={setJobSupportTitle} />
          <AdminTextarea label="Content" value={jobSupportContent} onChange={setJobSupportContent} />

          <AdminCard title="Payment Types">
            <AdminInput label="Type 1" value={payment1} onChange={setPayment1} />
            <AdminInput label="Type 2" value={payment2} onChange={setPayment2} />
            <AdminInput label="Type 3" value={payment3} onChange={setPayment3} />
          </AdminCard>

          <AdminInput label="Button Heading" value={buttonHeading} onChange={setButtonHeading} />
          <AdminInput label="Button Link" value={buttonLink} onChange={setButtonLink} />
        </AdminCard>

        {/* BLOG SECTION */}
        <AdminCard title="Blog Section">
          <AdminInput label="Blog Heading" value={blogHeading} onChange={setBlogHeading} />
        </AdminCard>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            onClick={saveHomepage}
            className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm"
          >
            {isSaving ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </section>
  );
}
