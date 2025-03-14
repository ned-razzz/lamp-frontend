"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/app/archive/actions";

export function useDeleteDocument(documentId: number) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteDocument(documentId);
      router.push("/archive");
    } catch (error) {
      if (error instanceof Error) {
        console.error("문서 삭제 중 오류 발생:", error.message);
      }
      setError("문서 삭제에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    showDeleteModal,
    error,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}
