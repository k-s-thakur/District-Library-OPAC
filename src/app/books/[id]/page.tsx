import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Bookmark
} from "lucide-react";
import ReservationButton from "@/components/ReservationButton";
import BookCard from "@/components/BookCard";
import { BOOKS } from "@/data/mockData";

export async function generateStaticParams() {
  return BOOKS.map((book) => ({
    id: book.id,
  }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = BOOKS.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  const relatedBooks = BOOKS.filter(
    (b) => b.category.code === book.category.code && b.id !== book.id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </Link>
      </div>

      {/* Main Book Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cover & Hold Button */}
          <div className="md:col-span-4 space-y-4">
            <div className="aspect-[3/4] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-teal-800 to-slate-900 text-white">
                  <span className="text-xs font-mono text-teal-300">OPAC Holding</span>
                  <div>
                    <h2 className="font-serif text-lg font-bold">{book.title}</h2>
                    <p className="text-xs text-slate-300 mt-1">{book.authors}</p>
                  </div>
                  <span className="text-xs font-mono text-teal-200">DDC {book.ddcCode}</span>
                </div>
              )}
            </div>

            <div className="max-w-[280px] mx-auto">
              <ReservationButton
                bookId={book.id}
                availableCopies={book.availableCopies}
                totalCopies={book.totalCopies}
                activeReservationsCount={0}
              />
            </div>
          </div>

          {/* Right Column: Book Details */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/search?category=${book.category.code}`}
                  className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md hover:bg-teal-100 transition"
                >
                  {book.category.name}
                </Link>
                <span className="text-xs font-mono text-slate-500">
                  DDC {book.ddcCode}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="text-sm text-slate-500 font-medium">
                  {book.subtitle}
                </p>
              )}

              <p className="text-xs text-slate-700">
                Author: <strong className="text-slate-900 font-semibold">{book.authors}</strong>
              </p>
            </div>

            {/* Shelf & Stack Coordinates */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 block font-medium">Shelf Coordinate</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-teal-700" />
                  <span>{book.primaryLocation}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Call No</span>
                  <span className="font-mono font-bold text-slate-800">{book.bookNumber}</span>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-slate-400 block font-medium">Availability</span>
                  <span className="font-bold text-emerald-700">
                    {book.availableCopies} of {book.totalCopies} Available
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-1.5">
              <h3 className="font-serif text-sm font-bold text-slate-900">
                Synopsis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Bibliographical Specs */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-serif text-sm font-bold text-slate-900 mb-2">
                Bibliographical Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">ISBN</span>
                  <span className="font-mono font-semibold text-slate-800">{book.isbn}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Publisher</span>
                  <span className="font-semibold text-slate-800 truncate block">{book.publisher}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Year</span>
                  <span className="font-semibold text-slate-800">{book.publicationYear}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Language</span>
                  <span className="font-semibold text-slate-800">{book.language}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Edition</span>
                  <span className="font-semibold text-slate-800 truncate block">{book.edition || "Standard"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-slate-400 block text-[11px]">Classification</span>
                  <span className="font-mono font-semibold text-teal-800">DDC {book.ddcCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">
            More Titles in {book.category.name}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} {...relBook} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
