import React from "react";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { getDocument } from "@/app/archive/actions";
import { Document } from "../../types";
import ToolBar from "./components";

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const document = await getDocument(id);

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToolBar documentId={id} />

      <article className="p-4">
        {/* 앱바 (App Bar) */}
        <section className="relative p-3 mb-4 rounded-md shadow-md bg-indigo-600 text-white text-center">
          <Link
            href="/archive"
            className="absolute top-0 left-0 h-full text-white p-2 rounded-full flex items-center">
            <MdArrowBack className="size-5" />
          </Link>
          <h1 className="text-lg font-med">문서 상세</h1>
        </section>
        <DocumentDetail document={document} />
      </article>
    </div>
  );
}

const DocumentDetail = ({ document }: { document: Document }) => {
  return (
    <section className="bg-white rounded-md border-2 shadow-md">
      {/* 문서 헤더 */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">{document.title}</h2>
        <div className="flex flex-wrap text-sm text-gray-600 mb-4">
          <div className="mr-4 mb-1">작성자: {document.authorName}</div>
          <div className="mr-4 mb-1">작성일: {new Date(document.created).toLocaleDateString()}</div>
          <div className="mb-1">수정일: {new Date(document.updated).toLocaleDateString()}</div>
        </div>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {document.tags.length === 0 ? (
            <span className="text-gray-500">태그 없음</span>
          ) : (
            document.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))
          )}
        </div>
      </div>

      {/* 문서 내용 */}
      <div className="px-6 pb-6">
        <div className="prose max-w-none">
          <p className="mb-4">{document.description}</p>

          {/* 첨부 파일 목록 */}
          {document.fileUrls.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">첨부 파일</h3>
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
          )}
        </div>
      </div>
    </section>
  );
};
