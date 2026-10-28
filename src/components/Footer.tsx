import React from "react";
import Link from "next/link";
import { BookOpen, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-10 pb-8 mt-auto text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-base font-bold">District Library OPAC</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Online Public Access Catalogue providing search, real-time physical stack coordinates, and book reservations.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/search" className="hover:text-teal-400 transition">
                  Search Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-teal-400 transition">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link href="/library-information" className="hover:text-teal-400 transition">
                  Hours &amp; Membership Rules
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Location */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Physical Library
            </h4>
            <div className="space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Mon – Sat: 08:00 AM – 08:00 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>CGO Complex, Lodhi Road, New Delhi 110003</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 District Library OPAC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/library-information" className="hover:text-slate-400 transition">
              About
            </Link>
            <Link href="/library-information#rules" className="hover:text-slate-400 transition">
              Rules
            </Link>
            <Link href="/search" className="hover:text-slate-400 transition">
              Search
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
