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
import DynamicBookCover from "@/components/DynamicBookCover";
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
            <div className="aspect-[2/3] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-lg">
              <DynamicBookCover
                id={book.id}
                isbn={book.isbn}
                title={book.title}
                subtitle={book.subtitle}
                authors={book.authors}
                category={book.category}
                publisher={book.publisher}
                edition={book.edition}
                publicationYear={book.publicationYear}
                language={book.language}
                ddcCode={book.ddcCode}
                size="lg"
              />
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

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="text-sm font-medium text-slate-600 italic">
                  {book.subtitle}
                </p>
              )}

              <p className="text-sm text-slate-600">
                Authored by <span className="font-semibold text-slate-900">{book.authors}</span>
              </p>
            </div>

            {/* Shelf & Holding Info Card */}
            <div className="p-4 rounded-xl border border-teal-100 bg-teal-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-semibold text-teal-950">
                    Physical Stack Coordinates
                  </span>
                </div>
                {book.availableCopies > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available on Shelf ({book.availableCopies} of {book.totalCopies} copies)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    All Copies Checked Out
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p>
                  <strong>Primary Location:</strong> {book.primaryLocation}
                </p>
                <p>
                  <strong>Specific Stacks:</strong> {book.shelfLocations?.join(", ") || book.primaryLocation}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-serif text-sm font-bold text-slate-900">
                Synopsis &amp; Abstract
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {book.description ||
                  "A major holdings acquisition for the district library system, accessioned to support research and general reading."}
              </p>
            </div>

            {/* Bibliographical Metadata */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="font-serif text-sm font-bold text-slate-900">
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
