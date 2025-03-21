"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoTrash } from "react-icons/io5";
import { Photo } from "@/app/gallery/types";
import { deletePhoto } from "@/app/gallery/actions";

interface PhotoDetailProps {
  photo: Photo;
}

export default function PhotoDetail({ photo }: PhotoDetailProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deletePhoto(photo.id);
      router.push("/gallery");
      router.refresh(); // 캐시된 데이터 갱신
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("사진 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={photo.fileUrl}
            alt={photo.title}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{photo.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">사진 정보</h2>
              <dl className="space-y-2">
                {photo.description && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">설명</dt>
                    <dd className="text-gray-700 ml-2">{photo.description}</dd>
                  </>
                )}

                {photo.photographer && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">촬영자</dt>
                    <dd className="text-gray-700 ml-2">{photo.photographer}</dd>
                  </>
                )}

                <dt className="text-sm font-medium text-gray-500">촬영일시</dt>
                <dd className="text-gray-700 ml-2">{photo.takenAt}</dd>
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">메타데이터</h2>
              <dl className="space-y-2">
                <dt className="text-sm font-medium text-gray-500">등록일</dt>
                <dd className="text-gray-700 ml-2">{photo.created}</dd>

                <dt className="text-sm font-medium text-gray-500">수정일</dt>
                <dd className="text-gray-700 ml-2">{photo.updated}</dd>
              </dl>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">태그</h2>
            <div className="flex flex-wrap gap-2">
              {photo.tagNames.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed position delete button (similar to archive page) */}
      <nav className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={openDeleteModal}
          className="bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 hover:shadow-xl transition-all"
          title="삭제">
          <IoTrash className="w-6 h-6" />
        </button>
      </nav>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">사진 삭제</h3>
            <p className="text-gray-700 mb-6">
              정말 이 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
                취소
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50">
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
