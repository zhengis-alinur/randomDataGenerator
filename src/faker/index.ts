import { fakerRU, fakerEN_US, fakerLV } from '@faker-js/faker';
import { Locale } from '../types';

type FakerProps = {
	region: Locale,
	seed: number
}

export const getFaker = ({ region, seed }: FakerProps) => {
	let faker;
	switch (region) {
		case 'en_US': { faker = fakerEN_US; break; }
		case 'lv': { faker = fakerLV; break }
		case 'ru': { faker = fakerRU; break }
		default: { faker = fakerRU }
	}
	faker.seed(seed);
	return faker;
}