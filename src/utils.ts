import { Faker, allFakers } from "@faker-js/faker";
import { Region, User } from "./types";
import { generateErrors } from "./faker/errors";
import { PER_PAGE } from "./constants";

export const generateRandomUser = ({
	faker, errors, region
}: {
	faker: Faker,
	region: Region,
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
	region: Region,
	seed: number,
	length?: number,
	errors?: number,
}): User[] => {
	const faker = allFakers[region];
	faker.seed(seed);
	return Array.from({ length }, () => generateRandomUser({ faker, errors, region }));
};

const arrayToCsv = (users: User[]) => {
	return 'sep=, \n' + users.map((user) => Object.values(user)).map(row =>
		row
			.map(String)
			.map(v => v.replaceAll('"', '""'))
			.map(v => `"${v}"`)
			.join(', ')
	).join('\n');
}

export const downloadBlob = (users: User[]) => {
	const filename = 'export.csv';
	const contentType = 'text/csv;charset=utf-8;';
	let content = arrayToCsv(users);
	console.log(content);
	var blob = new Blob([content], { type: contentType });
	var url = URL.createObjectURL(blob);
	var pom = document.createElement('a');
	pom.href = url;
	pom.setAttribute('download', filename);
	pom.click();
}