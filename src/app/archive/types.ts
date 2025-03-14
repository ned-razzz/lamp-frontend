export interface Tag {
  id: number;
  name: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  authorName: string;
  tags: string[];
  fileUrls: string[];
  created: Date;
  updated: Date;
}
