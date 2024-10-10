import { useToast } from "@/hooks/use-toast";
import { createCategory, updateCategory } from "@/services/categorys";
import { useModalCategoryStore } from "@/store/useModalCategoryStore";
import { handleError } from "@/utils/responseHandlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const schema = z.object({
	Name: z.string().min(1, "Nome é obrigatório"),
});

type CategorySchema = z.infer<typeof schema>;

export default function ModalCreateEditCategory() {
	const {
		isModalCategoryCreateEdit,
		setIsModalCategoryCreateEdit,
		edit,
		categoryData,
	} = useModalCategoryStore();

	const queryClient = useQueryClient();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CategorySchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			Name: "",
		},
	});

	useEffect(() => {
		if (edit) {
			reset({
				Name: categoryData?.Name,
			});
		}
		if (!edit) {
			reset({
				Name: "",
			});
		}
	}, [edit, reset, categoryData]);

	const mutateCreateCategory = useMutation({
		mutationFn: (data: CategorySchema) => createCategory(data),
		onSuccess: () => {
			toast({
				title: "✅ Sucesso!",
				description: "Categoria criada com sucesso!",
			});
			handleClose();
			queryClient.invalidateQueries({
				queryKey: ["categories-list-admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["categories-list-dropdown"],
			});
		},
		onError: (error: AxiosError) => {
			toast({
				title: "❌ Erro!",
				description: error?.request?.response
					? handleError(error?.request?.response)
					: "Erro ao criar categoria!",
			});
		},
	});

	const mutateUpdateCategory = useMutation({
		mutationFn: (data: CategorySchema) => updateCategory(categoryData.Id, data),
		onSuccess: () => {
			toast({
				title: "✅ Sucesso!",
				description: "Categoria editada com sucesso!",
			});
			handleClose();
			queryClient.invalidateQueries({
				queryKey: ["categories-list-admin"],
			});
			queryClient.invalidateQueries({
				queryKey: ["categories-list-dropdown"],
			});
		},
		onError: (error: AxiosError) => {
			toast({
				title: "❌ Erro!",
				description: error?.request?.response
					? handleError(error?.request?.response)
					: "Erro ao editar categoria!",
			});
		},
	});

	const onSubmit = (data: CategorySchema) => {
		if (edit) {
			mutateUpdateCategory.mutateAsync(data);
			return;
		}

		mutateCreateCategory.mutateAsync(data);
	};

	const handleClose = () => {
		setIsModalCategoryCreateEdit(false);
	};

	return (
		<Dialog
			open={isModalCategoryCreateEdit}
			onOpenChange={setIsModalCategoryCreateEdit}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{edit ? "Editar Categoria" : "Criar Categoria"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div>
						<Label>Nome</Label>
						<Input {...register("Name")} />
						{errors.Name && (
							<span className="text-red-500">{errors.Name.message}</span>
						)}
					</div>

					<DialogFooter>
						<Button className="hover:bg-primary_hover" type="submit">
							{edit ? "Editar" : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
