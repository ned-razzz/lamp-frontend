import React from "react";
import { MdManageSearch } from "react-icons/md";

interface Tag {
  id: number;
  name: string;
}

interface File {
  id: number;
  name: string;
  url: string;
}

interface Document {
  id: number;
  title: string;
  tags: Tag[];
  files: File[];
}

const ArchivePage = () => {
  const tags: Tag[] = [
    { id: 1, name: "태그1" },
    { id: 2, name: "태그2" },
    { id: 3, name: "태그3" },
    { id: 4, name: "태그4" },
    { id: 5, name: "태그5" },
  ];

  const files: File[] = [
    { id: 1, name: "file1", url: "#" },
    { id: 2, name: "file2", url: "#" },
    { id: 3, name: "file3", url: "#" },
    { id: 4, name: "file4", url: "#" },
    { id: 5, name: "file5", url: "#" },
  ];

  // Mock data for resources
  const docuemnts: Document[] = [
    { id: 1, title: "자료 항목 1", tags: [tags[1], tags[2], tags[3]], files: [files[1], files[2]] },
    { id: 2, title: "자료 항목 2", tags: [tags[2], tags[3]], files: [files[2]] },
    { id: 3, title: "자료 항목 3", tags: [tags[4]], files: [files[1], files[3], files[4]] },
    { id: 4, title: "자료 항목 4", tags: [tags[4]], files: [files[1], files[3], files[4]] },
    { id: 5, title: "자료 항목 5", tags: [tags[4]], files: [files[1], files[3], files[4]] },
    { id: 6, title: "자료 항목 6", tags: [tags[4]], files: [files[1], files[3], files[4]] },
  ];

  return (
    <main className="mx-4">
      <header className="mb-4">
        <h1 className="font-bold text-xl">자료실</h1>
      </header>
      {/* Search bar */}
      <section className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="제목으로 검색하세요"
            className="w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <MdManageSearch className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </section>
      {/* Tags */}
      <section className="mb-4 flex gap-2">
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} />
        ))}
      </section>
      {/* Document */}
      <section className="mb-4 flex flex-col gap-2">
        {docuemnts.map((document) => (
          <DocumentItem key={document.id} document={document} />
        ))}
      </section>
    </main>
  );
};

const TagItem = ({ tag }: { tag: Tag }) => {
  return (
    <button
      className={`px-2 py-1 rounded-full border transition bg-white hover:bg-gray-50 text-xs`}>
      {tag.name}
    </button>
  );
};

const DocumentItem = ({ document }: { document: Document }) => {
  return (
    <article className="flex justify-center items-center w-full">
      <div className="border-2 rounded-2xl border-black w-full px-4 py-4 relative">
        <div className="flex flex-col gap-1">
          <header className="font-bold text-xl">{document.title}</header>
          <ul className="flex gap-2 text-sm">
            {document.tags.map((tag) => (
              <li key={tag.id}>#{tag.name}</li>
            ))}
          </ul>
          <ul className="flex gap-2 text-sm">
            {document.files.map((file) => (
              <li key={file.id}>
                <a href={file.url}>{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default ArchivePage;
