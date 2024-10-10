
import { Category } from "@/types/category-type";
import { create } from "zustand";

interface CategoryState {
	isModalCategoryVisible: boolean;
	setIsModalCategoryVisible: (isOpen: boolean) => void;
  isModalCategoryCreateEdit: boolean;
  setIsModalCategoryCreateEdit: (isOpen: boolean) => void;
  edit: boolean;
  setEdit: (edit: boolean) => void;
  categoryData: Category;
  setCategoryData: (categoryData: Category) => void;

}

export const useModalCategoryStore = create<CategoryState>((set) => ({
	isModalCategoryVisible: false,
	setIsModalCategoryVisible: (isOpen: boolean) =>
		set({ isModalCategoryVisible: isOpen }),

  isModalCategoryCreateEdit: false,
  setIsModalCategoryCreateEdit: (isOpen: boolean) =>
    set({ isModalCategoryCreateEdit: isOpen }),

  edit: false,
  setEdit: (edit: boolean) => set({ edit }),

  categoryData: {
    Id: 0,
    Name: "",
  },
  setCategoryData: (categoryData: Category) => set({ categoryData }),
}));
