"use client";

import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
import { useDeleteDocument } from "./hooks";

const ToolBar = ({ documentId }: { documentId: number }) => {
  const { isDeleting, showDeleteModal, error, openDeleteModal, closeDeleteModal, handleDelete } =
    useDeleteDocument(documentId);

  return (
    <>
      <nav className="fixed bottom-4 right-4 flex flex-col gap-2">
        <Link
          href={`/archive/documents/${documentId}/edit`}
          className="bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
          title="수정">
          <MdEdit className="w-6 h-6" />
        </Link>
        <button
          onClick={openDeleteModal}
          className="bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 hover:shadow-xl transition-all"
          title="삭제">
          <MdDelete className="w-6 h-6" />
        </button>
      </nav>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onClose={closeDeleteModal}
          isDeleting={isDeleting}
          error={error}
        />
      )}
    </>
  );
};

// 삭제 확인 모달 컴포넌트
const DeleteConfirmModal = ({
  onConfirm,
  onClose,
  isDeleting,
  error,
}: {
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
  error: string | null;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">문서 삭제</h3>
        <p className="text-gray-700 mb-6">
          정말 이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
            취소
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50">
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
