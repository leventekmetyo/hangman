import { Word } from '.';
import { Difficulty, Status } from '../enums';

export interface Game {
  id: string;
  difficulty: Difficulty;
  word: Word;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  status: Status;
}
