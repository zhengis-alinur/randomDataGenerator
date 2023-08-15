import { Faker, allFakers } from "@faker-js/faker";
import { Locale, User } from "./types";
import { generateErrors } from "./faker/errors";
import { PER_PAGE } from "./constants";

export const generateRandomUser = ({
	faker, errors, region
}: {
	faker: Faker,
	region: Locale,
	errors?: number,
}) => {
	const user = {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		address: faker.location.streetAddress(),
		phone: faker.phone.number()
	};
	if (!errors) {
		return user
	}
	return generateErrors({ user, errors, region })
};



export const generateUsers = ({ region, seed, length = PER_PAGE, errors }: {
	region: Locale,
	seed: number,
	length?: number,
	errors?: number,
}): User[] => {
	const faker = allFakers[region];
	faker.seed(seed);
	return Array.from({ length }, () => generateRandomUser({ faker, errors, region }));
};
