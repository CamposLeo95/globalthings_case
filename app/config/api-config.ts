import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY || "";

export const Api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		accessKey: ACCESS_KEY,
	},
});
