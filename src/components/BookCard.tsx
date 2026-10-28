import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  subtitle?: string;
  authors: string;
  coverImageUrl?: string;
  category: {
    id?: string;
    name: string;
    code: string;
    ddcPrefix?: string;
  };
  availabilityStatus: string;
  availableCopies: number;
  totalCopies: number;
  primaryLocation: string;
}

export default function BookCard({
  id,
  title,
  authors,
  coverImageUrl,
  category,
  availableCopies,
  primaryLocation,
}: BookCardProps) {
  const isAvailable = availableCopies > 0;

  return (
    <Link
      href={`/books/${id}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-teal-300 hover:shadow-md transition-all duration-200"
    >
      {/* Book Cover Image */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-teal-800 to-slate-900 text-white">
            <span className="text-[10px] font-mono text-teal-300">OPAC</span>
            <h4 className="font-serif text-sm font-bold line-clamp-3">{title}</h4>
            <span className="text-[10px] text-slate-300">{authors}</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-xs backdrop-blur-xs">
            {category.name}
          </span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-teal-700 transition leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{authors}</p>
        </div>

        {/* Shelf Coordinates & Status */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-slate-500 truncate mr-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{primaryLocation}</span>
          </div>

          <div className="shrink-0">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </span>
            ) : (
              <span className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                Checked Out
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
