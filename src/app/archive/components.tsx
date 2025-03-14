import React from "react";
import { GrDocumentUpload } from "react-icons/gr";
import Link from "next/link";
import { Document } from "./types";

export const ToolBar = () => (
  <section className="fixed z-10 right-4 bottom-4 flex gap-2">
    <Link
      href={"/archive/create"}
      className="size-14 rounded-full bg-black text-white border-2 border-black shadow-lg flex justify-center items-center">
      <GrDocumentUpload size={28} />
    </Link>
  </section>
);

export const DocumentItem = ({ document }: { document: Document }) => {
  return (
    <article className="bg-white flex justify-center items-center w-full">
      <div className=" w-full px-4 py-4 relative border-2 rounded-2xl border-black">
        <section>
          <header className="mb-2 font-bold text-xl hover:text-indigo-600 hover:underline transition-colors">
            <Link href={`/archive/documents/${document.id}`}>{document.title}</Link>
          </header>
          <main>
            <ul className="mb-1 text-sm flex gap-2">
              {document.tags.length === 0 ? <li>태그 없음</li> : <></>}
              {document.tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-md text-xs">
                  {tag}
                </li>
              ))}
            </ul>
            <p className="text-sm line-clamp-1 w-3/4">{document.description}</p>
          </main>
        </section>
        <section className="absolute top-4 right-4">
          <a
            href={document.fileUrls[0]}
            className="border-2 border-black rounded-full w-12 h-12 flex items-center justify-center">
            <span className="font-bold text-sm">FILE</span>
          </a>
        </section>
      </div>
    </article>
  );
};
