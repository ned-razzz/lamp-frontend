"use client";
import React, { useState } from "react";

// 폼 필드 컴포넌트
export const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = false,
  isTextarea = false,
  placeholder = "",
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  isTextarea?: boolean;
  placeholder?: string;
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label} {required && "*"}
    </label>
    {isTextarea ? (
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
        placeholder={placeholder}
        required={required}
      />
    ) : (
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

// 태그 입력 컴포넌트
export const TagInput = ({
  tags,
  onAddTag,
  onRemoveTag,
}: {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onAddTag(inputValue);
    setInputValue("");
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">태그</label>
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="태그를 입력하세요"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          추가
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
              <span className="text-sm">{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 파일 업로드 컴포넌트
export const FileUpload = ({
  files,
  onChange,
}: {
  files: File[];
  onChange: (file: File[]) => void;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange([...e.target.files]);
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="files" className="block text-sm font-medium mb-1">
        파일 *
      </label>
      <input
        type="file"
        id="files"
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        multiple
        required
      />
      {files.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">
            선택된 파일 ({files.length}개):
          </p>
          <ul className="text-sm text-gray-600 pl-5 list-disc">
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 상태 메시지 컴포넌트
export const StatusMessage = ({ error, success }: { error: string | null; success: boolean }) => {
  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
    );
  }

  if (success) {
    return (
      <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        문서가 성공적으로 등록되었습니다.
      </div>
    );
  }

  return null;
};

// 폼 액션 컴포넌트
export const FormActions = ({ isSubmitting }: { isSubmitting: boolean }) => (
  <div className="flex justify-end gap-3">
    <button
      type="submit"
      disabled={isSubmitting}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300">
      {isSubmitting ? "등록 중..." : "등록하기"}
    </button>
  </div>
);
