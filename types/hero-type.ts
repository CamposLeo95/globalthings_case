import type { Category } from "./category-type";

export type HerosResponse = {
	Total: number;
	Items: HeroData[];
};

export type HeroData = {
	Id: number;
	Name: string;
	Active: boolean;
	Category: Category;
};

export type HeroRequest = {
	Name: string;
	Active: boolean;
	CategoryId: number;
};
