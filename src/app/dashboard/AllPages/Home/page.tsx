// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { AdminCard, AdminInput, AdminTextarea, BannerBox } from "../CorporateTraining/components/AdminUI";
// import { uploadToCloudinary } from "@/services/cloudinaryUpload";

// export default function HomepageDetails() {
//   const [isSaving, setIsSaving] = useState(false);

//   /* ========================= STATES ========================= */

//   // HERO
//   const [heroHeading, setHeroHeading] = useState("");
//   const [heroContent, setHeroContent] = useState("");
//   const [popularContent, setPopularContent] = useState("");
//   const [heroBanner, setHeroBanner] = useState("");

//   // EXPLORE
//   const [homeSectionHeading, setHomeSectionHeading] = useState("");
//   const [homeSectionContent, setHomeSectionContent] = useState("");
//   const [exploreTabs, setExploreTabs] = useState(["Trending", "Popular", "Free"]);

//   // KEY FEATURES
//   const [getStartedHeading, setGetStartedHeading] = useState("");
//   const [keyFeaturedContent, setKeyFeaturedContent] = useState("");
//   const [featuredPoint1, setFeaturedPoint1] = useState("");
//   const [featuredPoint2, setFeaturedPoint2] = useState("");
//   const [featuredPoint3, setFeaturedPoint3] = useState("");
//   const [featuredPoint4, setFeaturedPoint4] = useState("");

//   // JOB ASSISTANCE
//   const [jobAssistanceHeading, setJobAssistanceHeading] = useState("");
//   const [jobAssistanceContent, setJobAssistanceContent] = useState("");

//   const [job1Title, setJob1Title] = useState("");
//   const [job1Content, setJob1Content] = useState("");

//   const [job2Title, setJob2Title] = useState("");
//   const [job2Content, setJob2Content] = useState("");

//   const [job3Title, setJob3Title] = useState("");
//   const [job3Content, setJob3Content] = useState("");

//   const [job4Title, setJob4Title] = useState("");
//   const [job4Content, setJob4Content] = useState("");

//   const [job5Title, setJob5Title] = useState("");
//   const [job5Content, setJob5Content] = useState("");

//   const [job6Title, setJob6Title] = useState("");
//   const [job6Content, setJob6Content] = useState("");

//   // JOB SUPPORT
//   const [jobSupportTitle, setJobSupportTitle] = useState("");
//   const [jobSupportContent, setJobSupportContent] = useState("");
//   const [payment1, setPayment1] = useState("Hourly");
//   const [payment2, setPayment2] = useState("Weekly");
//   const [payment3, setPayment3] = useState("Monthly");
//   const [buttonHeading, setButtonHeading] = useState("");
//   const [buttonLink, setButtonLink] = useState("");

//   // BLOG
//   const [blogHeading, setBlogHeading] = useState("");

//   // Track whether this is a new record or existing
//   const [isNewRecord, setIsNewRecord] = useState(true);

//   /* ========================= FETCH EXISTING DATA ========================= */
//   useEffect(() => {
//     fetch(`/api/homepage`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data) return;

//         // HERO
//         setHeroHeading(data.hero_heading || "");
//         setHeroContent((data.hero_content?.join("\n")) || "");
//         setPopularContent((data.hero_popular?.join("\n")) || "");
//         setHeroBanner(data.hero_image || "");

//         // EXPLORE
//         setHomeSectionHeading(data.explore_heading || "");
//         setHomeSectionContent(data.explore_content || "");
//         setExploreTabs(data.explore_tabs || ["Trending", "Popular", "Free"]);

//         // KEY FEATURES
//         setGetStartedHeading(data.key_features_title || "");
//         setKeyFeaturedContent(data.key_features_content || "");

//         if (data.key_features_points) {
//           setFeaturedPoint1(data.key_features_points[0] || "");
//           setFeaturedPoint2(data.key_features_points[1] || "");
//           setFeaturedPoint3(data.key_features_points[2] || "");
//           setFeaturedPoint4(data.key_features_points[3] || "");
//         }

//         // JOB ASSISTANCE
//         setJobAssistanceHeading(data.job_assistance_heading || "");
//         setJobAssistanceContent(data.job_assistance_content || "");

//         if (data.job_assistance_points) {
//           setJob1Title(data.job_assistance_points[0]?.title || "");
//           setJob1Content(data.job_assistance_points[0]?.content || "");

//           setJob2Title(data.job_assistance_points[1]?.title || "");
//           setJob2Content(data.job_assistance_points[1]?.content || "");

//           setJob3Title(data.job_assistance_points[2]?.title || "");
//           setJob3Content(data.job_assistance_points[2]?.content || "");

//           setJob4Title(data.job_assistance_points[3]?.title || "");
//           setJob4Content(data.job_assistance_points[3]?.content || "");

//           setJob5Title(data.job_assistance_points[4]?.title || "");
//           setJob5Content(data.job_assistance_points[4]?.content || "");

//           setJob6Title(data.job_assistance_points[5]?.title || "");
//           setJob6Content(data.job_assistance_points[5]?.content || "");
//         }

//         // JOB SUPPORT
//         setJobSupportTitle(data.job_support_title || "");
//         setJobSupportContent(data.job_support_content || "");

//         if (data.job_support_payment_types) {
//           setPayment1(data.job_support_payment_types[0] || "");
//           setPayment2(data.job_support_payment_types[1] || "");
//           setPayment3(data.job_support_payment_types[2] || "");
//         }

//         setButtonHeading(data.job_support_button || "");
//         setButtonLink(data.job_support_button_link || "");

//         // BLOG
//         setBlogHeading(data.blog_section_heading || "");

//         // Track if this is an existing record (has an id)
//         setIsNewRecord(!data?.id);
//       });
//   }, []);

//   /* ========================= SAVE HOMEPAGE ========================= */
//   async function saveHomepage() {
//     setIsSaving(true);

//     const heroContentArray = heroContent.split("\n").filter((x) => x.trim() !== "");
//     const popularContentArray = popularContent.split("\n").filter((x) => x.trim() !== "");

//     const jobAssistanceArray = [
//       { title: job1Title, content: job1Content },
//       { title: job2Title, content: job2Content },
//       { title: job3Title, content: job3Content },
//       { title: job4Title, content: job4Content },
//       { title: job5Title, content: job5Content },
//       { title: job6Title, content: job6Content },
//     ];

//     const payload = {
//       hero_heading: heroHeading,
//       hero_content: heroContentArray,
//       hero_popular: popularContentArray,
//       hero_image: heroBanner,

//       explore_heading: homeSectionHeading,
//       explore_content: homeSectionContent,
//       explore_tabs: exploreTabs,

//       key_features_title: getStartedHeading,
//       key_features_content: keyFeaturedContent,
//       key_features_points: [
//         featuredPoint1,
//         featuredPoint2,
//         featuredPoint3,
//         featuredPoint4,
//       ],

//       job_assistance_heading: jobAssistanceHeading,
//       job_assistance_content: jobAssistanceContent,
//       job_assistance_points: jobAssistanceArray,

//       job_support_title: jobSupportTitle,
//       job_support_content: jobSupportContent,
//       job_support_payment_types: [payment1, payment2, payment3],
//       job_support_button: buttonHeading,
//       job_support_button_link: buttonLink,

//       blog_section_heading: blogHeading,
//     };

//     const res = await fetch(`/api/homepage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     setIsSaving(false);

//     if (res.ok) {
//       const successMsg = isNewRecord ? "Homepage Saved Successfully!" : "Homepage Updated Successfully!";
//       toast.success(successMsg);
//       setIsNewRecord(false); // After saving, it's no longer a new record
//     } else {
//       toast.error(result.message || "Failed to update.");
//     }
//   }

//   /* ========================= UI ========================= */
//   return (
//     <section className="bg-white p-8 rounded-2xl shadow-sm">
//       <h1 className="text-2xl font-bold text-gray-900 mb-8">Homepage Details</h1>

//       <div className="space-y-10">

//         {/* HERO SECTION */}
//         <AdminCard title="Hero Section">
//           <AdminInput label="Heading" value={heroHeading} onChange={setHeroHeading} />
//           <AdminTextarea label="Content (multi-line)" value={heroContent} onChange={setHeroContent} />
//           <AdminTextarea label="Popular Content (multi-line)" value={popularContent} onChange={setPopularContent} />

//           <BannerBox
//             label="Hero Banner"
//             image={heroBanner}
//             onUpload={async (file) => {
//               const url = await uploadToCloudinary(file);
//               setHeroBanner(url);
//             }}
//           />
//         </AdminCard>

//         {/* EXPLORE SECTION */}
//         <AdminCard title="Home Explore Section">
//           <AdminInput label="Heading" value={homeSectionHeading} onChange={setHomeSectionHeading} />
//           <AdminTextarea label="Content" value={homeSectionContent} onChange={setHomeSectionContent} />

//           <label className="block text-gray-700 font-medium mb-1">Tabs</label>
//           {exploreTabs.map((tab, i) => (
//             <input
//               key={i}
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2"
//               value={exploreTabs[i]}
//               onChange={(e) => {
//                 const updated = [...exploreTabs];
//                 updated[i] = e.target.value;
//                 setExploreTabs(updated);
//               }}
//             />
//           ))}
//         </AdminCard>

//         {/* KEY FEATURES */}
//         <AdminCard title="Key Features Section">
//           <AdminInput label="Heading" value={getStartedHeading} onChange={setGetStartedHeading} />
//           <AdminTextarea label="Content" value={keyFeaturedContent} onChange={setKeyFeaturedContent} />

//           <AdminInput label="Feature 1" value={featuredPoint1} onChange={setFeaturedPoint1} />
//           <AdminInput label="Feature 2" value={featuredPoint2} onChange={setFeaturedPoint2} />
//           <AdminInput label="Feature 3" value={featuredPoint3} onChange={setFeaturedPoint3} />
//           <AdminInput label="Feature 4" value={featuredPoint4} onChange={setFeaturedPoint4} />
//         </AdminCard>

//         {/* JOB ASSISTANCE */}
//         <AdminCard title="Job Assistance Program Section">
//           <AdminInput label="Heading" value={jobAssistanceHeading} onChange={setJobAssistanceHeading} />
//           <AdminTextarea label="Content" value={jobAssistanceContent} onChange={setJobAssistanceContent} />

//           <AdminInput label="Job 1 Title" value={job1Title} onChange={setJob1Title} />
//           <AdminTextarea label="Job 1 Content" value={job1Content} onChange={setJob1Content} />

//           <AdminInput label="Job 2 Title" value={job2Title} onChange={setJob2Title} />
//           <AdminTextarea label="Job 2 Content" value={job2Content} onChange={setJob2Content} />

//           <AdminInput label="Job 3 Title" value={job3Title} onChange={setJob3Title} />
//           <AdminTextarea label="Job 3 Content" value={job3Content} onChange={setJob3Content} />

//           <AdminInput label="Job 4 Title" value={job4Title} onChange={setJob4Title} />
//           <AdminTextarea label="Job 4 Content" value={job4Content} onChange={setJob4Content} />

//           <AdminInput label="Job 5 Title" value={job5Title} onChange={setJob5Title} />
//           <AdminTextarea label="Job 5 Content" value={job5Content} onChange={setJob5Content} />

//           <AdminInput label="Job 6 Title" value={job6Title} onChange={setJob6Title} />
//           <AdminTextarea label="Job 6 Content" value={job6Content} onChange={setJob6Content} />
//         </AdminCard>

//         {/* JOB SUPPORT */}
//         <AdminCard title="Job Support Program">
//           <AdminInput label="Title" value={jobSupportTitle} onChange={setJobSupportTitle} />
//           <AdminTextarea label="Content" value={jobSupportContent} onChange={setJobSupportContent} />

//           <AdminCard title="Payment Types">
//             <AdminInput label="Type 1" value={payment1} onChange={setPayment1} />
//             <AdminInput label="Type 2" value={payment2} onChange={setPayment2} />
//             <AdminInput label="Type 3" value={payment3} onChange={setPayment3} />
//           </AdminCard>

//           <AdminInput label="Button Heading" value={buttonHeading} onChange={setButtonHeading} />
//           <AdminInput label="Button Link" value={buttonLink} onChange={setButtonLink} />
//         </AdminCard>

//         {/* BLOG SECTION */}
//         <AdminCard title="Blog Section">
//           <AdminInput label="Blog Heading" value={blogHeading} onChange={setBlogHeading} />
//         </AdminCard>

//         {/* SUBMIT */}
//         <div className="flex justify-end">
//           <button
//             onClick={saveHomepage}
//             className="px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 cursor-pointer shadow-sm"
//           >
//             {isSaving ? "Saving..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  BannerBox,
} from "../CorporateTraining/components/AdminUI";
import { uploadToCloudinary } from "@/services/cloudinaryUpload";

export default function HomepageDetailsPage() {
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

  // Detects whether this is a NEW record
  const [isNewRecord, setIsNewRecord] = useState(true);

  /* ========================= FETCH EXISTING DATA ========================= */

  useEffect(() => {
    fetch(`/api/homepage`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        // HERO
        setHeroHeading(data.hero_heading || "");
        setHeroContent(data.hero_content?.join("\n") || "");
        setPopularContent(data.hero_popular?.join("\n") || "");
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

        // BLOG SECTION
        setBlogHeading(data.blog_section_heading || "");

        // Detect new/existing record
        setIsNewRecord(!data?.id);
      });
  }, []);

  /* ========================= SAVE HOMEPAGE ========================= */

  async function saveHomepage() {
    setIsSaving(true);

    const payload = {
      hero_heading: heroHeading,
      hero_content: heroContent.split("\n").filter(Boolean),
      hero_popular: popularContent.split("\n").filter(Boolean),
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
      job_assistance_points: [
        { title: job1Title, content: job1Content },
        { title: job2Title, content: job2Content },
        { title: job3Title, content: job3Content },
        { title: job4Title, content: job4Content },
        { title: job5Title, content: job5Content },
        { title: job6Title, content: job6Content },
      ],

      job_support_title: jobSupportTitle,
      job_support_content: jobSupportContent,
      job_support_payment_types: [payment1, payment2, payment3],
      job_support_button: buttonHeading,
      job_support_button_link: buttonLink,

      blog_section_heading: blogHeading,
    };

    const res = await fetch(`/api/homepage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setIsSaving(false);

    if (res.ok) {
      if (isNewRecord) {
        toast.success("Homepage Saved Successfully!");
      } else {
        toast.success("Homepage Updated Successfully!");
      }

      setIsNewRecord(false);
    } else {
      toast.error(result.message || "Failed to update.");
    }
  }

  /* ========================= UI ========================= */

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Homepage Details
      </h1>

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
