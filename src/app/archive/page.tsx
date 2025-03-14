import React from "react";
import { MdManageSearch } from "react-icons/md";
import { DocumentItem, ToolBar } from "./components";
import { Tag, Document } from "./types";

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
      <section className="relative">
        <ToolBar />
        <section className="z-0 p-6 flex flex-col gap-4">
          {documents.map((document) => (
            <DocumentItem key={document.id} document={document} />
          ))}
        </section>
      </section>
    </>
  );
};

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <button
      className={`flex-none min-w-16 px-2 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm`}>
      {tag.name}
    </button>
  );
};

export default ArchivePage;
