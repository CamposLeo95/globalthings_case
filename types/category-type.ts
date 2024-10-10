export type Category = {
	Id: number;
	Name: string;
};

export type CategoryResponse = {
	Total: number;
	Items: Category[];
};

export type CategoryRequest = {
	Name: string;
};
