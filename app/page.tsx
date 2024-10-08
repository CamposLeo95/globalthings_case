import Heroes from "./Heroes/page";
import { Api } from "./config/api-config";
import type { HerosResponse } from "./types/hero-type";

export default async function Home() {
	const heroes = await Api<HerosResponse>("/Heroes");

	return (
		<div>
			<Heroes heroes={heroes} />
		</div>
	);
}
