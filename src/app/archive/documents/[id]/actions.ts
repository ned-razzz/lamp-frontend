import { Document } from "../../types";

export async function getDocument(id: string): Promise<Document> {
  const apiUrl = `v1/documents/${id}`;

  const response = await fetch(`http://localhost:8080/api/${apiUrl}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`POST /${apiUrl}: ` + errorData?.message);
  }

  return response.json();
}
