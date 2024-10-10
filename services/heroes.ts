import { Api } from "@/app/config/api-config";
import type { HeroRequest, HerosResponse } from "@/types/hero-type";

export const listHero = async () => {
	const response = await Api.get<HerosResponse>("/Heroes");
	return response;
};

export const createHero = async (data: HeroRequest) => {
	try {
		const response = await Api.post("/Heroes", data);

		return response;
	} catch (error) {
		return;
	}
};

export const updateHero = async (id: number, data: HeroRequest) => {
	const response = await Api.put(`/Heroes/${id}`, data);
	return response;
};

export const deleteHero = async (id: number) => {
	const response = await Api.delete(`/Heroes/${id}`);
	return response;
};

export const getHero = async (id: number) => {
	const response = await Api.get(`/Heroes/${id}`);
	return response;
};
