import React from "react";
import { MdManageSearch } from "react-icons/md";
import { IoLibrarySharp } from "react-icons/io5";

interface Tag {
  id: number;
  name: string;
}

interface File {
  extension: string;
  downloadUrl: string;
}

interface Document {
  id: number;
  title: string;
  description: string;
  tags: Tag[];
  file: File;
}

const ArchivePage = () => {
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

  const file: File = {
    extension: "HWP",
    downloadUrl: "#",
  };

  // Mock data for resources
  const docuemnts: Document[] = [
    {
      id: 1,
      title: "자료 항목 1",
      description:
        "Ex do adipisicing ut dolore qui. Proident qui voluptate velit sit sunt sint deserunt officia id laboris consectetur. Aliqua dolore sunt do exercitation adipisicing pariatur irure cillum dolor irure ad. Minim ea enim elit tempor laborum qui quis enim proident eiusmod anim elit laboris id.",
      tags: [tags[1], tags[2], tags[3]],
      file: file,
    },
    {
      id: 2,
      title: "자료 항목 2",
      description:
        "Ex do adipisicing ut dolore qui. Proident qui voluptate velit sit sunt sint deserunt officia id laboris consectetur. Aliqua dolore sunt do exercitation adipisicing pariatur irure cillum dolor irure ad. Minim ea enim elit tempor laborum qui quis enim proident eiusmod anim elit laboris id.",
      tags: [],
      file: file,
    },
    {
      id: 3,
      title: "자료 항목 3",
      description:
        "Ex do adipisicing ut dolore qui. Proident qui voluptate velit sit sunt sint deserunt officia id laboris consectetur. Aliqua dolore sunt do exercitation adipisicing pariatur irure cillum dolor irure ad. Minim ea enim elit tempor laborum qui quis enim proident eiusmod anim elit laboris id.",
      tags: [tags[0], tags[1], tags[4]],
      file: file,
    },
    {
      id: 4,
      title: "자료 항목 4",
      description:
        "Ex do adipisicing ut dolore qui. Proident qui voluptate velit sit sunt sint deserunt officia id laboris consectetur. Aliqua dolore sunt do exercitation adipisicing pariatur irure cillum dolor irure ad. Minim ea enim elit tempor laborum qui quis enim proident eiusmod anim elit laboris id.",
      tags: [tags[0], tags[1], tags[4]],
      file: file,
    },
  ];

  return (
    <>
      <header>
        <div className="max-w-lg p-4 flex items-center">
          <IoLibrarySharp className="mr-1" size={25} />
          <h1 className="font-bold text-xl">자료실</h1>
        </div>
      </header>
      {/* Search bar */}
      <section>
        <div className="relative px-4 pb-4">
          <input
            type="text"
            placeholder="제목으로 검색하세요"
            className="overflow-x-auto whitespace-nowrap w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
          <MdManageSearch className="absolute left-7 inset-y-1/2 -translate-y-1/2" size={24} />
        </div>
      </section>
      {/* Tags */}
      <section>
        <div className="px-4 overflow-x-auto">
          <ul className="flex gap-2">
            {tags.map((tag) => (
              <li key={tag.id}>
                <TagItem tag={tag} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* Document */}
      <section className="p-6 flex flex-col gap-4">
        {docuemnts.map((document) => (
          <DocumentItem key={document.id} document={document} />
        ))}
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

const DocumentItem = ({ document }: { document: Document }) => {
  return (
    <article className="flex justify-center items-center w-full">
      <div className="border-2 rounded-2xl border-black w-full px-4 py-4 relative">
        <section className="flex flex-col gap-1">
          <header className="font-bold text-xl">{document.title}</header>
          <ul className="flex gap-2 text-sm">
            {document.tags.length === 0 ? <li>태그 없음</li> : <></>}
            {document.tags.map((tag) => (
              <li key={tag.id}>#{tag.name}</li>
            ))}
          </ul>
          <p className="text-sm line-clamp-2 w-3/4">{document.description}</p>
        </section>
        <section className="absolute top-4 right-4">
          <a
            href={document.file.extension}
            className="border-2 border-black rounded-full w-12 h-12 flex items-center justify-center">
            <span className="font-bold text-sm">{document.file.extension}</span>
          </a>
        </section>
      </div>
    </article>
  );
};

export default ArchivePage;
