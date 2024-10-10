"use client";
import ModalCreateEditHero from "@/components/ModalCreateEditHero";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
("next/cache");

import { deleteHero, listHero } from "@/services/heroes";
import { useModalHeroStore } from "@/store/useModalHeroStore";
import type { HeroData, HerosResponse } from "@/types/hero-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function Heroes() {
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 5,
	});
	const [heroesFilter, setHeroesFilter] = useState<HeroData[] | null>(null);

	const { setIsModalVisible, setEdit, setHeroData } = useModalHeroStore();

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const handlePreviousPage = () => {
		setPagination((prev) => ({
			...prev,
			page: prev.page > 1 ? prev.page - 1 : 1,
		}));
	};

	const handleNextPage = () => {
		setPagination((prev) => ({
			...prev,
			page: prev.page + 1,
		}));
	};

	const { data: heroes, isLoading: heroesIsLoading } = useQuery({
		queryKey: ["heroes-list"],
		queryFn: async () => {
			const response = await listHero();
			return response;
		},
	});

	useEffect(() => {
		if (heroes?.data.Items) {
			const startIndex = (pagination.page - 1) * pagination.limit;
			const endIndex = startIndex + pagination.limit;
			setHeroesFilter(heroes.data.Items.slice(startIndex, endIndex));
		}
	}, [heroes, pagination.page, pagination.limit]);

	const mutateDeleteHero = useMutation({
		mutationFn: (id: number) => deleteHero(id),
		onSuccess: (data) => {
			toast({
				title: "✅ Sucesso!",
				description: "Herói deletado com sucesso!",
			});
			queryClient.invalidateQueries({
				queryKey: ["heroes-list"],
			});
		},
		onError: (error: AxiosError) => {
			toast({
				title: "❌ Erro!",
				description: error?.message ? error?.message : "Erro ao deletar herói!",
			});
		},
	});

	const handleEdit = (heroData: HeroData) => {
		setIsModalVisible(true);
		setHeroData(heroData);
		setEdit(true);
	};

	const handleCreate = () => {
		setIsModalVisible(true);
		setEdit(false);
	};

	return (
		<>
			<div>
				<div className="w-full p-1 rounded-sm space-x-3">
					<Button
						className="bg-orange-400 hover:bg-orange-500"
						onClick={handleCreate}
					>
						Criar Herói
					</Button>
				</div>
				<div className="md:w-[700px] lg:w-[1024px] flex justify-center ">
					{heroesIsLoading ? (
						<div className="w-full space-y-1">
							<Skeleton className="w-full h-[60px] " />
							<Skeleton className="w-full h-[80px] " />
							<Skeleton className="w-full h-[80px] " />
							<Skeleton className="w-full h-[80px] " />
							<Skeleton className="w-full h-[80px] " />
							<Skeleton className="w-full h-[80px] " />
							<Skeleton className="w-full h-[60px] " />
						</div>
					) : (
						<Table className="border-2">
							<TableCaption>Lista de Heróis</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Hero</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Categoria</TableHead>
									<TableHead className="text-right"> </TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{heroesFilter?.map((hero) => (
									<TableRow key={hero.Id}>
										<TableCell className="font-medium w-[200px]">
											{hero.Name}
										</TableCell>
										<TableCell className="text-center">
											{hero.Active ? "✅" : "-"}
										</TableCell>
										<TableCell>{hero.Category.Name}</TableCell>
										<TableCell className="flex gap-1 justify-end">
											<Button
												className="w-10 p-1 h-10 bg-primary bg-orange-400 hover:bg-orange-500"
												onClick={() => handleEdit(hero)}
											>
												<Edit size={15} />
											</Button>
											<Button
												variant="destructive"
												className="w-10 p-0 h-10"
												onClick={() => mutateDeleteHero.mutateAsync(hero.Id)}
											>
												<Trash size={15} />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={3}>Total</TableCell>
									<TableCell className="text-right">
										{heroes?.data.Total}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					)}
				</div>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={handlePreviousPage}
								className="cursor-pointer"
							/>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href="#">{pagination.page}</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext
								onClick={handleNextPage}
								className="cursor-pointer"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
			<ModalCreateEditHero />
		</>
	);
}
