"use client";
import React from "react";
import { useDocumentForm } from "./hooks";
import { FileUpload, FormActions, FormField, StatusMessage, TagInput } from "./components";
import Link from "next/link";

const CreateDocumentPage = () => {
  return (
    <>
      <section className="px-6 pt-6">
        <Link
          href="/archive"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
          돌아가기
        </Link>
      </section>
      <section className="p-6">
        <DocumentForm />
      </section>
    </>
  );
};

// 문서 폼 컴포넌트
export const DocumentForm = () => {
  const { formData, status, handleInputChange, handleFileChange, addTag, removeTag, handleSubmit } =
    useDocumentForm();

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <StatusMessage error={status.error} success={status.success} />

      <FormField
        label="문서명"
        id="title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />

      <FormField
        label="세부 설명"
        id="description"
        value={formData.description}
        onChange={handleInputChange}
        isTextarea
      />

      <FormField
        label="작성자"
        id="authorName"
        value={formData.authorName}
        onChange={handleInputChange}
        required
      />

      <TagInput tags={formData.tags} onAddTag={addTag} onRemoveTag={removeTag} />

      <FileUpload files={formData.files} onChange={handleFileChange} />

      <FormActions isSubmitting={status.isSubmitting} />
    </form>
  );
};

export default CreateDocumentPage;
