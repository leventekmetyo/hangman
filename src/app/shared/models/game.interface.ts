import { Difficulty, Status } from '../enums';

export interface Game {
  id: string;
  difficulty: Difficulty;
  word: string;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  status: Status;
}
