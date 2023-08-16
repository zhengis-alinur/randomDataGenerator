import { ALPHABETS } from "../constants";
import { Region, User } from "../types";
import seedrandom from 'seedrandom';

export const generateErrors = ({
	user,
	errors,
	region,
	seed,
}: {
	user: User;
	errors: number;
	region: Region;
	seed: number;
}) => {
	const rng = seedrandom(
		user.name + user.address + user.phone + user.id + errors + seed + region
	);

	let errorUser = { ...user };
	const floor = Math.floor(errors);
	const minor = errors - floor;
	const major = 1 - minor;

	for (let i = 0; i <= floor; i++) {
		if (rng() <= major) {
			errorUser = updateCredential(errorUser, rng, region);
		}
	}
	if (rng() < minor) {
		errorUser = updateCredential(errorUser, rng, region);
	}

	return errorUser;
};

const updateCredential = (user: User, rng: seedrandom.PRNG, region: Region) => {
	const { key, value } = getRandomUserCredential(user, rng);
	return { ...user, [key]: getRandomizer(rng)(value, region) };
};

const getRandomUserCredential = (user: User, rng: seedrandom.PRNG) => {
	const keys = Object.keys(user);
	const key = keys[Math.floor(rng() * keys.length)] as keyof User;
	return { key, value: user[key] };
};

const getRandomizer = (rng: seedrandom.PRNG) => {
	const probability = 1 / 3;
	const randomValue = rng();

	if (randomValue < probability) {
		return deleteSymbol(rng);
	} else if (randomValue < 2 * probability) {
		return addSymbol(rng);
	} else {
		return shuffleSymbols(rng);
	}
};

export const deleteSymbol = (rng: seedrandom.PRNG) => (inputString: string) => {
	if (inputString.length === 0) {
		return inputString;
	}

	const randomIndex = Math.floor(rng() * inputString.length - 1);
	const modifiedString = inputString.slice(0, randomIndex) + inputString.slice(randomIndex + 1);
	return modifiedString;
};

export const addSymbol = (rng: seedrandom.PRNG) => (inputString: string, region: Region) => {
	const alphabet = ALPHABETS[region];
	let symbol;

	if (rng() > 0.5) {
		const randomSymbol = alphabet[Math.floor(rng() * alphabet.length)];
		symbol = rng() > 0.5 ? randomSymbol : randomSymbol.toUpperCase();
	} else {
		symbol = Math.floor(rng() * 100);
	}

	const randomIndex = Math.floor(rng() * inputString.length - 1);
	const modifiedString = inputString.slice(0, randomIndex) + symbol + inputString.slice(randomIndex);
	return modifiedString;
};

export const shuffleSymbols = (rng: seedrandom.PRNG) => (inputString: string) => {
	if (inputString.length < 2) {
		return inputString;
	}

	const index1 = Math.floor(rng() * inputString.length);
	let index2 = Math.floor(rng() * inputString.length);

	while (index2 === index1) {
		index2 = Math.floor(rng() * inputString.length);
	}

	const letters = inputString.split('');
	const temp = letters[index1];
	letters[index1] = letters[index2];
	letters[index2] = temp;
	return letters.join('');
};
