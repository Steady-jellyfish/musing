// Category types - 3-tier hierarchy
export interface Category {
  id: number;
  name: string;
  full_path: string;
  parent_id: number | null;
  level: 1 | 2 | 3;
  created_at: string;
  children?: Category[];
  noteCount?: number;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

// Note types
export interface Note {
  id: number;
  session_id: string;
  title: string;
  original_text: string;
  refined_text: string;
  category_id: number;
  parent_note_id: number | null;
  is_merged: boolean;
  created_at: string;
  updated_at: string;
  version: number;
  tags: Tag[];
  category?: Category;
}

// Category suggestion types
export interface CategorySuggestion {
  id: number;
  note_id: number;
  category_id: number | null;
  category_name: string;
  similarity_score: number;
  is_selected: boolean;
  is_new: boolean;
  created_at: string;
}
