"use client";

import React, { useState } from "react";
import { MdManageSearch } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import Link from "next/link";
import { GalleryGrid } from "./gallery-grid";
import { Photo, Tag } from "../types";
import { searchPhotos } from "../actions";

interface SearchableGalleryProps {
  initialTags: Tag[];
  initialPhotos: Photo[];
}

export const SearchableGallery = ({ initialTags, initialPhotos }: SearchableGalleryProps) => {
  // State management
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Search function - only triggered by the search button
  const performSearch = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const searchParams = {
        title: searchTitle || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const results = await searchPhotos(searchParams);
      setPhotos(results);
    } catch (error) {
      console.error("사진 검색 중 오류 발생:", error);
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
                aria-label="사진 제목 검색"
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
            className="px-8 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            aria-label="태그 및 제목으로 검색">
            <div className="flex items-center gap-2">
              <MdManageSearch size={20} />
              <span>검색하기</span>
            </div>
          </button>
        </section>
      </nav>

      {/* Upload button */}
      <div className="my-6 flex justify-center">
        <Link
          href="/gallery/photos/upload"
          className="w-3/4 h-12 rounded bg-blue-500 text-white hover:bg-blue-600 transition flex justify-center items-center">
          <IoAdd className="mr-1" /> 사진 업로드
        </Link>
      </div>

      {/* Photo grid with states */}
      <div className="container mx-auto">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">검색 중...</div>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
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
          ? "bg-blue-100 border-blue-300 text-blue-700"
          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
      }
    `}
    onClick={onClick}>
    {tag.name}
  </button>
);
