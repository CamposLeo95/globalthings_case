import type { HeroData } from "@/types/hero-type";
import { create } from "zustand";

interface HeroState {
	isModalVisible: boolean;
	setIsModalVisible: (isOpen: boolean) => void;
	heroData: HeroData;
	setHeroData: (heroData: HeroData) => void;
	edit: boolean;
	setEdit: (edit: boolean) => void;
}

export const useModalHeroStore = create<HeroState>((set) => ({
	isModalVisible: false,
	setIsModalVisible: (isOpen: boolean) => set({ isModalVisible: isOpen }),
	heroData: {
		Id: 0,
		Name: "",
		Active: false,
		Category: {
			Id: 0,
			Name: "",
		},
	},
	setHeroData: (heroData: HeroData) => set({ heroData }),
	edit: false,
	setEdit: (edit: boolean) => set({ edit }),
}));
