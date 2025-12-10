"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FaSearch, FaEye } from "react-icons/fa";
import axios from "@/utils/axios";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  course_name?: string;
  created_at?: string;
}

interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  totalBlogs: number;
  totalLeads: number;
  totalCategories: number;
}

interface DashboardContentProps {
  stats: DashboardStats;
  loading: boolean;
}

export default function DashboardContent({
  stats,
  loading,
}: DashboardContentProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [monthlyData, setMonthlyData] = useState<
    Array<{ month: string; leads: number }>
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [leadsLoading, setLeadsLoading] = useState(true);

  useEffect(() => {
    const fetchLeadsAndGenerateChart = async () => {
      try {
        setLeadsLoading(true);

        // Fetch leads
        const leadsRes = await axios.get("/leads");
        const leadsData = Array.isArray(leadsRes.data)
          ? leadsRes.data
          : leadsRes.data?.data || [];

        // Take only the latest 10 leads
        const latestLeads = leadsData.slice(0, 10);
        setLeads(latestLeads);

        // Generate monthly leads data from the leads' created_at dates
        const monthCounts: Record<string, number> = {};
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Initialize all months to 0
        monthNames.forEach((month) => {
          monthCounts[month] = 0;
        });

        // Count leads by month
        leadsData.forEach((lead: Lead) => {
          if (lead.created_at) {
            const date = new Date(lead.created_at);
            const monthIndex = date.getMonth();
            const month = monthNames[monthIndex];
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          }
        });

        // Normalize to 0-1 scale (max count / highest count)
        const counts = Object.values(monthCounts);
        const maxCount = Math.max(...counts, 1);
        const normalizedData = monthNames.map((month) => ({
          month,
          leads: parseFloat((monthCounts[month] / maxCount).toFixed(2)),
        }));

        setMonthlyData(normalizedData);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLeadsLoading(false);
      }
    };

    fetchLeadsAndGenerateChart();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.course_name &&
        lead.course_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      {/* ✅ Chart Section */}
      <section className="bg-white p-8 rounded-xl border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Monthly Leads (Normalized 0–1)
        </h3>

        <div style={{ width: "100%", height: 450 }}>
          <ResponsiveContainer>
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              {/* ✅ Gradient fill */}
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A3F66" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1A3F66" stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#444", fontSize: 14, fontWeight: 500 }}
                axisLine={{ stroke: "#ccc" }}
              />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
                tickFormatter={(value) => value.toFixed(1)}
                tick={{ fill: "#444", fontSize: 13 }}
                axisLine={{ stroke: "#ccc" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                cursor={{ stroke: "#1A3F66", strokeWidth: 1, opacity: 0.1 }}
              />

              {/* ✅ Clean, thin line with soft gradient fill */}
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#1A3F66"
                strokeWidth={1.5} // thinner line
                fill="url(#colorLeads)"
                dot={{
                  r: 4,
                  stroke: "#1A3F66",
                  strokeWidth: 1.5,
                  fill: "#fff",
                }}
                activeDot={{
                  r: 6,
                  fill: "#1A3F66",
                  stroke: "#fff",
                  strokeWidth: 1.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ✅ Leads Table */}
      <section className="bg-white p-6 rounded-xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Latest 10 Course Leads
          </h3>

          <div className="relative mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700 text-sm">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Student Name</th>
                <th className="py-3 px-4 font-semibold">Student Email</th>
                <th className="py-3 px-4 font-semibold">Student Phone</th>
                <th className="py-3 px-4 font-semibold">Course Name</th>
                <th className="py-3 px-4 font-semibold">Contacted On</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leadsLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 text-center text-gray-500 italic"
                  >
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{lead.id}</td>
                    <td className="py-3 px-4">{lead.name}</td>
                    <td className="py-3 px-4">{lead.email}</td>
                    <td className="py-3 px-4">{lead.phone}</td>
                    <td className="py-3 px-4">
                      {lead.course_name || "N/A"}
                    </td>
                    <td className="py-3 px-4">{formatDate(lead.created_at)}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 transition">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-4 text-center text-gray-500 italic"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
