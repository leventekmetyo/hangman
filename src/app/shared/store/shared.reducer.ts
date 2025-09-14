import { createReducer, on } from '@ngrx/store';
import { Game, Word } from '../models';

import * as sharedActions from './shared.actions';

export interface SharedState {
  words: Word[];
  games: Game[];
  currentGame: Game | null;
  loading: boolean;
  error: any;
}

export const initialSharedState: SharedState = {
  words: [],
  games: [],
  currentGame: null,
  loading: false,
  error: null,
};

export const sharedReducer = createReducer(
  initialSharedState,
  on(sharedActions.loadWords, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(sharedActions.loadWordsSuccess, (state, { words }) => ({
    ...state,
    words,
    loading: false,
    error: null,
  })),
  on(sharedActions.loadWordsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(sharedActions.addNewWord, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(sharedActions.addNewWordSuccess, (state, { word }) => ({
    ...state,
    words: [...state.words, word],
    loading: false,
    error: null,
  })),
  on(sharedActions.addNewWordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(sharedActions.loadGames, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(sharedActions.loadGamesSuccess, (state, { games }) => ({
    ...state,
    games,
    loading: false,
    error: null,
  })),
  on(sharedActions.loadGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(sharedActions.addNewGame, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(sharedActions.addNewGameSuccess, (state, { game }) => ({
    ...state,
    games: [...state.games, game],
    loading: false,
    error: null,
  })),
  on(sharedActions.addNewGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(sharedActions.updateGame, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(sharedActions.updateGameSuccess, (state, { game }) => ({
    ...state,
    games: state.games.map((g) => (g.id === game.id ? game : g)),
    loading: false,
    error: null,
  })),
  on(sharedActions.updateGameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(sharedActions.setCurrentGame, (state, { game }) => ({
    ...state,
    currentGame: game,
  })),
);
