import { Faker, allFakers } from "@faker-js/faker";
import { Region, User } from "./types";
import { generateErrors } from "./faker/errors";
import { PER_PAGE } from "./constants";

export const generateRandomUser = ({
	faker,
	errors = 0,
	region,
	seed = 0,
}: {
	faker: Faker;
	region: Region;
	errors?: number;
	seed?: number;
}) => {
	const user = {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		address: faker.location.streetAddress(),
		phone: faker.phone.number(),
	};

	if (!errors) {
		return user;
	}

	return generateErrors({ user, errors, region, seed });
};

export const generateUsers = ({
	region,
	seed,
	length = PER_PAGE,
	errors,
}: {
	region: Region;
	seed: number;
	length?: number;
	errors?: number;
}): User[] => {
	const faker = allFakers[region];
	faker.seed(seed);

	return Array.from({ length }, () =>
		generateRandomUser({ faker, errors, region, seed })
	);
};

const escapeCsvValue = (value: string) => {
	return `"${value.replace(/"/g, '""')}"`;
};

const arrayToCsv = (users: User[]) => {
	const headerRow = Object.keys(users[0]).map(escapeCsvValue).join(", ");
	const dataRows = users.map((user) =>
		Object.values(user).map(String).map(escapeCsvValue).join(", ")
	);

	return `sep=,\n${headerRow}\n${dataRows.join("\n")}`;
};

export const downloadBlob = (users: User[]) => {
	const filename = "export.csv";
	const contentType = "text/csv;charset=utf-8;";
	const content = arrayToCsv(users);

	const blob = new Blob([content], { type: contentType });
	const url = URL.createObjectURL(blob);

	const downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.setAttribute("download", filename);
	downloadLink.click();
};
