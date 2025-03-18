"use client";

import Image from "next/image";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import { Photo } from "./types";

interface GalleryGridProps {
  photos: Photo[];
}

const GalleryGrid = ({ photos }: GalleryGridProps) => {
  return (
    <div className="container mx-auto p-4">
      {/* 업로드 버튼 */}
      <div className="mb-6 flex justify-end">
        <Link
          href="/gallery/photos/upload"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition flex items-center">
          <IoAdd className="mr-1" /> 사진 업로드
        </Link>
      </div>

      {/* 갤러리 그리드 - 3열 레이아웃 */}
      <div className="grid grid-cols-3 gap-2">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="relative group">
              {/* 호버 시 전체 컴포넌트가 확대되는 컨테이너 */}
              <div className="relative overflow-visible transition-all duration-300 origin-center transform group-hover:scale-150 group-hover:z-20 z-10">
                {/* 이미지 컨테이너 */}
                <div className="relative overflow-hidden rounded-md group-hover:rounded-b-none aspect-square shadow-md">
                  <Image
                    src={photo.fileUrl}
                    alt={photo.title}
                    fill
                    sizes="33vw"
                    priority
                    className="object-cover origin-bottom-right"
                  />
                </div>

                {/* 이미지 아래에 위치하는 정보 패널 - 호버 시 나타남 */}
                <div className="w-full bg-gray-900 max-h-0 group-hover:max-h-24 transition-all duration-300 overflow-hidden rounded-b-md">
                  <div className="p-3 text-[0.5rem]">
                    {/* 제목 */}
                    <h3 className="text-xs text-white font-semibold truncate" title={photo.title}>
                      {photo.title}
                    </h3>

                    {/* 태그 */}
                    {photo.tagNames && photo.tagNames.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {photo.tagNames.map((tag, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 inline-block rounded bg-blue-600 bg-opacity-70 text-white ">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 링크는 전체 컨테이너를 감싸도록 절대 위치로 배치 */}
              <Link
                href={`/gallery/photos/${photo.id}`}
                className="absolute inset-0 z-10 group-hover:z-20"
                aria-label={`View details of ${photo.title}`}
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-gray-500 mb-4">갤러리에 사진이 없습니다.</p>
            <Link
              href="/gallery/photos/upload"
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              첫 사진 업로드하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryGrid;
