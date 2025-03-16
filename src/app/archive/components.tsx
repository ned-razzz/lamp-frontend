"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Document, Tag } from "./types";
import { GrDocumentUpload } from "react-icons/gr";
import { MdManageSearch } from "react-icons/md";
import { searchDocuments } from "./actions";

export const ToolBar = () => (
  <section className="fixed z-10 right-4 bottom-4 flex gap-2">
    <Link
      href={"/archive/create"}
      className="size-14 rounded-full bg-black text-white border-2 border-black shadow-lg flex justify-center items-center">
      <GrDocumentUpload size={28} />
    </Link>
  </section>
);

export const DocumentItem = ({ document }: { document: Document }) => {
  return (
    <article className="bg-white flex justify-center items-center w-full">
      <div className=" w-full px-4 py-4 relative border-2 rounded-2xl border-black">
        <section>
          <header className="mb-2 font-bold text-xl hover:text-indigo-600 hover:underline transition-colors">
            <Link href={`/archive/documents/${document.id}`}>{document.title}</Link>
          </header>
          <main>
            <ul className="mb-1 text-sm flex gap-2">
              {document.tags.length === 0 ? <li>태그 없음</li> : <></>}
              {document.tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-md text-xs">
                  {tag}
                </li>
              ))}
            </ul>
            <p className="text-sm line-clamp-1 w-3/4">{document.description}</p>
          </main>
        </section>
        <section className="absolute top-4 right-4">
          <a
            href={document.fileUrls[0]}
            className="border-2 border-black rounded-full w-12 h-12 flex items-center justify-center">
            <span className="font-bold text-sm">FILE</span>
          </a>
        </section>
      </div>
    </article>
  );
};

interface SearchableArchiveProps {
  initialTags: Tag[];
  initialDocuments: Document[];
}
export const SearchableArchive = ({ initialTags, initialDocuments }: SearchableArchiveProps) => {
  // State management
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search function - only triggered by the search button
  const performSearch = async () => {
    if (isLoading === true) {
      return;
    }
    setIsLoading(true);

    try {
      const searchParams = {
        title: searchTitle || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };
      console.log(searchParams.tags);

      const results = await searchDocuments(searchParams);
      setDocuments(results);
    } catch (error) {
      console.error("문서 검색 중 오류 발생:", error);
    }

    setIsLoading(false);
  };

  const handleTags = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags((prev) => prev.filter((id) => id !== tagId));
    } else {
      setSelectedTags((prev) => [...prev, tagId]);
    }
  };

  return (
    <>
      {/* Search controls */}
      <nav className="bg-gray-100 p-4 flex flex-col gap-4">
        {/* Search controls section */}
        <section>
          {/* Title search input */}
          <div className="mx-8 mb-4">
            <div className="flex-1 px-4 bg-white rounded-full flex items-center shadow-sm border border-gray-100">
              <MdManageSearch size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="제목으로 검색하세요"
                className="px-3 py-2 w-full outline-none"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                aria-label="문서 제목 검색"
              />
            </div>
          </div>
        </section>

        {/* Tag filters */}
        <section>
          <div className="px-4">
            <ul className="flex flex-wrap gap-2">
              {initialTags.map((tag) => (
                <li key={tag.id}>
                  <TagItem
                    tag={tag}
                    isSelected={selectedTags.includes(tag.id)}
                    onClick={() => handleTags(tag.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Search button section */}
        <section className="px-4 py-2 flex justify-center">
          <button
            onClick={performSearch}
            className="px-8 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
            aria-label="태그 및 제목으로 검색">
            <div className="flex items-center gap-2">
              <MdManageSearch size={20} />
              <span>검색하기</span>
            </div>
          </button>
        </section>
      </nav>

      {/* Document list with states */}
      <section className="z-0 p-6 flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">검색 중...</div>
        ) : documents.length > 0 ? (
          documents.map((document) => <DocumentItem key={document.id} document={document} />)
        ) : (
          <div className="text-center py-8 text-gray-500">검색 결과가 없습니다.</div>
        )}
      </section>
    </>
  );
};

const TagItem = ({
  tag,
  isSelected,
  onClick,
}: {
  tag: Tag;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    className={`
      flex-none min-w-16 px-2 py-1 rounded-full border text-sm transition-colors
      ${
        isSelected
          ? "bg-indigo-100 border-indigo-300 text-indigo-700"
          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
      }
    `}
    onClick={onClick}>
    {tag.name}
  </button>
);
