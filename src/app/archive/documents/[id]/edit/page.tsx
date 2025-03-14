import React from "react";
import { getDocument } from "@/app/archive/actions";
import { DocumentEditForm } from "./components";

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

const DocumentEditPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const document = await getDocument(id);
  return <DocumentEditForm document={document} />;
};

export default DocumentEditPage;
