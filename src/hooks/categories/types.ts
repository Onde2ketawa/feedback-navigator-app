
export interface CategoryType {
  id: string;
  name: string;
}

export interface SubcategoryType {
  id: string;
  category_id: string;
  name: string;
}
