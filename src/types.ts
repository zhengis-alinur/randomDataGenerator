import { REGIONS } from "./constants";

export type Region = keyof typeof REGIONS;

export type User = {
	id: string;
	name: string;
	address: string;
	phone: string;
}