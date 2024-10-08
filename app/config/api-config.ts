const BASE_URL = process.env.BASE_URL || "";
const ACCESS_KEY = process.env.ACCESS_KEY || "";

export async function Api<T = unknown>(
	input: string | URL | globalThis.Request,
	init?: RequestInit,
) {
	const url = `${BASE_URL}${input}`;
	const dataResponse = await fetch(url, {
		...init,
		headers: {
			...init?.headers,
			accessKey: ACCESS_KEY,
		},
	});

	const result = await dataResponse.json();
	return result as T;
}
