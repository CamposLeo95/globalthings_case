import { useToast } from "@/hooks/use-toast";
import { deleteCategory, listCategory } from "@/services/categorys";
import { useModalCategoryStore } from "@/store/useModalCategoryStore";
import { handleError } from "@/utils/responseHandlers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Edit, X } from "lucide-react";
import ModalCreateEditCategory from "../ModalCreateEditCategory";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

export default function ModalAdminCategory() {
	const {
		isModalCategoryVisible,
		setIsModalCategoryVisible,
		setIsModalCategoryCreateEdit,
		setEdit,
		setCategoryData,
	} = useModalCategoryStore();

	const { data: categories } = useQuery({
		queryKey: ["categories-list-admin"],
		queryFn: listCategory,
	});

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const mutateRemoveCategory = useMutation({
		mutationFn: (id: number) => deleteCategory(id),
		onSuccess: (data) => {
			toast({
				title: "✅ Sucesso!",
				description: "Categoria deletada com sucesso!",
			});
			queryClient.invalidateQueries({
				queryKey: ["categories-list-admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["categories-list-dropdown"],
			});
		},
		onError: (error: AxiosError) => {
			console.log(error?.request?.response);
			toast({
				title: "❌ Erro!",
				description: error?.request?.response
					? handleError(error?.request?.response)
					: "Erro ao deletar categoria!",
			});
		},
	});

	return (
		<>
			<Dialog
				open={isModalCategoryVisible}
				onOpenChange={setIsModalCategoryVisible}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Categorias</DialogTitle>
					</DialogHeader>
					<div className="border h-[400px] overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Categoria</TableHead>

									<TableHead className="text-right"> </TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{categories?.data.Items.map((category) => (
									<TableRow key={category.Id}>
										<TableCell className="font-medium w-[200px]">
											{category.Name}
										</TableCell>

										<TableCell className="flex gap-1 justify-end">
											<div className="space-x-1">
												<Button
													size={"sm"}
													className="hover:bg-primary_hover"
													onClick={() => {
														setEdit(true);
														setCategoryData(category);
														setIsModalCategoryCreateEdit(true);
													}}
												>
													<Edit size={15} />
												</Button>
												<Button
													variant="destructive"
													size={"sm"}
													onClick={() =>
														mutateRemoveCategory.mutateAsync(category.Id)
													}
												>
													<X size={15} />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<DialogFooter>
						<Button
							size={"sm"}
							className="hover:bg-primary_hover"
							onClick={() => {
								setEdit(false);
								setIsModalCategoryCreateEdit(true);
							}}
						>
							Adicionar Categoria
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ModalCreateEditCategory />
		</>
	);
}
