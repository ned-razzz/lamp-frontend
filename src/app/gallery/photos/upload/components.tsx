"use client";

import { useState, useEffect } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import Image from "next/image";
import { PhotoFormData, PhotoFormValue } from "../../types";

interface PhotoFormProps {
  index: number;
  photoData: PhotoFormData;
  errors?: Record<string, string>;
  onChange: (index: number, fieldName: string, value: PhotoFormValue) => void;
  onRemove: (index: number) => void;
}

// 글로벌 태그 컴포넌트
export const GlobalFormComponent = ({
  tags,
  photographer,
  takenAt,
  onTagsChange,
  onPhotographerChange,
  onTakenAtChange,
  errors,
}: {
  tags: string[];
  photographer: string;
  takenAt: string;
  onTagsChange: (tags: string[]) => void;
  onPhotographerChange: (value: string) => void;
  onTakenAtChange: (value: string) => void;
  errors?: string;
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() === "" || tags.includes(tagInput.trim())) {
      setTagInput("");
      return;
    }

    const newTags = [...tags, tagInput.trim()];
    onTagsChange(newTags);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-lg font-semibold mb-4">공통 정보 설정</h2>

      {/* 촬영자 입력 필드 */}
      <div className="mb-4">
        <label
          htmlFor="global-photographer"
          className="block text-sm font-medium text-gray-700 mb-1">
          촬영자
        </label>
        <input
          type="text"
          id="global-photographer"
          value={photographer}
          onChange={(e) => onPhotographerChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="모든 사진의 촬영자 이름"
        />
      </div>

      {/* 촬영일시 입력 필드 */}
      <div className="mb-4">
        <label htmlFor="global-takenAt" className="block text-sm font-medium text-gray-700 mb-1">
          촬영일시
        </label>
        <input
          type="datetime-local"
          id="global-takenAt"
          value={takenAt}
          onChange={(e) => onTakenAtChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="border-t border-gray-200 my-4 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="태그 작성 후 Enter 입력"
            className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              errors ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>

        {errors && <div className="text-red-500 text-sm mb-2">{errors}</div>}

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span className="mr-1">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-gray-500 hover:text-red-500 focus:outline-none">
                <IoClose size={16} />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <div className="text-gray-500 text-sm">태그가 없습니다. 태그를 추가해주세요.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 개별 사진 폼 컴포넌트 (제목과 설명 편집 가능)
export const PhotoForm: React.FC<PhotoFormProps> = ({
  index,
  photoData,
  errors,
  onChange,
  onRemove,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 이미지 URL을 한 번만 생성하고 캐싱
  useEffect(() => {
    const url = URL.createObjectURL(photoData.file!);
    setImageUrl(url);

    // 컴포넌트가 언마운트될 때 URL 객체 해제
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photoData.file]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, "title", e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(index, "description", e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-2 overflow-hidden transform transition-all hover:shadow-md border border-gray-100">
      <div className="h-40 flex flex-row">
        {/* 미리보기 섹션 */}
        <div className="flex-1 basis-1/2 min-w-0 overflow-hidden relative flex-shrink-0 ">
          <span className="absolute z-40 size-6 rounded-tl-lg font-bold text-blue-600 bg-blue-200 flex justify-center items-center">
            {index + 1}
          </span>
          {imageUrl ? (
            <Image src={imageUrl} alt="미리보기" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-400">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 정보 입력 섹션 - 제목만 편집 가능 */}
        <div className="flex-1 basis-1/2 min-w-0 overflow-hidden p-2 text-sm">
          <div className="flex justify-end items-center">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-600 transition-colors">
              <IoTrash size={20} />
            </button>
          </div>

          <div>
            <div className="flex items-center mb-0.5">
              <label htmlFor={`title-${index}`} className="font-medium text-gray-700 mr-1">
                제목*
              </label>
              {errors?.title && <span className="text-red-500">⚠️</span>}
            </div>
            <input
              type="text"
              id={`title-${index}`}
              name="title"
              value={photoData.title}
              onChange={handleTitleChange}
              className={`w-full p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                errors?.title ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="사진 제목 (3~30자)"
            />

            <div className="flex items-center mt-2 mb-0.5">
              <label htmlFor={`description-${index}`} className="font-medium text-gray-700 mr-1">
                설명
              </label>
            </div>
            <textarea
              id={`description-${index}`}
              name="description"
              value={photoData.description || ""}
              onChange={handleDescriptionChange}
              rows={2}
              className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all border-gray-300"
              placeholder="개별 사진 설명 (선택사항)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
