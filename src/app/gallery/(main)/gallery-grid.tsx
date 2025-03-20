"use client";

import Image from "next/image";
import Link from "next/link";
import { Photo } from "../types";

interface GalleryGridProps {
  photos: Photo[];
}

// Origin Helper: 컬럼 위치에 따라 적절한 origin 클래스를 반환하는 함수
const getOriginClass = (index: number) => {
  // 컬럼 위치 계산 (0: 왼쪽, 1: 중간, 2: 오른쪽)
  const columnPosition = index % 3;

  // 위치에 따라 다른 origin 클래스 반환
  if (columnPosition === 0) {
    return "origin-top-left"; // 왼쪽 컬럼
  } else if (columnPosition === 1) {
    return "origin-top"; // 중간 컬럼
  } else {
    return "origin-top-right"; // 오른쪽 컬럼
  }
};

export const GalleryGrid = ({ photos }: GalleryGridProps) => {
  return (
    <div className="mb-80">
      <div
        className="grid grid-cols-3 gap-2"
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              {/* 호버 시 전체 컴포넌트가 확대되는 컨테이너 */}
              <div
                className={`relative overflow-visible transition-all duration-300 
                ${getOriginClass(index)} 
                transform group-hover:scale-[1.8] group-hover:z-20 z-10`}>
                {/* 이미지 컨테이너 */}
                <div className="relative overflow-hidden rounded-md group-hover:rounded-b-none aspect-square shadow-md">
                  <Image
                    src={photo.fileUrl}
                    alt={photo.title}
                    fill
                    sizes="50vw"
                    quality={30}
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
            <p className="text-lg text-gray-500 mb-4">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
