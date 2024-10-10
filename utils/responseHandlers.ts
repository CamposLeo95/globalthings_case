export function handleError(text: string) {
	return text.split('"')[3].trim();
}
