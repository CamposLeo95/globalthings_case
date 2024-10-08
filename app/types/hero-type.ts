import type { Category } from "./category-type";

export type HerosResponse = {
	Total: number;
	Items: Hero[];
};

export type Hero = {
	Id: number;
	Name: string;
	Active: boolean;
	Category: Category;
};
