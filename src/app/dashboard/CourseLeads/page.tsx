"use client";


import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { useCallback, useEffect, useMemo, useState, ReactNode } from "react";

import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
   Small helpers & types
---------------------------- */
type Lead = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  course?: string;
  courses?: string[];
  contactedOn?: string;
  status?: string;
  leadSource?: string;
  admin_notes?: string;
  message?: string;
  created_at?: string;
};

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-100">
      <p className="text-slate-500 font-medium text-sm">{label}</p>
      <p className="text-slate-800 text-sm">{value}</p>
    </div>
  );
}

function MessageBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <label className="text-slate-600 font-medium text-sm">{label}</label>
      <div
        className="mt-2 p-4 bg-slate-50 rounded-xl border-l-4 border-slate-200 text-slate-800 leading-relaxed shadow-sm text-justify"
        style={{ whiteSpace: "pre-line" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ----------------------------
   Color map for statuses (recommended)
   New: sky-600, Contacted: amber-600, Closed: emerald-600
---------------------------- */
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; ring?: string }
> = {
  New: { bg: "bg-sky-50", text: "text-sky-700" },
  Contacted: { bg: "bg-amber-50", text: "text-amber-700" },
  Closed: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

/* ----------------------------
   Component
---------------------------- */
export default function CourseLeads(): JSX.Element {
  // data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allCourses, setAllCourses] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [courseMap, setCourseMap] = useState<Record<string, string>>({});

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>("");

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

  const router = useRouter();

  /* -----------------------------------
     fetchLeads - robust normalizing
     - uses params consistent with backend expectations
     - sets courses & course fields for frontend flexibility
  ----------------------------------- */
  const fetchLeads = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, any> = {
          page:currentPage,
          limit: pageSize,
          per_page: pageSize,
          page_size: pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (sortBy) params.sort_by = sortBy;
        if (sortDir) params.sort_dir = sortDir;
        // include alternative param names to improve backend compatibility
        if (sortBy) params.order_by = sortBy;
        if (sortDir) params.order_dir = sortDir;
        if (sortBy && sortDir) params.sort = `${sortBy}:${sortDir}`;
        if (sortBy) params.order = sortBy;
        if (sortDir) params.direction = sortDir;
        if (statusFilter) params.status = statusFilter;
        if (courseFilter) params.course = courseFilter;
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;


        // Debug log: outgoing params
        console.debug("[CourseLeads] fetchLeads request params:", params);

        const res = await axios.get("/leads", {
          params,
          headers: { Accept: "application/json" },
        });


        console.debug("[CourseLeads] fetchLeads response status:", res.status);

        const body = res.data ?? {};
        // support bodies like: { data: [...], current_page, last_page, total }
        // or arrays returned directly
        let data: any[] = [];
        if (Array.isArray(body)) data = body;
        else if (Array.isArray(body.data)) data = body.data;
        else if (Array.isArray(body.items)) data = body.items;
        else data = [];

        const normalized: Lead[] = data.map((r: any) => {
          const contactedCandidate =
            r.contacted_on ??
            r.contactedOn ??
            r.contacted_on ??
            r.created_at ??
            r.createdAt ??
            r.createdAt;
          // Normalize courses to array and course to joined string
          const coursesArr: string[] = (() => {
            try {
              // If courses is an array of names/objects or ids
              if (Array.isArray(r.courses) && r.courses.length) {
                return r.courses
                  .map((c: any) => {
                    // numeric id -> map via courseMap
                    if (
                      typeof c === "number" ||
                      (typeof c === "string" && /^\d+$/.test(c))
                    ) {
                      return courseMap[String(c)] ?? String(c);
                    }
                    return typeof c === "string"
                      ? c
                      : c?.name || c?.title || String(c);
                  })
                  .filter(Boolean);
              }
              if (Array.isArray(r.course) && r.course.length) {
                return r.course
                  .map((c: any) => {
                    if (
                      typeof c === "number" ||
                      (typeof c === "string" && /^\d+$/.test(c))
                    ) {
                      return courseMap[String(c)] ?? String(c);
                    }
                    return typeof c === "string"
                      ? c
                      : c?.name || c?.title || String(c);
                  })
                  .filter(Boolean);
              }
              // course might be a numeric id (as number or string)
              if (
                typeof r.course === "number" ||
                (typeof r.course === "string" && /^\d+$/.test(r.course))
              ) {
                const key = String(r.course);
                return [courseMap[key] ?? key];
              }
              if (typeof r.course === "string") return [r.course];
              if (r.course && typeof r.course === "object") {
                return [
                  r.course.name ?? r.course.title ?? r.course.course_name,
                ].filter(Boolean);

        const body = res.data;
        const data = Array.isArray(body.data) ? body.data : [];

        const normalized: Lead[] = data.map((r: any) => {
          const contactedCandidate =
            r.contacted_on ?? r.created_at ?? r.createdAt ?? r.created_at;
          // Normalize courses to array and course to joined string
          const coursesArr: string[] = (() => {
            try {
              if (Array.isArray(r.courses) && r.courses.length) {
                return r.courses.map((c: any) => (typeof c === "string" ? c : c?.name || c?.title || String(c))).filter(Boolean);
              }
              if (Array.isArray(r.course) && r.course.length) {
                return r.course.map((c: any) => (typeof c === "string" ? c : c?.name || c?.title || String(c))).filter(Boolean);
              }
              if (typeof r.course === "string") return [r.course];
              if (r.course && typeof r.course === "object") {
                return [r.course.name ?? r.course.title ?? r.course.course_name].filter(Boolean);

              }
              if (r.course_name) return [r.course_name];
              return [];
            } catch {
              return [];
            }
          })();


          // prefer mapped array (multiple courses) otherwise fall back to course name/title or mapped id
          const joinedCourse = coursesArr.length
            ? coursesArr.join(", ")
            : typeof r.course === "number" ||
              (typeof r.course === "string" && /^\d+$/.test(r.course))
            ? courseMap[String(r.course)] ?? String(r.course)
            : r.course_name ?? r.course ?? r.title ?? "";

          const joinedCourse = (coursesArr.length ? coursesArr.join(", ") : (r.course_name ?? r.course ?? ""));


          return {
            id: r.id,
            name: r.name,
            email: r.email ?? "",
            phone: r.phone ?? "",
            courses: coursesArr,
            course: joinedCourse,
            admin_notes: r.admin_notes ?? r.adminNotes ?? "",

            contactedOn: contactedCandidate
              ? new Date(contactedCandidate).toLocaleString()
              : "—",
            status: r.status ?? "New",
            // leadSource: try explicit fields first, then look inside `meta` (object or JSON)
            leadSource: (() => {
              // direct fields
              const direct = r.lead_source ?? r.source ?? r.leadSource;
              if (direct) return direct;

              // meta may be an object or JSON string
              let meta: any = r.meta ?? r.meta_data ?? r.metaFields ?? null;
              if (!meta && r.meta === null && r.meta !== undefined)
                meta = r.meta;
              if (typeof meta === "string") {
                try {
                  meta = JSON.parse(meta);
                } catch {
                  // leave as string
                }
              }

              if (meta && typeof meta === "object") {
                return (
                  meta.lead_source ??
                  meta.leadSource ??
                  meta.source ??
                  meta.page ??
                  meta.utm_source ??
                  meta.referrer ??
                  ""
                );
              }

              return "";
            })(),

            contactedOn: contactedCandidate ? new Date(contactedCandidate).toLocaleString() : "—",
            status: r.status ?? "New",
            leadSource: r.lead_source ?? r.source ?? r.leadSource ?? "",

            message: r.message ?? "",
            created_at: r.created_at ?? r.createdAt,
          };
        });

        setLeads(normalized);
        console.debug("[CourseLeads] fetched leads:", normalized.slice(0, 10));
        setCurrentPage(
          body.current_page ?? body.page ?? body.currentPage ?? currentPage
        );
        setTotalPages(
          body.last_page ??
            body.lastPage ??
            body.total_pages ??
            Math.max(1, Math.ceil((body.total ?? normalized.length) / pageSize))
        );


        // do not modify course list here; course mapping comes from /courses endpoint
        // also expose server pagination meta for debugging
        console.debug(
          "[CourseLeads] pagination meta -> current:",
          body.current_page ?? body.page ?? body.currentPage ?? page,
          "last:",
          body.last_page ?? body.lastPage ?? body.total_pages
        );
      } catch (err: any) {
        console.error("Failed to load leads", err);
        const status = err?.response?.status;
        setError(
          status ? `Failed to load leads: ${status}` : "Failed to load leads"
        );

        // merge courses seen this page into allCourses (avoid loops)
        setAllCourses((prev) => {
          const s = new Set(prev);
          normalized.forEach((l) => {
            if (l.course) s.add(l.course);
            if (l.courses && l.courses.length) l.courses.forEach((c) => s.add(c));
          });
          return Array.from(s).sort();
        });
      } catch (err: any) {
        console.error("Failed to load leads", err);
        const status = err?.response?.status;
        setError(status ? `Failed to load leads: ${status}` : "Failed to load leads");

      } finally {
        setLoading(false);
      }
    },

    [
      pageSize,
      debouncedSearch,
      sortBy,
      sortDir,
      statusFilter,
      courseFilter,
      dateFrom,
      dateTo,
      courseMap,
    ]
  );

  // Fetch course metadata (id -> title) once on mount so we can map incoming lead course ids to names

    [pageSize, debouncedSearch, sortBy, sortDir, statusFilter, courseFilter, dateFrom, dateTo]
  );

  // initial fetch & when page changes

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      try {
        const res = await axios.get("/courses", {
          headers: { Accept: "application/json" },
        });
        const list = Array.isArray(res.data.data)
          ? res.data.data
          : res.data || [];
        const map: Record<string, string> = {};
        const normalizedCourses: Array<{ id: string; title: string }> = [];
        list.forEach((c: any) => {
          const id = String(c.id ?? c.course_id ?? c.courseId ?? "");
          const title = c.title ?? c.course_name ?? c.name ?? String(id);
          if (id) {
            map[id] = title || id;
            normalizedCourses.push({ id, title });
          }
        });
        if (mounted) {
          setCourseMap(map);
          // populate the courses dropdown with id/title pairs
          setAllCourses(normalizedCourses);
        }
      } catch (e: unknown) {
        // ignore - mapping will fallback to ids or server-provided names
        console.debug("Could not load course metadata for mapping", e);
      }
    };


    void loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  // initial fetch & when page changes
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {

    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 450);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // reset page to 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, courseFilter, dateFrom, dateTo]);

  // sync adminNotes when selectedLead changes
  useEffect(() => {
    if (selectedLead) setAdminNotes(selectedLead.admin_notes ?? "");
    else setAdminNotes("");
  }, [selectedLead]);

  // sync adminNotes when selectedLead changes
  useEffect(() => {
    if (selectedLead) setAdminNotes(selectedLead.admin_notes ?? "");
    else setAdminNotes("");
  }, [selectedLead]);

  /* ---------------------------
     CRUD & helpers (use stable callbacks)
  --------------------------- */
  const ensureCsrf = useCallback(async () => {
    try {
      await axios.get("/sanctum/csrf-cookie");
    } catch {
      // ignore - some setups won't need this
    }
  }, []);

  const authCfg = useCallback(() => {
    const keys = ["token", "admin_token", "access_token"];
    if (typeof window === "undefined") return { withCredentials: true };
    let token: string | null = null;
    for (const k of keys) {
      const t = localStorage.getItem(k);
      if (t) {
        token = t;
        break;
      }
    }

    return token
      ? { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      : { withCredentials: true };

    return token ? { withCredentials: true, headers: { Authorization: `Bearer ${token}` } } : { withCredentials: true };

  }, []);

  const updateStatus = useCallback(
    async (status: string) => {

      if (!selectedLead) return toast.error("No lead selected");

      if (!selectedLead) return;

      try {
        await ensureCsrf();
        const cfg = authCfg();
        await axios.put(`/leads/${selectedLead.id}/status`, { status }, cfg);

        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, status } : l))
        );

        setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, status } : l)));

        setSelectedLead((s) => (s ? { ...s, status } : s));
        toast.success("Status updated");
      } catch (err: any) {
        console.error("updateStatus error", err);

        const statusCode = err?.response?.status;
        const serverMsg =
          err?.response?.data?.message ||
          JSON.stringify(err?.response?.data || err.message);
        if (statusCode === 401) {

        if (err?.response?.status === 401) {

          toast.error("Unauthenticated. Redirecting to login...");
          try {
            localStorage.removeItem("admin_token");
          } catch {}
          router.push("/");

        } else if (statusCode === 404) {
          toast.error(`Not found (404): ${serverMsg}`);
        } else if (statusCode === 422) {
          toast.error("Validation failed when updating status");
        } else {
          toast.error(
            "Failed to update status: " + (err?.message || serverMsg)
          );

        } else {

          setError("Failed to update status");
        }
      }
    },
    [selectedLead, ensureCsrf, authCfg, router]
  );


  // Debug helper: log request headers/cookies/auth state from backend debug endpoint
  const debugRequest = useCallback(async () => {
    try {
      const res = await axios.get("/debug/request");
      console.log("/api/debug/request ->", res.data);
      toast.success("Debug info logged to console (see DevTools)");
    } catch (e: any) {
      console.error("debugRequest error", e);
      toast.error("Debug request failed: " + (e?.message || "unknown"));
    }
  }, []);

  const saveAdminNotes = useCallback(async () => {
    if (!selectedLead) return;
    try {
      await ensureCsrf();
      const cfg = authCfg();


      // Send admin_notes to the protected updateStatus endpoint which accepts admin_notes as well.
      const payload: Record<string, unknown> = { admin_notes: adminNotes };

      const resp = await axios.put(
        `/leads/${selectedLead.id}/status`,
        payload,
        cfg
      );

      // Update local state from response if server returned the updated lead, otherwise apply optimistic update
      const updated = resp?.data?.data;
      if (updated && typeof updated === "object") {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id
              ? { ...l, admin_notes: updated.admin_notes ?? adminNotes }
              : l
          )
        );
        setSelectedLead((s) =>
          s ? { ...s, admin_notes: updated.admin_notes ?? adminNotes } : s
        );
      } else {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id ? { ...l, admin_notes: adminNotes } : l
          )
        );
        setSelectedLead((s) => (s ? { ...s, admin_notes: adminNotes } : s));
      }

      toast.success("Notes saved");

      
    } catch (err: any) {
      console.error("saveAdminNotes error", err);

      const status = err?.response?.status;
      // Surface helpful messages for common cases
      if (status === 401) {
        toast.error("Unauthenticated. Please login.");
      } else if (status === 404) {
        // 404 likely indicates the protected route isn't reachable (missing auth/session) or wrong baseURL
        const detail =
          err?.response?.data?.message ||
          JSON.stringify(err?.response?.data || err.message);
        toast.error(`Save failed (404): ${detail}`);
      } else if (status === 422) {
        toast.error("Validation failed while saving notes.");
      } else {
        toast.error("Failed to save notes");
      }
    }

    // refresh list after save to ensure server state is reflected in table
  }, [selectedLead, adminNotes, ensureCsrf, authCfg]);

  // Auto-save admin notes: debounce user typing and save when changed from server value
  useEffect(() => {
    if (!selectedLead) return;
    const original = selectedLead.admin_notes ?? "";
    // if nothing changed, don't schedule save
    if (adminNotes === original) return;

    const timer = setTimeout(() => {
      // fire-and-forget; saveAdminNotes already surfaces toasts for errors
      void saveAdminNotes();
    }, 1200);

    return () => clearTimeout(timer);
  }, [adminNotes, selectedLead, saveAdminNotes]);


      await axios.put(`/leads/${selectedLead.id}/status`, { admin_notes: adminNotes }, cfg);
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? { ...l, admin_notes: adminNotes } : l)));
      setSelectedLead((s) => (s ? { ...s, admin_notes: adminNotes } : s));
      toast.success("Notes saved");
    } catch (err: any) {
      console.error("saveAdminNotes error", err);
      if (err?.response?.status === 401) toast.error("Unauthenticated. Please login.");
      else toast.error("Failed to save notes");
    }
  }, [selectedLead, adminNotes, ensureCsrf, authCfg]);


  const deleteLead = useCallback(
    async (id: number) => {
      try {
        const cfg = authCfg();
        await axios.delete(`/leads/${id}`, cfg);
        setLeads((prev) => prev.filter((x) => x.id !== id));
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        toast.success("Deleted");
      } catch (err: any) {
        console.error("deleteLead error", err);

        if (err?.response?.status === 401)
          toast.error("Unauthenticated. Please login.");

        if (err?.response?.status === 401) toast.error("Unauthenticated. Please login.");

        else setError("Failed to delete lead");
      }
    },
    [authCfg]
  );

  const deleteSelected = useCallback(async () => {
    try {
      if (!selectedIds.length) return;
      const cfg = authCfg();
      await axios.post("/leads/delete-multiple", { ids: selectedIds }, cfg);
      setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      setSelectedIds([]);
      toast.success("Deleted selected");
    } catch (err: any) {
      console.error("deleteSelected error", err);

      if (err?.response?.status === 401)
        toast.error("Unauthenticated. Please login.");

      if (err?.response?.status === 401) toast.error("Unauthenticated. Please login.");

      else setError("Failed to delete selected leads");
    }
  }, [selectedIds, authCfg]);

  /* ---------------------------
     Exports (PDF / Excel)
  --------------------------- */
  const downloadLeadPDF = useCallback((lead: Lead) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Lead Details", 14, 20);

    doc.setFontSize(11);
    doc.text(`ID: ${lead.id}`, 14, 36);
    doc.text(`Name: ${lead.name}`, 14, 44);
    doc.text(`Email: ${lead.email}`, 14, 52);
    doc.text(`Phone: ${lead.phone}`, 14, 60);
    doc.text(`Course: ${lead.course}`, 14, 68);
    doc.text(`Status: ${lead.status}`, 14, 76);
    doc.text(`Contacted On: ${lead.contactedOn}`, 14, 84);

    const messageLines = doc.splitTextToSize(lead.message ?? "", 180);
    doc.text("Message:", 14, 96);
    doc.text(messageLines, 14, 104);

    doc.save(`Lead-${String(lead.name).replace(/\s+/g, "_")}.pdf`);
  }, []);

  const downloadExcel = useCallback(() => {
    const wsData = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Course",
        "Status",
        "Contacted On",
        "Message",
      ],
      ...leads.map((l) => [
        l.id,
        l.name,
        l.email,
        l.phone,
        l.course,
        l.status,
        l.contactedOn,
        l.message,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Course Leads");
    XLSX.writeFile(wb, "Course_Leads.xlsx");
  }, [leads]);

  /* ---------------------------
     Selection helpers
  --------------------------- */
  const toggleSelect = useCallback((id: number) => {

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  }, []);

  const toggleSelectAllVisible = useCallback(() => {
    const visibleIds = leads.map((l) => l.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allSelected)
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    else
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  }, [leads, selectedIds]);

  const gotoPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

    if (allSelected) setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  }, [leads, selectedIds]);


  /* ---------------------------
     Pagination helper
  --------------------------- */
  function getPageRange(current: number, last: number, delta = 2) {
    const range: (number | "gap")[] = [];
    const left = Math.max(1, current - delta);
    const right = Math.min(last, current + delta);
    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= left && i <= right)) range.push(i);
      else if (range[range.length - 1] !== "gap") range.push("gap");
    }
    return range;
  }

  /* ---------------------------
     Derived values (memo)
     - improves rendering performance for big lists
  --------------------------- */
  const visibleLeads = useMemo(() => leads, [leads]);

  /* ---------------------------
     Accessibility: polite live region for errors
  --------------------------- */
  const ErrorLive = ({ message }: { message: string | null }) =>
    message ? (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg shadow"
      >
        {message}
      </div>
    ) : null;

  /* ---------------------------
     Render
  --------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="mx-auto max-w-7xl" aria-labelledby="page-title">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>

              <h1
                id="page-title"
                className="text-3xl font-semibold text-slate-900"
              >
                Course Leads
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage leads — filter, export and follow up quickly.
              </p>

              <h1 id="page-title" className="text-3xl font-semibold text-slate-900">Course Leads</h1>
              <p className="text-sm text-slate-500 mt-1">Manage leads — filter, export and follow up quickly.</p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="relative">
                <FaSearch className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  aria-label="Search leads"
                  type="text"
                  placeholder="Search by name, email, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadExcel}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm hover:shadow-md transition flex items-center gap-2"
                  title="Export current page to Excel"
                  aria-label="Export leads to Excel"
                >
                  <FaFileDownload />
                  Export
                </button>

                {selectedIds.length > 0 && (
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 bg-sky-600 text-white rounded-xl shadow-md hover:bg-sky-700 transition text-sm"
                    aria-label={`Delete ${selectedIds.length} selected leads`}
                  >
                    Delete ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
              <div className="flex flex-col">
                <label htmlFor="statusFilter" className="text-xs font-medium text-slate-600 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="courseFilter" className="text-xs font-medium text-slate-600 mb-1">
                  Course
                </label>
                <select
                  id="courseFilter"
                  aria-label="Filter by course"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none"
                >
                  <option value="">All Courses</option>
                  {allCourses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="dateFrom" className="text-xs font-medium text-slate-600 mb-1">From</label>
                <input id="dateFrom" aria-label="Filter from date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none" />
              </div>

              <div className="flex flex-col">
                <label htmlFor="dateTo" className="text-xs font-medium text-slate-600 mb-1">To</label>
                <input id="dateTo" aria-label="Filter to date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none" />
              </div>

              <div className="flex items-end">
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
                    setSelectedIds([]);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm hover:shadow-sm"
                >
                  Reset
                </button>
              </div>

              <div className="col-span-2 flex items-end justify-end gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="sortBy" className="text-xs text-slate-600">Sort</label>
                  <select
                    id="sortBy"
                    value={`${sortBy}:${sortDir}`}
                    onChange={(e) => {
                      const [sb, sd] = e.target.value.split(":");
                      setSortBy(sb);
                      setSortDir(sd as "asc" | "desc");
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none"
                    aria-label="Sort leads"
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
                  <label htmlFor="pageSize" className="text-xs text-slate-600">Per page</label>
                  <select id="pageSize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none" aria-label="Leads per page">
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full" role="table" aria-label="Course leads table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-white">
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">
                    <input type="checkbox" aria-label="Select all visible leads" checked={visibleLeads.length > 0 && visibleLeads.every((l) => selectedIds.includes(l.id))} onChange={toggleSelectAllVisible} />
                  </th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">ID</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Name</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Email</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Phone</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Course</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Status</th>
                  <th className="py-3 px-4 text-left text-slate-500 text-sm">Lead Source</th>
                  <th className="py-3 px-4 text-center text-slate-500 text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-4 px-4"><div className="h-3 w-3 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-8 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-28 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-32 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-20 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4"><div className="h-3 w-24 bg-slate-200 rounded" /></td>
                      <td className="py-4 px-4 text-center"><div className="h-8 w-24 bg-slate-200 rounded" /></td>
                    </tr>
                  ))
                ) : visibleLeads.length === 0 ? (
                  <tr><td colSpan={9} className="p-6 text-center text-slate-500">No leads found.</td></tr>
                ) : (
                  visibleLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="py-4 px-4 align-top">
                        <input aria-label={`Select lead ${lead.name}`} type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />
                      </td>

                      <td className="py-4 px-4 align-top text-sm text-slate-700">{lead.id}</td>
                      <td className="py-4 px-4 align-top text-sm text-slate-800">{lead.name}</td>

                      <td className="py-4 px-4 align-top text-xs text-slate-500">{lead.email}</td>
                      <td className="py-4 px-4 align-top text-sm text-slate-700">{lead.phone}</td>

                      <td className="py-4 px-4 align-top text-sm text-slate-700 max-w-[260px] truncate" title={lead.course}>
                        {lead.course}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${(STATUS_STYLES[lead.status ?? "New"]?.bg) ?? "bg-sky-50"} ${(STATUS_STYLES[lead.status ?? "New"]?.text) ?? "text-sky-700"}`}>
                          {lead.status || "New"}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top text-sm text-slate-600">{lead.leadSource || "—"}</td>

                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex gap-2" role="group" aria-label={`Actions for lead ${lead.name}`}>
                          <button onClick={() => { setSelectedLead(lead); setIsOpen(true); }} className="bg-white border border-slate-200 px-2 py-1 rounded-md hover:shadow-sm" title={`View ${lead.name}`} aria-label={`View ${lead.name}`}>
                            <FaEye className="text-slate-600" />
                          </button>

                          <button onClick={() => downloadLeadPDF(lead)} className="bg-white border border-slate-200 px-2 py-1 rounded-md hover:shadow-sm" title={`Download ${lead.name} PDF`} aria-label={`Download ${lead.name} as PDF`}>
                            <FaFileDownload className="text-slate-600" />
                          </button>

                          <button onClick={() => deleteLead(lead.id)} className="bg-white border border-slate-200 px-2 py-1 rounded-md hover:shadow-sm text-red-600" title={`Delete ${lead.name}`} aria-label={`Delete ${lead.name}`}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden p-4">
            {loading ? <LoadingSkeleton /> : visibleLeads.length === 0 ? <div className="text-center text-slate-500">No leads found.</div> : visibleLeads.map((lead) => (
              <div key={lead.id} className="mb-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-800 truncate">{lead.name}</h4>
                      <span className="text-xs text-slate-400">#{lead.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">{lead.email}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                    <p className="text-xs text-slate-600 mt-2 truncate" title={lead.course}>{lead.course}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${lead.status === "New" ? "bg-sky-50 text-sky-600" : lead.status === "Contacted" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {lead.status}
                    </span>

                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedLead(lead); setIsOpen(true); }} className="p-2 bg-white border rounded-lg" aria-label={`View ${lead.name}`}>
                        <FaEye />
                      </button>
                      <button onClick={() => downloadLeadPDF(lead)} className="p-2 bg-white border rounded-lg" aria-label={`Download ${lead.name} PDF`}>
                        <FaFileDownload />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-slate-600" aria-live="polite">
              Showing page <span className="font-medium text-slate-800">{currentPage}</span> of <span className="font-medium text-slate-800">{totalPages}</span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-2 py-1 disabled:opacity-50" aria-label="Previous page">
                <FaChevronLeft />
              </button>

              <nav className="flex items-center gap-2" aria-label="Pagination">
                {getPageRange(currentPage, totalPages).map((p, idx) =>
                  p === "gap" ? (
                    <span key={`g-${idx}`} className="text-slate-400">…</span>
                  ) : (
                    <button key={p} onClick={() => setCurrentPage(Number(p))} className={`text-sm ${p === currentPage ? "text-slate-900 font-medium" : "text-slate-600 hover:underline"}`} aria-current={p === currentPage ? "page" : undefined}>
                      {p}
                    </button>
                  )
                )}
              </nav>

              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 disabled:opacity-50" aria-label="Next page">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-[94%] max-w-2xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-50 transform transition-all">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 id="lead-modal-title" className="text-lg font-semibold text-slate-900">Lead Details</h3>
                <p className="text-sm text-slate-500 mt-1">ID #{selectedLead.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg border bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Detail label="Name" value={selectedLead.name} />
                  <Detail label="Email" value={selectedLead.email} />
                  <Detail label="Phone" value={selectedLead.phone} />
                </div>

                <div>
                  <Detail label="Status" value={selectedLead.status} />
                  <Detail label="Lead Source" value={selectedLead.leadSource || "—"} />
                  <Detail label="Contacted On" value={selectedLead.contactedOn || "—"} />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm text-slate-600 font-medium">Courses</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(selectedLead.courses && selectedLead.courses.length > 0 ? selectedLead.courses : selectedLead.course ? [selectedLead.course] : [])
                    .map((c, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">{c}</span>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateStatus("New")}
                className="px-3 py-1 rounded-xl bg-white border text-sm"
              >
                New
              </button>
              <button
                onClick={() => updateStatus("Contacted")}
                className="px-3 py-1 rounded-xl bg-white border text-sm"
              >
                Contacted
              </button>
              <button
                onClick={() => updateStatus("Closed")}
                className="px-3 py-1 rounded-xl bg-white border text-sm"
              >
                Closed
              </button>
            </div>

            <MessageBox label="Message" value={selectedLead.message ?? ""} />

            <div className="mt-4">
              <label className="block text-sm text-slate-600 font-medium mb-2">Admin Notes</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} className="w-full p-3 border rounded-lg min-h-[100px]" placeholder="Add internal notes or remarks about this lead" aria-label="Admin notes" />

              <div className="flex justify-between gap-3 mt-4">
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl bg-white border">Close</button>
                <div className="flex gap-2">
                  <button onClick={() => saveAdminNotes()} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white">Save Notes</button>
                  <button onClick={() => { downloadLeadPDF(selectedLead); }} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error live region */}
      <ErrorLive message={error} />
    </div>
  );
}

/* ----------------------------
   Small Loading skeleton copy (kept at bottom)
---------------------------- */
function LoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow-sm border border-slate-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-4 w-44 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-72 bg-slate-100 rounded" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
