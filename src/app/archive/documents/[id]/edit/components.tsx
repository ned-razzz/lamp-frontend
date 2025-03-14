"use client";

import React, { useState } from "react";
import { Document } from "@/app/archive/types";
import { updateDocument } from "@/app/archive/actions";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";

// 문서 편집 폼 컴포넌트
export const DocumentEditForm = ({ document }: { document: Document }) => {
  const router = useRouter();

  // 폼 상태 관리
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description);
  const [authorName, setAuthorName] = useState(document.authorName);
  const [tags, setTags] = useState<string[]>(document.tags);
  const [tagInput, setTagInput] = useState("");

  // 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 태그 추가 함수
  const addTag = () => {
    const newTag = tagInput.trim();
    if (!newTag || tags.includes(newTag)) {
      return;
    }
    setTags([...tags, newTag]);
    setTagInput("");
  };

  // 태그 제거 함수
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 폼 제출 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 유효성 검사
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (!authorName.trim()) {
      setError("작성자를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    // 문서 업데이트 요청
    const result = await updateDocument(Number(document.id), {
      title,
      description,
      authorName,
      tagNames: tags,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      // 성공 후 문서 상세 페이지로 리다이렉트
      setTimeout(() => {
        router.push(`/archive/documents/${document.id}`);
      }, 1500);
    } else {
      setError(result.error || "문서 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
        {/* 앱바 (App Bar) */}
        <div className="bg-indigo-600 text-white rounded-md shadow-md p-4 mb-4 flex justify-between items-center">
          <Link
            href={`/archive/documents/${document.id}`}
            className="flex items-center text-white hover:bg-indigo-700 p-2 rounded-full transition-colors">
            <MdArrowBack className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-medium">문서 수정</h1>
          <div className="w-5"></div> {/* 좌우 균형을 맞추기 위한 빈 공간 */}
        </div>

        {/* 상태 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            문서가 성공적으로 수정되었습니다. 곧 상세 페이지로 이동합니다.
          </div>
        )}

        {/* 문서 편집 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-md p-6">
          {/* 제목 */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              제목 *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* 작성자 */}
          <div className="mb-4">
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
              작성자 *
            </label>
            <input
              type="text"
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* 설명 */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            />
          </div>

          {/* 태그 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="태그를 입력하세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                추가
              </button>
            </div>

            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 첨부 파일 목록 (수정 불가) */}
          <div className="mb-6">
            <h3 className="block text-sm font-medium text-gray-700 mb-2">첨부 파일 (수정 불가)</h3>
            <ul className="list-disc pl-5">
              {document.fileUrls.map((fileUrl, index) => (
                <li key={index} className="mb-1">
                  <a
                    href={fileUrl}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer">
                    첨부파일 {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300">
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
