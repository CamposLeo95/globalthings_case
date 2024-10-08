import type { ReactNode } from "react";

interface LayoutPageProps {
	children: ReactNode;
}
export default function LayoutPage({ children }: LayoutPageProps) {
	return (
		<div>
			<div className="w-full h-16 bg-orange-400 flex items-center  p-4 text-white font-bold text-3xl ">
				<span>GlobalThings - Case</span>
			</div>
			<div className="p-4 lg:px-40 flex justify-center w-full ">{children}</div>
		</div>
	);
}
