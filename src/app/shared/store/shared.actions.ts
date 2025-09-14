import { createAction } from '@ngrx/store';
import { Game, Word } from '../models';

export const loadWords = createAction('[Shared] Load Words');
export const loadWordsSuccess = createAction(
  '[Shared] Load Words Success',
  (words: Word[]) => ({ words }),
);
export const loadWordsFailure = createAction(
  '[Shared] Load Words Failure',
  (error: any) => ({ error }),
);

export const addNewWord = createAction(
  '[Shared] Add New Word',
  (word: Word) => ({ word }),
);
export const addNewWordSuccess = createAction(
  '[Shared] Add New Word Success',
  (word: Word) => ({ word }),
);
export const addNewWordFailure = createAction(
  '[Shared] Add New Word Failure',
  (error: any) => ({ error }),
);

export const loadGames = createAction('[Shared] Load Games');
export const loadGamesSuccess = createAction(
  '[Shared] Load Games Success',
  (games: Game[]) => ({ games }),
);
export const loadGamesFailure = createAction(
  '[Shared] Load Games Failure',
  (error: any) => ({ error }),
);

export const addNewGame = createAction(
  '[Shared] Add New Game',
  (game: Game) => ({ game }),
);
export const addNewGameSuccess = createAction(
  '[Shared] Add New Game Success',
  (game: Game) => ({ game }),
);
export const addNewGameFailure = createAction(
  '[Shared] Add New Game Failure',
  (error: any) => ({ error }),
);

export const updateGame = createAction(
  '[Shared] Update Game',
  (game: Game) => ({ game }),
);
export const updateGameSuccess = createAction(
  '[Shared] Update Game Success',
  (game: Game) => ({ game }),
);
export const updateGameFailure = createAction(
  '[Shared] Update Game Failure',
  (error: any) => ({ error }),
);

export const setCurrentGame = createAction(
  '[Shared] Set Current Game',
  (game: Game | null) => ({ game }),
);
