// "use client";

// import { useEffect, useState, useCallback, ReactNode } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import {
//   FaSearch,
//   FaEye,
//   FaTrash,
//   FaTimes,
//   FaFileDownload,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";

// /* ----------------------------
//    REUSABLE DETAIL FIELD
// ---------------------------- */
// function Detail({ label, value }: { label: string; value: ReactNode }) {
//   return (
//     <div className="flex justify-between py-2 border-b border-gray-200">
//       <p className="text-gray-600 font-medium">{label}</p>
//       <p className="text-gray-800">{value}</p>
//     </div>
//   );
// }

// /* ----------------------------
//    MESSAGE BOX
// ---------------------------- */
// function MessageBox({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="mt-4">
//       <label className="text-gray-700 font-medium text-sm">{label}</label>
//       <div
//         className="mt-2 p-4 bg-gray-100 rounded-xl border-l-4 border-blue-600 text-gray-800 leading-relaxed shadow-sm text-justify"
//         style={{ whiteSpace: "pre-line" }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// type Lead = {
//   id: number;
//   name: string;
//   email?: string;
//   phone?: string;
//   course?: string;
//   contactedOn?: string;
//   status?: string;
//   message?: string;
// };

// export default function CourseLeads() {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // NEW STATES FOR PAGINATION
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const pageSize = 20;

//   const rawApi = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const API_BASE = (
//     rawApi.replace(/\/$/, "") +
//     (rawApi.includes("/api") ? "" : "/api")
//   ).replace(/\/$/, "");

//   /* -----------------------------------
//        FETCH LEADS (SERVER SIDE PAGINATION)
//   ----------------------------------- */
//   const fetchLeads = useCallback(
//     async (page = 1) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await axios.get(
//           `${API_BASE}/leads?page=${page}&limit=${pageSize}`,
//           {
//             headers: { Accept: "application/json" },
//           }
//         );

//         const body = res.data;

//         const normalized: Lead[] = Array.isArray(body.data)
//           ? body.data.map((r: any) => {
//               const contactedCandidate =
//                 r.contacted_on ?? r.created_at ?? r.createdAt;

//               return {
//                 id: r.id,
//                 name: r.name,
//                 email: r.email ?? "",
//                 phone: r.phone ?? "",
//                 course: r.course ?? "",
//                 contactedOn: contactedCandidate
//                   ? new Date(contactedCandidate).toLocaleString()
//                   : "—",
//                 status: r.status ?? "New",
//                 message: r.message ?? "",
//               };
//             })
//           : [];

//         setLeads(normalized);
//         setCurrentPage(body.current_page);
//         setTotalPages(body.last_page);
//       } catch (err) {
//         console.error("Failed to load leads", err);
//         setError("Failed to load leads");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [API_BASE]
//   );

//   useEffect(() => {
//     fetchLeads(currentPage);
//   }, [fetchLeads, currentPage]);

//   /* -----------------------------------
//         UPDATE LEAD STATUS
//   ----------------------------------- */
//   const updateStatus = async (status: string) => {
//     if (!selectedLead) return;
//     try {
//       await axios.put(`${API_BASE}/leads/${selectedLead.id}/status`, {
//         status,
//       });

//       setLeads((prev) =>
//         prev.map((lead) =>
//           lead.id === selectedLead.id ? { ...lead, status } : lead
//         )
//       );

//       setSelectedLead({ ...selectedLead, status });
//     } catch (err) {
//       console.error("Failed to update status", err);
//     }
//   };

//   /* -----------------------------------
//         DELETE SINGLE LEAD
//   ----------------------------------- */
//   const deleteLead = async (id: number) => {
//     try {
//       await axios.delete(`${API_BASE}/leads/${id}`);
//       setLeads((prev) => prev.filter((x) => x.id !== id));
//     } catch (err) {
//       console.error("Failed to delete lead", err);
//     }
//   };

//   /* -----------------------------------
//         SELECT MULTIPLE
//   ----------------------------------- */
//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   /* -----------------------------------
//         DELETE SELECTED LEADS
//   ----------------------------------- */
//   const deleteSelected = async () => {
//     try {
//       await axios.post(`${API_BASE}/leads/delete-multiple`, {
//         ids: selectedIds,
//       });

//       setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
//       setSelectedIds([]);
//     } catch (err) {
//       console.error("Failed to delete selected leads", err);
//     }
//   };

//   /* -----------------------------------
//         DOWNLOAD SINGLE PDF
//   ----------------------------------- */
//   const downloadLeadPDF = (lead: Lead) => {
//     const doc = new jsPDF();
//     doc.setFontSize(20);
//     doc.text("Lead Details", 14, 20);

//     doc.setFontSize(12);
//     doc.text(`ID: ${lead.id}`, 14, 40);
//     doc.text(`Name: ${lead.name}`, 14, 50);
//     doc.text(`Email: ${lead.email}`, 14, 60);
//     doc.text(`Phone: ${lead.phone}`, 14, 70);
//     doc.text(`Course: ${lead.course}`, 14, 80);
//     doc.text(`Status: ${lead.status}`, 14, 90);
//     doc.text(`Contacted On: ${lead.contactedOn}`, 14, 100);

//     const messageLines = doc.splitTextToSize(lead.message ?? "", 180);
//     doc.text("Message:", 14, 115);
//     doc.text(messageLines, 14, 125);

//     doc.save(`Lead-${lead.name}.pdf`);
//   };

//   /* -----------------------------------
//         DOWNLOAD EXCEL
//   ----------------------------------- */
//   const downloadExcel = () => {
//     const wsData = [
//       ["ID", "Name", "Email", "Phone", "Course", "Status", "Contacted On", "Message"],
//       ...leads.map((l) => [
//         l.id,
//         l.name,
//         l.email,
//         l.phone,
//         l.course,
//         l.status,
//         l.contactedOn,
//         l.message,
//       ]),
//     ];

//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Course Leads");
//     XLSX.writeFile(wb, "Course_Leads.xlsx");
//   };

//   /* -----------------------------------
//         LOADING UI
//   ----------------------------------- */
//   if (loading)
//     return (
//       <div className="flex justify-center py-10 text-gray-600 text-lg">
//         Loading leads...
//       </div>
//     );

//   /* -----------------------------------
//         MAIN UI
//   ----------------------------------- */
//   return (
//     <>
//       <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-2">
//           <h3 className="text-2xl font-bold text-gray-800">Course Leads</h3>

//           <div className="flex gap-3">
//             <button
//               onClick={downloadExcel}
//               className="px-4 py-2 bg-green-700 text-white rounded-lg shadow"
//             >
//               Download Excel
//             </button>

//             {selectedIds.length > 0 && (
//               <button
//                 onClick={deleteSelected}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg shadow"
//               >
//                 Delete Selected ({selectedIds.length})
//               </button>
//             )}

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg w-60"
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse rounded-lg overflow-hidden">
//             <thead>
//               <tr className="bg-gray-100 text-left text-gray-700 text-sm border-b border-gray-300">
//                 <th className="py-3 px-4 font-semibold">
//                   <input
//                     type="checkbox"
//                     checked={
//                       selectedIds.length === leads.length &&
//                       leads.length > 0
//                     }
//                     onChange={() =>
//                       setSelectedIds(
//                         selectedIds.length === leads.length
//                           ? []
//                           : leads.map((l) => l.id)
//                       )
//                     }
//                   />
//                 </th>
//                 <th className="p-3 font-semibold">ID</th>
//                 <th className="p-3 font-semibold">Name</th>
//                 <th className="p-3 font-semibold">Email</th>
//                 <th className="p-3 font-semibold">Phone</th>
//                 <th className="p-3 font-semibold">Course</th>
//                 <th className="p-3 font-semibold">Status</th>
//                 <th className="p-3 font-semibold">Contacted On</th>
//                 <th className="p-3 font-semibold text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {leads.map((lead) => (
//                 <tr
//                   key={lead.id}
//                   className="text-sm text-gray-700 hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3 px-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(lead.id)}
//                       onChange={() => toggleSelect(lead.id)}
//                     />
//                   </td>

//                   <td className="py-3 px-4">{lead.id}</td>
//                   <td className="py-3 px-4">{lead.name}</td>
//                   <td className="py-3 px-4">{lead.email}</td>
//                   <td className="py-3 px-4">{lead.phone}</td>
//                   <td className="py-3 px-4">{lead.course}</td>

//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-2 py-1 text-xs rounded-lg font-medium ${
//                         lead.status === "New"
//                           ? "bg-blue-100 text-blue-700"
//                           : lead.status === "Contacted"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-green-100 text-green-700"
//                       }`}
//                     >
//                       {lead.status}
//                     </span>
//                   </td>

//                   <td className="py-3 px-4">{lead.contactedOn}</td>

//                   <td className="p-3 flex gap-3 justify-center">
//                     <button
//                       onClick={() => {
//                         setSelectedLead(lead);
//                         setIsOpen(true);
//                       }}
//                       className="bg-blue-300 text-blue-700 p-2 rounded cursor-pointer"
//                     >
//                       <FaEye />
//                     </button>

//                     <button
//                       onClick={() => downloadLeadPDF(lead)}
//                       className="bg-green-300 text-green-700 p-2 rounded cursor-pointer"
//                     >
//                       <FaFileDownload />
//                     </button>

//                     <button
//                       onClick={() => deleteLead(lead.id)}
//                       className="bg-red-300 text-red-700 p-2 rounded cursor-pointer"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION CONTROLS */}
//         <div className="flex justify-center mt-6 gap-4">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           <span className="px-4 py-2 bg-white border rounded shadow">
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </section>

//       {/* POPUP */}
//       {isOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
//           <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[90%] max-w-lg border animate-slideUp">
//             <div className="flex justify-between">
//               <h2 className="text-xl font-semibold">Lead Details</h2>
//               <button onClick={() => setIsOpen(false)}>
//                 <FaTimes size={20} />
//               </button>
//             </div>

//             <div className="mt-4 space-y-3">
//               <Detail label="Name" value={selectedLead.name} />
//               <Detail label="Email" value={selectedLead.email} />
//               <Detail label="Phone" value={selectedLead.phone} />
//               <Detail label="Course" value={selectedLead.course} />
//               <Detail label="Status" value={selectedLead.status} />

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => updateStatus("New")}
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                 >
//                   New
//                 </button>
//                 <button
//                   onClick={() => updateStatus("Contacted")}
//                   className="px-3 py-1 bg-yellow-600 text-white rounded"
//                 >
//                   Contacted
//                 </button>
//                 <button
//                   onClick={() => updateStatus("Closed")}
//                   className="px-3 py-1 bg-green-600 text-white rounded"
//                 >
//                   Closed
//                 </button>
//               </div>

//               <MessageBox label="Message" value={selectedLead.message ?? ""} />
//             </div>

//             <div className="flex justify-end mt-5">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-6 py-2 bg-blue-700 text-white rounded"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
//           {error}
//         </div>
//       )}
//     </>
//   );
// }






























// "use client";

// import { useEffect, useState, useCallback, ReactNode } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import {
//   FaSearch,
//   FaEye,
//   FaTrash,
//   FaTimes,
//   FaFileDownload,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";

// /* ----------------------------
//    REUSABLE DETAIL FIELD
// ---------------------------- */
// function Detail({ label, value }: { label: string; value: ReactNode }) {
//   return (
//     <div className="flex justify-between py-2 border-b border-gray-100">
//       <p className="text-gray-500 font-medium text-sm">{label}</p>
//       <p className="text-gray-800 text-sm">{value}</p>
//     </div>
//   );
// }

// /* ----------------------------
//    MESSAGE BOX
// ---------------------------- */
// function MessageBox({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="mt-4">
//       <label className="text-gray-600 font-medium text-sm">{label}</label>
//       <div
//         className="mt-2 p-4 bg-gray-50 rounded-xl border-l-4 border-slate-200 text-gray-800 leading-relaxed shadow-sm text-justify"
//         style={{ whiteSpace: "pre-line" }}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// type Lead = {
//   id: number;
//   name: string;
//   email?: string;
//   phone?: string;
//   course?: string;
//   contactedOn?: string;
//   status?: string;
//   message?: string;
//   created_at?: string;
// };

// export default function CourseLeads() {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Pagination & filter states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [pageSize, setPageSize] = useState<number>(20);

//   // Sorting
//   const [sortBy, setSortBy] = useState<string>("id");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

//   // Filters
//   const [statusFilter, setStatusFilter] = useState<string>(""); // "", "New", "Contacted", "Closed"
//   const [courseFilter, setCourseFilter] = useState<string>("");
//   const [dateFrom, setDateFrom] = useState<string>("");
//   const [dateTo, setDateTo] = useState<string>("");

//   // Derived list of courses for filter dropdown (keeps growing as pages load)
//   const [allCourses, setAllCourses] = useState<string[]>([]);

//   // Search debounce
//   const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

//   // API base
//   const rawApi = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
//   const API_BASE = (
//     rawApi.replace(/\/$/, "") +
//     (rawApi.includes("/api") ? "" : "/api")
//   ).replace(/\/$/, "");

//   /* -----------------------------------
//        FETCH LEADS (SERVER SIDE PAGINATION + FILTERS)
//   ----------------------------------- */
//   const fetchLeads = useCallback(
//     async (page = 1) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const params: Record<string, any> = {
//           page,
//           limit: pageSize,
//         };

//         if (debouncedSearch) params.search = debouncedSearch;
//         if (sortBy) params.sort_by = sortBy;
//         if (sortDir) params.sort_dir = sortDir;
//         if (statusFilter) params.status = statusFilter;
//         if (courseFilter) params.course = courseFilter;
//         if (dateFrom) params.date_from = dateFrom;
//         if (dateTo) params.date_to = dateTo;

//         const res = await axios.get(`${API_BASE}/leads`, {
//           headers: { Accept: "application/json" },
//           params,
//         });

//         const body = res.data;

//         // Normalize payload for Laravel paginate structure
//         const data = Array.isArray(body.data) ? body.data : [];

//         const normalized: Lead[] = data.map((r: any) => {
//           const contactedCandidate =
//             r.contacted_on ?? r.created_at ?? r.createdAt ?? r.createdAt;
//           return {
//             id: r.id,
//             name: r.name,
//             email: r.email ?? "",
//             phone: r.phone ?? "",
//             course: r.course ?? r.course_name ?? "",
//             contactedOn: contactedCandidate
//               ? new Date(contactedCandidate).toLocaleString()
//               : "—",
//             status: r.status ?? "New",
//             message: r.message ?? "",
//             created_at: r.created_at ?? r.createdAt,
//           };
//         });

//         setLeads(normalized);
//         setCurrentPage(body.current_page ?? page);
//         setTotalPages(body.last_page ?? Math.max(1, Math.ceil((body.total ?? normalized.length) / pageSize)));

//         // collect course names seen so far
//         const seen = new Set(allCourses);
//         normalized.forEach((l) => {
//           if (l.course) seen.add(l.course);
//         });
//         setAllCourses(Array.from(seen).sort());

//       } catch (err: any) {
//         console.error("Failed to load leads", err);
//         setError("Failed to load leads");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [API_BASE, pageSize, debouncedSearch, sortBy, sortDir, statusFilter, courseFilter, dateFrom, dateTo, allCourses]
//   );

//   // initial load + refetch when dependencies change
//   useEffect(() => {
//     void fetchLeads(currentPage);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [fetchLeads, currentPage]);

//   // debounce search input
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 450);
//     return () => clearTimeout(t);
//   }, [searchTerm]);

//   useEffect(() => {
//     // whenever debounced search or filters change, go back to page 1
//     setCurrentPage(1);
//   }, [debouncedSearch, pageSize, sortBy, sortDir, statusFilter, courseFilter, dateFrom, dateTo]);

//   /* -----------------------------------
//         UPDATE LEAD STATUS
//   ----------------------------------- */
//   const updateStatus = async (status: string) => {
//     if (!selectedLead) return;
//     try {
//       await axios.put(`${API_BASE}/leads/${selectedLead.id}/status`, {
//         status,
//       });

//       setLeads((prev) =>
//         prev.map((lead) =>
//           lead.id === selectedLead.id ? { ...lead, status } : lead
//         )
//       );

//       setSelectedLead({ ...selectedLead, status });
//     } catch (err) {
//       console.error("Failed to update status", err);
//       setError("Failed to update status");
//     }
//   };

//   /* -----------------------------------
//         DELETE SINGLE LEAD
//   ----------------------------------- */
//   const deleteLead = async (id: number) => {
//     try {
//       await axios.delete(`${API_BASE}/leads/${id}`);
//       setLeads((prev) => prev.filter((x) => x.id !== id));
//     } catch (err) {
//       console.error("Failed to delete lead", err);
//       setError("Failed to delete lead");
//     }
//   };

//   /* -----------------------------------
//         SELECT MULTIPLE
//   ----------------------------------- */
//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAllVisible = () => {
//     const visibleIds = leads.map((l) => l.id);
//     if (visibleIds.every((id) => selectedIds.includes(id))) {
//       setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
//     } else {
//       setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
//     }
//   };

//   /* -----------------------------------
//         DELETE SELECTED LEADS
//   ----------------------------------- */
//   const deleteSelected = async () => {
//     try {
//       await axios.post(`${API_BASE}/leads/delete-multiple`, {
//         ids: selectedIds,
//       });

//       setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
//       setSelectedIds([]);
//     } catch (err) {
//       console.error("Failed to delete selected leads", err);
//       setError("Failed to delete selected leads");
//     }
//   };

//   /* -----------------------------------
//         DOWNLOAD SINGLE PDF
//   ----------------------------------- */
//   const downloadLeadPDF = (lead: Lead) => {
//     const doc = new jsPDF();
//     doc.setFontSize(20);
//     doc.text("Lead Details", 14, 20);

//     doc.setFontSize(12);
//     doc.text(`ID: ${lead.id}`, 14, 40);
//     doc.text(`Name: ${lead.name}`, 14, 50);
//     doc.text(`Email: ${lead.email}`, 14, 60);
//     doc.text(`Phone: ${lead.phone}`, 14, 70);
//     doc.text(`Course: ${lead.course}`, 14, 80);
//     doc.text(`Status: ${lead.status}`, 14, 90);
//     doc.text(`Contacted On: ${lead.contactedOn}`, 14, 100);

//     const messageLines = doc.splitTextToSize(lead.message ?? "", 180);
//     doc.text("Message:", 14, 115);
//     doc.text(messageLines, 14, 125);

//     doc.save(`Lead-${lead.name}.pdf`);
//   };

//   /* -----------------------------------
//         DOWNLOAD EXCEL
//   ----------------------------------- */
//   const downloadExcel = () => {
//     const wsData = [
//       ["ID", "Name", "Email", "Phone", "Course", "Status", "Contacted On", "Message"],
//       ...leads.map((l) => [
//         l.id,
//         l.name,
//         l.email,
//         l.phone,
//         l.course,
//         l.status,
//         l.contactedOn,
//         l.message,
//       ]),
//     ];

//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Course Leads");
//     XLSX.writeFile(wb, "Course_Leads.xlsx");
//   };

//   /* -----------------------------------
//         HELPERS: Pagination range generator
//   ----------------------------------- */
//   function getPageRange(current: number, last: number, delta = 2) {
//     const range: (number | "gap")[] = [];
//     const left = Math.max(1, current - delta);
//     const right = Math.min(last, current + delta);

//     for (let i = 1; i <= last; i++) {
//       if (i === 1 || i === last || (i >= left && i <= right)) {
//         range.push(i);
//       } else if (range[range.length - 1] !== "gap") {
//         range.push("gap");
//       }
//     }
//     return range;
//   }

//   /* -----------------------------------
//         LOADING SKELETON
//   ----------------------------------- */
//   const LoadingSkeleton = () => (
//     <div className="space-y-3">
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div
//           key={i}
//           className="animate-pulse bg-white rounded-xl p-4 shadow-sm border border-gray-50"
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
//               <div className="h-3 w-60 bg-gray-100 rounded" />
//             </div>
//             <div className="h-8 w-20 bg-gray-200 rounded" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   /* -----------------------------------
//         RENDER
//   ----------------------------------- */
//   return (
//     <>
//       <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
//         {/* Header area */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//           <div>
//             <h3 className="text-2xl font-semibold text-slate-800">Course Leads</h3>
//             <p className="text-sm text-slate-500 mt-1">Manage and filter leads — clean, fast and minimal.</p>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 items-stretch">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name, email, course..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-xl w-72 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
//               />
//               <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
//             </div>

//             <div className="flex gap-2 items-center">
//               <button
//                 onClick={downloadExcel}
//                 className="px-4 py-2 bg-white border rounded-xl shadow-sm text-sm hover:shadow transition"
//                 title="Export current page to Excel"
//               >
//                 <FaFileDownload className="inline mr-2" /> Export
//               </button>

//               {selectedIds.length > 0 && (
//                 <button
//                   onClick={deleteSelected}
//                   className="px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:opacity-95 text-sm"
//                 >
//                   Delete ({selectedIds.length})
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Filters & Controls */}
//         <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
//               >
//                 <option value="">All</option>
//                 <option value="New">New</option>
//                 <option value="Contacted">Contacted</option>
//                 <option value="Closed">Closed</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">Course</label>
//               <select
//                 value={courseFilter}
//                 onChange={(e) => setCourseFilter(e.target.value)}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none min-w-[160px]"
//               >
//                 <option value="">All</option>
//                 {allCourses.map((c) => (
//                   <option value={c} key={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">From</label>
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">To</label>
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
//               />
//             </div>

//             <button
//               onClick={() => {
//                 setStatusFilter("");
//                 setCourseFilter("");
//                 setDateFrom("");
//                 setDateTo("");
//                 setSearchTerm("");
//                 setSortBy("id");
//                 setSortDir("desc");
//                 setPageSize(20);
//               }}
//               className="px-3 py-2 text-sm text-slate-600 bg-white border rounded-xl hover:shadow-sm"
//             >
//               Reset
//             </button>
//           </div>

//           <div className="flex gap-3 items-center">
//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">Sort</label>
//               <select
//                 value={`${sortBy}:${sortDir}`}
//                 onChange={(e) => {
//                   const [sb, sd] = e.target.value.split(":");
//                   setSortBy(sb);
//                   setSortDir(sd as "asc" | "desc");
//                 }}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
//               >
//                 <option value="id:desc">Newest</option>
//                 <option value="id:asc">Oldest</option>
//                 <option value="name:asc">Name A → Z</option>
//                 <option value="name:desc">Name Z → A</option>
//                 <option value="course:asc">Course A → Z</option>
//                 <option value="course:desc">Course Z → A</option>
//                 <option value="status:asc">Status A → Z</option>
//                 <option value="status:desc">Status Z → A</option>
//                 <option value="created_at:desc">Contacted Newest</option>
//                 <option value="created_at:asc">Contacted Oldest</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <label className="text-sm text-slate-600">Per page</label>
//               <select
//                 value={pageSize}
//                 onChange={(e) => setPageSize(Number(e.target.value))}
//                 className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* TABLE (desktop) */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse rounded-lg overflow-hidden">
//             <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
//               <tr className="bg-white text-left text-slate-600 text-sm border-b border-gray-100">
//                 <th className="py-3 px-4 font-medium">
//                   <input
//                     type="checkbox"
//                     checked={leads.length > 0 && leads.every((l) => selectedIds.includes(l.id))}
//                     onChange={toggleSelectAllVisible}
//                   />
//                 </th>
//                 <th className="p-3 font-medium">ID</th>
//                 <th className="p-3 font-medium">Name</th>
//                 <th className="p-3 font-medium">Email</th>
//                 <th className="p-3 font-medium">Phone</th>
//                 <th className="p-3 font-medium">Course</th>
//                 <th className="p-3 font-medium">Status</th>
//                 <th className="p-3 font-medium">Contacted On</th>
//                 <th className="p-3 font-medium text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 // show table-shaped skeleton rows (desktop)
//                 Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
//                   <tr key={i} className="animate-pulse">
//                     <td className="p-4"><div className="h-3 w-3 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-8 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-28 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-32 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-16 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-3 w-24 bg-gray-200 rounded" /></td>
//                     <td className="p-4"><div className="h-8 w-24 bg-gray-200 rounded" /></td>
//                   </tr>
//                 ))
//               ) : leads.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="p-6 text-center text-slate-500">
//                     No leads found.
//                   </td>
//                 </tr>
//               ) : (
//                 leads.map((lead) => (
//                   <tr key={lead.id} className="text-sm text-slate-700 hover:bg-gray-50 transition">
//                     <td className="py-3 px-4">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.includes(lead.id)}
//                         onChange={() => toggleSelect(lead.id)}
//                       />
//                     </td>

//                     <td className="py-3 px-4">{lead.id}</td>
//                     <td className="py-3 px-4">{lead.name}</td>
//                     <td className="py-3 px-4 text-xs text-slate-500">{lead.email}</td>
//                     <td className="py-3 px-4 text-sm">{lead.phone}</td>
//                     <td className="py-3 px-4">{lead.course}</td>

//                     <td className="py-3 px-4">
//                       <span
//                         className={`px-2 py-1 text-xs rounded-lg font-medium ${
//                           lead.status === "New"
//                             ? "bg-blue-50 text-blue-600"
//                             : lead.status === "Contacted"
//                             ? "bg-amber-50 text-amber-600"
//                             : "bg-emerald-50 text-emerald-600"
//                         }`}
//                       >
//                         {lead.status}
//                       </span>
//                     </td>

//                     <td className="py-3 px-4 text-sm">{lead.contactedOn}</td>

//                     <td className="p-3 flex gap-3 justify-center">
//                       <button
//                         onClick={() => {
//                           setSelectedLead(lead);
//                           setIsOpen(true);
//                         }}
//                         className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm"
//                         title="View"
//                       >
//                         <FaEye className="text-slate-600" />
//                       </button>

//                       <button
//                         onClick={() => downloadLeadPDF(lead)}
//                         className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm"
//                         title="Download PDF"
//                       >
//                         <FaFileDownload className="text-slate-600" />
//                       </button>

//                       <button
//                         onClick={() => deleteLead(lead.id)}
//                         className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm text-red-600"
//                         title="Delete"
//                       >
//                         <FaTrash />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile card view */}
//         <div className="md:hidden mt-4 space-y-3">
//           {loading ? (
//             <LoadingSkeleton />
//           ) : leads.length === 0 ? (
//             <div className="text-center text-slate-500">No leads found.</div>
//           ) : (
//             leads.map((lead) => (
//               <div key={lead.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
//                 <div className="flex justify-between items-start gap-2">
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="text-sm font-medium text-slate-800">{lead.name}</h4>
//                       <span className="text-xs text-slate-500">#{lead.id}</span>
//                     </div>
//                     <p className="text-xs text-slate-500 mt-1">{lead.email}</p>
//                     <p className="text-xs text-slate-500">{lead.phone}</p>
//                     <p className="text-xs text-slate-600 mt-2">{lead.course}</p>
//                   </div>

//                   <div className="flex flex-col items-end gap-2">
//                     <span className={`text-xs px-2 py-1 rounded ${lead.status === "New" ? "bg-blue-50 text-blue-600" : lead.status === "Contacted" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
//                       {lead.status}
//                     </span>

//                     <div className="flex gap-2">
//                       <button onClick={() => { setSelectedLead(lead); setIsOpen(true); }} className="p-2 bg-white border rounded-lg">
//                         <FaEye />
//                       </button>
//                       <button onClick={() => downloadLeadPDF(lead)} className="p-2 bg-white border rounded-lg">
//                         <FaFileDownload />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* PAGINATION CONTROLS */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
//           <div className="text-sm text-slate-600">
//             Showing page <span className="font-medium text-slate-800">{currentPage}</span> of <span className="font-medium text-slate-800">{totalPages}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               className="px-3 py-2 rounded-xl border bg-white hover:shadow-sm disabled:opacity-50"
//             >
//               <FaChevronLeft />
//             </button>

//             <div className="flex items-center gap-1 bg-white border rounded-xl p-2 shadow-sm">
//               {getPageRange(currentPage, totalPages).map((p, idx) =>
//                 p === "gap" ? (
//                   <span key={`g-${idx}`} className="px-2 text-slate-400">…</span>
//                 ) : (
//                   <button
//                     key={p}
//                     onClick={() => setCurrentPage(Number(p))}
//                     className={`px-3 py-1 rounded-md text-sm ${p === currentPage ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-gray-100"}`}
//                   >
//                     {p}
//                   </button>
//                 )
//               )}
//             </div>

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               className="px-3 py-2 rounded-xl border bg-white hover:shadow-sm disabled:opacity-50"
//             >
//               <FaChevronRight />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* MODERN POPUP */}
//       {isOpen && selectedLead && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="relative bg-white w-[92%] max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-50 transform transition-all">
//             <div className="flex justify-between items-start gap-3">
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-800">Lead Details</h3>
//                 <p className="text-sm text-slate-500 mt-1">ID #{selectedLead.id}</p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
//                   <FaTimes />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-4 rounded-lg border bg-white">
//               <Detail label="Name" value={selectedLead.name} />
//               <Detail label="Email" value={selectedLead.email} />
//               <Detail label="Phone" value={selectedLead.phone} />
//               <Detail label="Course" value={selectedLead.course} />
//               <Detail label="Status" value={selectedLead.status} />
//             </div>

//             <div className="flex gap-2 mt-4">
//               <button onClick={() => updateStatus("New")} className="px-3 py-1 rounded-xl bg-white border text-sm">New</button>
//               <button onClick={() => updateStatus("Contacted")} className="px-3 py-1 rounded-xl bg-white border text-sm">Contacted</button>
//               <button onClick={() => updateStatus("Closed")} className="px-3 py-1 rounded-xl bg-white border text-sm">Closed</button>
//             </div>

//             <MessageBox label="Message" value={selectedLead.message ?? ""} />

//             <div className="flex justify-end gap-3 mt-4">
//               <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl bg-white border">Close</button>
//               <button onClick={() => { downloadLeadPDF(selectedLead); }} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Download PDF</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ERROR */}
//       {error && (
//         <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg shadow">
//           {error}
//         </div>
//       )}
//     </>
//   );
// }




"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaTimes,
  FaFileDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import * as XLSX from "xlsx";

/* ----------------------------
   REUSABLE DETAIL FIELD
---------------------------- */
function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <p className="text-gray-500 font-medium text-sm">{label}</p>
      <p className="text-gray-800 text-sm">{value}</p>
    </div>
  );
}

/* ----------------------------
   MESSAGE BOX
---------------------------- */
function MessageBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <label className="text-gray-600 font-medium text-sm">{label}</label>
      <div
        className="mt-2 p-4 bg-gray-50 rounded-xl border-l-4 border-slate-200 text-gray-800 leading-relaxed shadow-sm text-justify"
        style={{ whiteSpace: "pre-line" }}
      >
        {value}
      </div>
    </div>
  );
}

type Lead = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  course?: string;
  contactedOn?: string;
  status?: string;
  message?: string;
  created_at?: string;
};

export default function CourseLeads() {
  // data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allCourses, setAllCourses] = useState<string[]>([]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Sorting
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // API base
  const rawApi = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const API_BASE = (
    rawApi.replace(/\/$/, "") +
    (rawApi.includes("/api") ? "" : "/api")
  ).replace(/\/$/, "");

  /* ---------------------------
     Fetch leads (server-side)
  --------------------------- */
  const fetchLeads = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, any> = {
          page,
          limit: pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (sortBy) params.sort_by = sortBy;
        if (sortDir) params.sort_dir = sortDir;
        if (statusFilter) params.status = statusFilter;
        if (courseFilter) params.course = courseFilter;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        const res = await axios.get(`${API_BASE}/leads`, {
          params,
          headers: { Accept: "application/json" },
        });

        const body = res.data;

        const data = Array.isArray(body.data) ? body.data : [];

        const normalized: Lead[] = data.map((r: any) => {
          const contactedCandidate =
            r.contacted_on ?? r.created_at ?? r.createdAt ?? r.created_at;
          return {
            id: r.id,
            name: r.name,
            email: r.email ?? "",
            phone: r.phone ?? "",
            course: r.course ?? r.course_name ?? "",
            contactedOn: contactedCandidate
              ? new Date(contactedCandidate).toLocaleString()
              : "—",
            status: r.status ?? "New",
            message: r.message ?? "",
            created_at: r.created_at ?? r.createdAt,
          };
        });

        setLeads(normalized);
        setCurrentPage(body.current_page ?? page);
        setTotalPages(
          body.last_page ?? Math.max(1, Math.ceil((body.total ?? normalized.length) / pageSize))
        );

        // merge courses seen this page into allCourses without causing a loop
        setAllCourses((prev) => {
          const s = new Set(prev);
          normalized.forEach((l) => {
            if (l.course) s.add(l.course);
          });
          return Array.from(s).sort();
        });
      } catch (err: any) {
        console.error("Failed to load leads", err);
        setError(
          err?.response
            ? `Failed to load leads: ${err.response.status}`
            : "Failed to load leads"
        );
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, pageSize, debouncedSearch, sortBy, sortDir, statusFilter, courseFilter, dateFrom, dateTo]
  );

  // initial fetch and when page changes
  useEffect(() => {
    void fetchLeads(currentPage);
  }, [fetchLeads, currentPage]);

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // reset to page 1 when filters/sorting/search/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, pageSize, sortBy, sortDir, statusFilter, courseFilter, dateFrom, dateTo]);

  /* ---------------------------
     Update status
  --------------------------- */
  const updateStatus = async (status: string) => {
    if (!selectedLead) return;
    try {
      await axios.put(`${API_BASE}/leads/${selectedLead.id}/status`, { status });
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, status } : l)));
      setSelectedLead({ ...selectedLead, status });
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update status");
    }
  };

  /* ---------------------------
     Delete single
  --------------------------- */
  const deleteLead = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/leads/${id}`);
      setLeads((prev) => prev.filter((x) => x.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error("Failed to delete lead", err);
      setError("Failed to delete lead");
    }
  };

  /* ---------------------------
     Multi-select helpers
  --------------------------- */
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAllVisible = () => {
    const visibleIds = leads.map((l) => l.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const deleteSelected = async () => {
    try {
      if (selectedIds.length === 0) return;
      await axios.post(`${API_BASE}/leads/delete-multiple`, { ids: selectedIds });
      setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete selected leads", err);
      setError("Failed to delete selected leads");
    }
  };

  /* ---------------------------
     Download PDF / Excel
  --------------------------- */
  const downloadLeadPDF = (lead: Lead) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Lead Details", 14, 20);

    doc.setFontSize(12);
    doc.text(`ID: ${lead.id}`, 14, 40);
    doc.text(`Name: ${lead.name}`, 14, 50);
    doc.text(`Email: ${lead.email}`, 14, 60);
    doc.text(`Phone: ${lead.phone}`, 14, 70);
    doc.text(`Course: ${lead.course}`, 14, 80);
    doc.text(`Status: ${lead.status}`, 14, 90);
    doc.text(`Contacted On: ${lead.contactedOn}`, 14, 100);

    const messageLines = doc.splitTextToSize(lead.message ?? "", 180);
    doc.text("Message:", 14, 115);
    doc.text(messageLines, 14, 125);

    doc.save(`Lead-${lead.name}.pdf`);
  };

  const downloadExcel = () => {
    const wsData = [
      ["ID", "Name", "Email", "Phone", "Course", "Status", "Contacted On", "Message"],
      ...leads.map((l) => [l.id, l.name, l.email, l.phone, l.course, l.status, l.contactedOn, l.message]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Course Leads");
    XLSX.writeFile(wb, "Course_Leads.xlsx");
  };

  /* ---------------------------
     Pagination helper
  --------------------------- */
  function getPageRange(current: number, last: number, delta = 2) {
    const range: (number | "gap")[] = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(last, current + delta);

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i <= right)) {
        range.push(i);
      } else if (range[range.length - 1] !== "gap") {
        range.push("gap");
      }
    }
    return range;
  }

  /* ---------------------------
     Small loading skeleton component
  --------------------------- */
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 w-44 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-72 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  /* ---------------------------
     RENDER
  --------------------------- */
  return (
    <>
      <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-slate-800">Course Leads</h3>
            <p className="text-sm text-slate-500 mt-1">Minimal — fast — focused.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-xl w-72 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={downloadExcel}
                className="px-4 py-2 bg-white border rounded-xl shadow-sm text-sm hover:shadow transition"
                title="Export current page to Excel"
              >
                <FaFileDownload className="inline mr-2" /> Export
              </button>

              {selectedIds.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl shadow text-sm"
                >
                  Delete ({selectedIds.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters & controls */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 border rounded-xl text-sm focus:outline-none min-w-[160px]"
              >
                <option value="">All</option>
                {allCourses.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">From</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 border rounded-xl text-sm focus:outline-none" />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">To</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 border rounded-xl text-sm focus:outline-none" />
            </div>

            <button
              onClick={() => {
                setStatusFilter("");
                setCourseFilter("");
                setDateFrom("");
                setDateTo("");
                setSearchTerm("");
                setSortBy("id");
                setSortDir("desc");
                setPageSize(20);
              }}
              className="px-3 py-2 text-sm text-slate-600 bg-white border rounded-xl hover:shadow-sm"
            >
              Reset
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Sort</label>
              <select
                value={`${sortBy}:${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split(":");
                  setSortBy(sb);
                  setSortDir(sd as "asc" | "desc");
                }}
                className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
              >
                <option value="id:desc">Newest</option>
                <option value="id:asc">Oldest</option>
                <option value="name:asc">Name A → Z</option>
                <option value="name:desc">Name Z → A</option>
                <option value="course:asc">Course A → Z</option>
                <option value="course:desc">Course Z → A</option>
                <option value="status:asc">Status A → Z</option>
                <option value="status:desc">Status Z → A</option>
                <option value="created_at:desc">Contacted Newest</option>
                <option value="created_at:asc">Contacted Oldest</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Per page</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border rounded-xl text-sm focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table (desktop) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
              <tr className="bg-white text-left text-slate-600 text-sm border-b border-gray-100">
                <th className="py-3 px-4 font-medium">
                  <input type="checkbox" checked={leads.length > 0 && leads.every((l) => selectedIds.includes(l.id))} onChange={toggleSelectAllVisible} />
                </th>
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Course</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Contacted On</th>
                <th className="p-3 font-medium text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                // table skeleton rows
                Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-3 w-3 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-8 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-28 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-8 w-24 bg-gray-200 rounded" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="text-sm text-slate-700 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />
                    </td>

                    <td className="py-3 px-4">{lead.id}</td>
                    <td className="py-3 px-4">{lead.name}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{lead.email}</td>
                    <td className="py-3 px-4 text-sm">{lead.phone}</td>
                    <td className="py-3 px-4">{lead.course}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-lg font-medium ${
                          lead.status === "New"
                            ? "bg-blue-50 text-blue-600"
                            : lead.status === "Contacted"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-sm">{lead.contactedOn}</td>

                    <td className="p-3 flex gap-3 justify-center">
                      <button onClick={() => { setSelectedLead(lead); setIsOpen(true); }} className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm" title="View">
                        <FaEye className="text-slate-600" />
                      </button>

                      <button onClick={() => downloadLeadPDF(lead)} className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm" title="Download PDF">
                        <FaFileDownload className="text-slate-600" />
                      </button>

                      <button onClick={() => deleteLead(lead.id)} className="bg-white border px-2 py-1 rounded-lg hover:shadow-sm text-red-600" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden mt-4 space-y-3">
          {loading ? (
            <LoadingSkeleton />
          ) : leads.length === 0 ? (
            <div className="text-center text-slate-500">No leads found.</div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-800">{lead.name}</h4>
                      <span className="text-xs text-slate-500">#{lead.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{lead.email}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                    <p className="text-xs text-slate-600 mt-2">{lead.course}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${lead.status === "New" ? "bg-blue-50 text-blue-600" : lead.status === "Contacted" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {lead.status}
                    </span>

                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedLead(lead); setIsOpen(true); }} className="p-2 bg-white border rounded-lg">
                        <FaEye />
                      </button>
                      <button onClick={() => downloadLeadPDF(lead)} className="p-2 bg-white border rounded-lg">
                        <FaFileDownload />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
          <div className="text-sm text-slate-600">
            Showing page <span className="font-medium text-slate-800">{currentPage}</span> of <span className="font-medium text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-xl border bg-white hover:shadow-sm disabled:opacity-50">
              <FaChevronLeft />
            </button>

            <div className="flex items-center gap-1 bg-white border rounded-xl p-2 shadow-sm">
              {getPageRange(currentPage, totalPages).map((p, idx) =>
                p === "gap" ? (
                  <span key={`g-${idx}`} className="px-2 text-slate-400">…</span>
                ) : (
                  <button key={p} onClick={() => setCurrentPage(Number(p))} className={`px-3 py-1 rounded-md text-sm ${p === currentPage ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-gray-100"}`}>
                    {p}
                  </button>
                )
              )}
            </div>

            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-2 rounded-xl border bg-white hover:shadow-sm disabled:opacity-50">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-[92%] max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-50 transform transition-all">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Lead Details</h3>
                <p className="text-sm text-slate-500 mt-1">ID #{selectedLead.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg border bg-white">
              <Detail label="Name" value={selectedLead.name} />
              <Detail label="Email" value={selectedLead.email} />
              <Detail label="Phone" value={selectedLead.phone} />
              <Detail label="Course" value={selectedLead.course} />
              <Detail label="Status" value={selectedLead.status} />
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => updateStatus("New")} className="px-3 py-1 rounded-xl bg-white border text-sm">New</button>
              <button onClick={() => updateStatus("Contacted")} className="px-3 py-1 rounded-xl bg-white border text-sm">Contacted</button>
              <button onClick={() => updateStatus("Closed")} className="px-3 py-1 rounded-xl bg-white border text-sm">Closed</button>
            </div>

            <MessageBox label="Message" value={selectedLead.message ?? ""} />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl bg-white border">Close</button>
              <button onClick={() => { downloadLeadPDF(selectedLead); }} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Download PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg shadow">
          {error}
        </div>
      )}
    </>
  );
}

