"use client";

import { useToast } from "@/hooks/use-toast";
import { listCategory } from "@/services/categorys";
import { createHero, updateHero } from "@/services/heroes";
import { useModalCategoryStore } from "@/store/useModalCategoryStore";
import { useModalHeroStore } from "@/store/useModalHeroStore";
import type { HeroRequest } from "@/types/hero-type";
import { handleError } from "@/utils/responseHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ModalAdminCategory from "../ModalAdminCategory";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

const schema = z.object({
	Name: z.string().min(1, "Nome é obrigatório"),
	Active: z.boolean().default(false),
	CategoryId: z.number({ message: "Categoria é obrigatória" }).int(),
});

type Hero = z.infer<typeof schema>;

export default function ModalCreateEditHero() {
	const {
		isModalVisible,
		setIsModalVisible,
		heroData,
		setHeroData,
		edit,
		setEdit,
	} = useModalHeroStore();

	const { setIsModalCategoryVisible } = useModalCategoryStore();

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const { data: categories } = useQuery({
		queryKey: ["categories-list-dropdown"],
		queryFn: listCategory,
	});

	const mutateCreateHero = useMutation({
		mutationFn: (data: HeroRequest) => createHero(data),
		onSuccess: (data) => {
			toast({
				title: "✅ Sucesso!",
				description: `Herói ${data?.data.Name} foi criado com sucesso`,
			});
			handleClose();
			queryClient.invalidateQueries({
				queryKey: ["heroes-list"],
			});
		},
		onError: (error: AxiosError) => {
			toast({
				title: "❌ Erro!",
				description: error?.request?.response
					? handleError(error?.request?.response)
					: "Erro ao criar herói!",
			});
		},
	});

	const mutateUpdateHero = useMutation({
		mutationFn: (data: HeroRequest) => updateHero(heroData?.Id || 0, data),
		onSuccess: (data) => {
			toast({
				title: "✅ Sucesso!",
				description: `Herói ${data?.data.Name} foi alterado com sucesso!`,
			});
			handleClose();
			queryClient.invalidateQueries({
				queryKey: ["heroes-list"],
			});
		},
		onError: (error: AxiosError) => {
			toast({
				title: "❌ Erro!",
				description: error?.request?.response
					? handleError(error?.request?.response)
					: "Erro ao atualizar herói!",
			});
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		control,
		reset,
		watch,
	} = useForm<Hero>({
		resolver: zodResolver(schema),
		defaultValues: {
			Name: "",
			CategoryId: 0,
			Active: false,
		},
	});

	useEffect(() => {
		if (edit) {
			reset({
				Name: heroData.Name,
				CategoryId: heroData.Category.Id,
				Active: heroData.Active,
			});
		}

		if (!edit) {
			reset({
				Name: "",
				CategoryId: 0,
				Active: false,
			});
		}
	}, [edit, reset, heroData]);

	const onSubmit = (data: HeroRequest) => {
		try {
			const heroDataForm = {
				Name: data.Name,
				CategoryId: data.CategoryId,
				Active: data.Active,
			};

			if (heroData?.Id !== 0) {
				mutateUpdateHero.mutateAsync(heroDataForm);
				return;
			}
			mutateCreateHero.mutateAsync(heroDataForm);
		} catch (error) {
			return;
		}
	};

	const handleClose = () => {
		setEdit(false);
		setIsModalVisible(false);
		setHeroData({
			Id: 0,
			Name: "",
			Active: false,
			Category: {
				Id: 0,
				Name: "",
			},
		});
		reset();
	};

	return (
		<>
			<Dialog open={isModalVisible} onOpenChange={handleClose}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{edit ? "Atualizar Herói" : "Criar Herói"}
						</DialogTitle>
					</DialogHeader>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="grid grid-cols-12 gap-3"
					>
						<div className="form-group col-span-12 space-y-1">
							<Label htmlFor="name">Nome do herói</Label>
							<Input type="text" id="name" {...register("Name")} />
							{errors.Name && (
								<p className="text-red-500">{errors.Name.message}</p>
							)}
						</div>
						<div className="form-group col-span-3 flex items-center gap-3 ">
							<Label htmlFor="Active">Ativo</Label>
							<Controller
								control={control}
								name="Active"
								render={({ field: { onChange, value } }) => (
									<Switch
										id="Active"
										checked={value}
										onCheckedChange={onChange}
									/>
								)}
							/>
						</div>
						<div className="form-group col-span-8 space-y-1">
							<Select
								value={watch("CategoryId")?.toString()}
								onValueChange={(value) => setValue("CategoryId", Number(value))}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecione uma categoria" />
								</SelectTrigger>
								<SelectContent>
									{categories?.data.Items.map((category) => (
										<SelectItem
											key={category.Id}
											value={category.Id.toString()}
										>
											{category.Name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.CategoryId && (
								<p className="text-red-500 ">{errors.CategoryId.message}</p>
							)}
						</div>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button
										type="button"
										className="bg-primary hover:bg-primary_hover col-span-1 p-2 w-10 h-10 flex items-center justify-center"
										onClick={(e) => {
											e.preventDefault();
											setIsModalCategoryVisible(true);
										}}
									>
										<Plus size={15} />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Criar Categorias</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div className="col-span-12 space-x-2">
							<Button
								type="submit"
								className="bg-primary hover:bg-primary_hover "
							>
								{edit ? "Atualizar Herói" : "Criar Herói"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
			<ModalAdminCategory />
		</>
	);
}
