import LayoutPage from "@/components/LayoutPage/layout-page";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash } from "lucide-react";
import type { HerosResponse } from "../types/hero-type";
import { Api } from "../config/api-config";

interface IHero {
	heroes: HerosResponse;
}

export default function Heroes({ heroes }: IHero) {


	return (
		<LayoutPage>
			<div className="w-full flex flex-col items-center">
				<div className="w-full py-2 rounded-sm space-x-3">
					<Button className="bg-orange-400 hover:bg-orange-500">
						Criar Herói
					</Button>
					<Button className="bg-orange-400 hover:bg-orange-500">
						Criar Categoria
					</Button>
				</div>
				<div className="w-full flex justify-center">
					<Table className="border-2 w-full ">
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
							{heroes?.Items.map((hero) => (
								<TableRow key={hero.Id}>
									<TableCell className="font-medium w-[200px]">
										{hero.Name}
									</TableCell>
									<TableCell>{hero.Active ? "ativo" : "não ativo"}</TableCell>
									<TableCell>{hero.Category.Name}</TableCell>
									<TableCell className="flex gap-1 justify-end">
										<Button className="w-10 p-0 h-10 bg-primary bg-orange-400 hover:bg-orange-500">
											<Edit />
										</Button>
										<Button variant="destructive" className="w-10 p-0 h-10">
											<Trash />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={3}>Total</TableCell>
								<TableCell className="text-right">{heroes.Total}</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</div>
			</div>
		</LayoutPage>
	);
}
