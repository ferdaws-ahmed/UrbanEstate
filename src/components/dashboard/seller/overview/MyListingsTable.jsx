"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { addressToString } from "@/src/lib/addressToString";

export default function MyListingsTable({ listings = [] }) {
  const { isDark } = useTheme();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const list = Array.isArray(listings) ? listings : [];

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return listings.filter((p) => {
      const addr = addressToString(p.address, p.location);
      return (
        (p.title || "").toLowerCase().includes(s) ||
        addr.toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s)
      );
    });
  }, [list, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const thumb = (images) => {
    const img = Array.isArray(images) && images[0] ? images[0] : null;
    return img || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&w=200";
  };

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b ${
          isDark ? "border-[#1a4a40]/40" : "border-slate-100"
        }`}
      >
        <h3 className="text-sm font-black tracking-widest text-slate-800 dark:text-[#cddfa0]">
          MY LISTINGS
        </h3>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className={`w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none ring-1 ${
              isDark
                ? "bg-[#061510] ring-[#1a4a40] text-white placeholder:text-slate-500"
                : "bg-slate-50 ring-slate-200 text-slate-900"
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr
              className={`text-[10px] uppercase tracking-wider ${
                isDark ? "text-slate-500 bg-[#061510]/80" : "text-slate-500 bg-slate-50"
              }`}
            >
              <th className="p-3 w-10">
                <input type="checkbox" className="rounded" aria-label="select all" />
              </th>
              <th className="p-3">Property</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3 hidden sm:table-cell">Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  কোনো লিস্টিং নেই।
                </td>
              </tr>
            ) : (
              slice.map((p) => {
                const addrLine = addressToString(p.address, p.location);
                return (
                <tr
                  key={p._id}
                  className={`border-t ${
                    isDark ? "border-[#1a4a40]/30 hover:bg-[#061510]/40" : "border-slate-100 hover:bg-slate-50/80"
                  }`}
                >
                  <td className="p-3 align-middle">
                    <input type="checkbox" className="rounded" aria-label="select row" />
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                        <Image
                          src={thumb(p.images)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/propertydetails/${p._id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-[#cddfa0] line-clamp-1"
                        >
                          {p.title || "Untitled"}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1">{addrLine}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-middle hidden md:table-cell max-w-[240px]">
                    <span className="text-slate-600 dark:text-slate-300 line-clamp-2 text-xs">
                      {p.bedrooms} BR · {p.category} · {p.area} sq ft
                      {p.description ? ` — ${p.description}` : ""}
                    </span>
                  </td>
                  <td className="p-3 align-middle">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        ["active", "published"].includes((p.status || "").toLowerCase())
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-slate-200/80 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {p.status || "draft"}
                    </span>
                  </td>
                  <td className="p-3 align-middle hidden sm:table-cell">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        isDark
                          ? "bg-[#1a4a40]/60 text-[#cddfa0]"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      Quick Actions
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          className={`flex justify-center gap-2 p-3 border-t text-xs ${
            isDark ? "border-[#1a4a40]/40" : "border-slate-100"
          }`}
        >
          <span className="text-slate-500 py-1">Pages</span>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`min-w-[28px] rounded-md py-1 ${
                page === n
                  ? isDark
                    ? "bg-[#1a4a40] text-[#cddfa0]"
                    : "bg-teal-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
