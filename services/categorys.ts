import { Api } from "@/app/config/api-config";
import type { CategoryRequest, CategoryResponse } from "@/types/category-type";

export const listCategory = async () => {
	const response = await Api<CategoryResponse>("/Category");
	return response;
};

export const createCategory = async (data: CategoryRequest) => {
	const response = await Api.post("/Category", data);
	return response;
};

export const updateCategory = async (id: number, data: CategoryRequest) => {
	const response = await Api.put(`/Category/${id}`, data);
	return response;
};

export const deleteCategory = async (id: number) => {
	const response = await Api.delete(`/Category/${id}`);
	return response;
};

export const getCategory = async (id: number) => {
	const response = await Api(`/Category/${id}`);
	return response;
};
