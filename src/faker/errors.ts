import seedrandom from 'seedrandom';
import { ALPHABETS } from '../constants';
import { Region, User } from '../types';

type Props = {
	user: User;
	errors: number;
	region: Region;
	seed: number;
};

class ErrorGenerator {
	private user: User;
	private errors: number;
	private region: Region;
	private rng: seedrandom.PRNG;

	constructor({ user, errors, region, seed }: Props) {
		this.user = user;
		this.errors = errors;
		this.region = region;
		this.rng = seedrandom(
			user.name + user.address + user.phone + user.id + errors + seed + region
		);
	}

	generateErrors = (): User => {
		let errorUser = { ...this.user };
		const floor = Math.floor(this.errors);
		const minor = this.errors - floor;
		const major = 1 - minor;

		for (let i = 0; i <= floor; i++) {
			if (this.rng() <= major) {
				errorUser = this.updateCredential(errorUser);
			}
		}

		if (this.rng() < minor) {
			errorUser = this.updateCredential(errorUser);
		}

		return errorUser;
	};

	updateCredential = (user: User): User => {
		const { key, value } = this.getRandomUserCredential(user);
		return { ...user, [key]: this.getRandomizer()(value) };
	};

	getRandomUserCredential = (user: User): { key: keyof User; value: any } => {
		const keys = Object.keys(user);
		const key = keys[Math.floor(this.rng() * keys.length)] as keyof User;
		return { key, value: user[key] };
	};

	getRandomizer = () => {
		const probability = 1 / 3;
		const randomValue = this.rng();

		if (randomValue < probability) {
			return this.deleteSymbol;
		} else if (randomValue < 2 * probability) {
			return this.addSymbol;
		} else {
			return this.shuffleSymbols;
		}
	};

	deleteSymbol = (inputString: string) => {
		if (inputString.length === 0) {
			return inputString;
		}

		const randomIndex = Math.floor(this.rng() * inputString.length);
		const modifiedString =
			inputString.slice(0, randomIndex) + inputString.slice(randomIndex + 1);
		return modifiedString;
	};

	addSymbol = (inputString: string) => {
		const alphabet = ALPHABETS[this.region];
		let symbol;

		if (this.rng() > 0.5) {
			const randomSymbol =
				alphabet[Math.floor(this.rng() * alphabet.length)];
			symbol = this.rng() > 0.5 ? randomSymbol : randomSymbol.toUpperCase();
		} else {
			symbol = Math.floor(this.rng() * 100);
		}

		const randomIndex = Math.floor(this.rng() * inputString.length);
		const modifiedString =
			inputString.slice(0, randomIndex) +
			symbol +
			inputString.slice(randomIndex);
		return modifiedString;
	};

	shuffleSymbols = (inputString: string) => {
		if (inputString.length < 2) {
			return inputString;
		}

		const index1 = Math.floor(this.rng() * inputString.length);
		let index2 = Math.floor(this.rng() * inputString.length);

		while (index2 === index1) {
			index2 = Math.floor(this.rng() * inputString.length);
		}

		const letters = inputString.split('');
		const temp = letters[index1];
		letters[index1] = letters[index2];
		letters[index2] = temp;
		return letters.join('');
	};
}

export default ErrorGenerator;
