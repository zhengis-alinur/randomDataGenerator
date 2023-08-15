import { ALPHABETS } from "../constants";
import { Region, User } from "../types";
import lodash from 'lodash';

export const generateErrors = ({ user, errors, region }: {
	user: User, errors: number, region: Region
}) => {
	let errorUser = { ...user };
	const floor = Math.floor(errors);
	const minor = errors - floor;
	const major = 1 - minor;
	for (let i = 0; i < floor; i++) {
		if (Math.random() <= major) {
			let { key, value } = getRandomUserCredential(errorUser);
			value = getRandomizer()(value, region);
			errorUser = { ...errorUser, [key]: value }
		}
	}
	if (Math.random() < minor) {
		let { key, value } = getRandomUserCredential(user);
		value = getRandomizer()(value, region);
		errorUser = { ...errorUser, [key]: value }
	}
	return errorUser;
}

const getRandomUserCredential = (user: User) => {
	const keys = Object.keys(user);
	const key = keys[Math.floor(Math.random() * keys.length)] as keyof User;
	return { key, value: user[key] }
}

const getRandomizer = () => {
	const probability = 1 / 3;
	const randomValue = Math.random();
	if (randomValue < probability) {
		return deleteSymbol;
	} else if (randomValue < 2 * probability) {
		return addSymbol;
	} else {
		return shuffleSymbols;
	}
}

export const deleteSymbol = (inputString: string) => {
	if (inputString.length === 0) {
		return inputString;
	}

	const randomIndex = lodash.random(0, inputString.length - 1);
	const modifiedString = inputString.slice(0, randomIndex) + inputString.slice(randomIndex + 1);
	return modifiedString;
};

export const addSymbol = (inputString: string, region: Region) => {
	const alphabet = ALPHABETS[region];
	let symbol;
	if (Math.random() > 0.5) {
		const randomSymbol = alphabet[Math.floor(Math.random() * alphabet.length)];
		symbol = Math.random() > 0.5 ? randomSymbol : randomSymbol.toUpperCase();
	} else {
		symbol = Math.floor(Math.random() * 100);
	}
	const randomIndex = lodash.random(0, inputString.length);
	const modifiedString = inputString.slice(0, randomIndex) + symbol + inputString.slice(randomIndex);
	return modifiedString;
};

export const shuffleSymbols = (inputString: string) => {
	if (inputString.length < 2) {
		return inputString;
	}
	const index1 = Math.floor(Math.random() * inputString.length);
	let index2 = Math.floor(Math.random() * inputString.length);
	while (index2 === index1) {
		index2 = Math.floor(Math.random() * inputString.length);
	}
	const letters = inputString.split('');
	const temp = letters[index1];
	letters[index1] = letters[index2];
	letters[index2] = temp;
	return letters.join('');
}