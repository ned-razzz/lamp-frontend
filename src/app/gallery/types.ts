export interface Photo {
  id: number;
  title: string;
  description: string;
  photographer: string;
  takenAt: string;
  tagNames: string[];
  fileUrl: string;
  created: string;
  updated: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PhotoFormData {
  title: string;
  description: string;
  photographer: string;
  takenAt: string;
  tagNames: string[];
  file: File | null;
}
