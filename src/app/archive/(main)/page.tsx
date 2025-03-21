import React from "react";
import { SearchableArchive, ToolBar } from "./components";
import { Tag, Document } from "../types";
import { getDocuments, getDocumentTags } from "../actions";

const ArchivePage = async () => {
  const tags: Tag[] = await getDocumentTags();
  const documents: Document[] = await getDocuments();

  return (
    <>
      <SearchableArchive initialTags={tags} initialDocuments={documents} />
      <ToolBar />
    </>
  );
};

export default ArchivePage;
