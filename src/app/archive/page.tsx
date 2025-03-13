import React from "react";
import { MdManageSearch } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { GrDocumentUpload } from "react-icons/gr";
import Link from "next/link";

interface Tag {
  id: number;
  name: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  authorName: string;
  tags: string[];
  fileUrls: string[];
  created: Date;
  updated: Date;
}

const loadTags = async () => {
  const tags: Tag[] = [
    { id: 1, name: "태그1" },
    { id: 2, name: "태그2" },
    { id: 3, name: "태그3" },
    { id: 4, name: "태그4" },
    { id: 5, name: "태그5" },
    { id: 6, name: "태그6" },
    { id: 7, name: "태그7" },
    { id: 8, name: "태그8" },
    { id: 9, name: "태그9" },
  ];
  return tags;
};

const loadDocuments = async () => {
  const response = await fetch("http://localhost:8080/api/v1/documents");
  if (!response.ok) {
    throw new Error("Failed fetching documents");
  }
  return response.json();
};

const ArchivePage = async () => {
  const tags = await loadTags();
  const documents: Document[] = await loadDocuments();
  return (
    <>
      <nav className="bg-gray-50 p-4 flex flex-col gap-4">
        {/* Search bar */}
        <section>
          <div className="mx-8 px-4 bg-white rounded-full flex items-center shadow-sm border border-gray-100 focus:ring-blue-300 transition-all">
            <MdManageSearch size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="제목으로 검색하세요"
              className="px-3 py-2 w-full outline-none"
            />
          </div>
        </section>
        {/* Tags */}
        <section>
          <div className="px-4">
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag.id}>
                  <TagItem tag={tag} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      </nav>
      <main className="relative">
        {/* Document Create/Edit */}
        <ToolBar />
        {/* Document List */}
        <section className="z-0 p-6 flex flex-col gap-4">
          {documents.map((document) => (
            <DocumentItem key={document.id} document={document} />
          ))}
        </section>
      </main>
    </>
  );
};

const ToolBar = () => (
  <section className="fixed z-10 right-4 bottom-4 flex gap-2">
    <Link
      href={"/archive/create"}
      className="size-12 rounded-full bg-black text-white border-2 border-black shadow-lg flex justify-center items-center">
      <GrDocumentUpload size={26} />
    </Link>
    <button className="size-12 rounded-full bg-black text-white border-2 border-black shadow-lg flex justify-center items-center">
      <IoSettingsSharp size={30} />
    </button>
  </section>
);

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <button
      className={`flex-none min-w-16 px-2 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm`}>
      {tag.name}
    </button>
  );
};

const DocumentItem = ({ document }: { document: Document }) => {
  return (
    <article className="bg-white flex justify-center items-center w-full">
      <div className="border-2 rounded-2xl border-black w-full px-4 py-4 relative">
        <section className="flex flex-col gap-1">
          <header className="font-bold text-xl">{document.title}</header>
          <ul className="flex gap-2 text-sm">
            {document.tags.length === 0 ? <li>태그 없음</li> : <></>}
            {document.tags.map((tag, index) => (
              <li key={index}>#{tag}</li>
            ))}
          </ul>
          <p className="text-sm line-clamp-2 w-3/4">{document.description}</p>
          <ul className="text-sm">
            {document.fileUrls.map((fileUrl, index) => {
              return (
                <li key={index} className="list-inside list-disc">
                  <a href={fileUrl}>file{index}</a>
                </li>
              );
            })}
          </ul>
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

export default ArchivePage;
