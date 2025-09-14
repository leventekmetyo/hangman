import { inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { GameService, WordService } from '../services';

import * as sharedActions from './shared.actions';

@UntilDestroy()
@Injectable()
export class SharedEffects {
  private readonly actions$ = inject(Actions);
  private readonly gameService = inject(GameService);
  private readonly wordService = inject(WordService);

  loadWords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.loadWords),
      exhaustMap(() =>
        this.wordService.loadWords().pipe(
          untilDestroyed(this),
          map((words) => sharedActions.loadWordsSuccess(words)),
          catchError((error) => of(sharedActions.loadWordsFailure(error))),
        ),
      ),
    ),
  );

  addNewWord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.addNewWord),
      exhaustMap((action) =>
        this.wordService.addNewWord(action.word).pipe(
          untilDestroyed(this),
          map((word) => sharedActions.addNewWordSuccess(word)),
          catchError((error) => of(sharedActions.addNewWordFailure(error))),
        ),
      ),
    ),
  );

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.loadGames),
      exhaustMap(() =>
        this.gameService.loadGames().pipe(
          untilDestroyed(this),
          map((games) => sharedActions.loadGamesSuccess(games)),
          catchError((error) => of(sharedActions.loadGamesFailure(error))),
        ),
      ),
    ),
  );

  addNewGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.addNewGame),
      exhaustMap((action) =>
        this.gameService.createNewGame(action.game).pipe(
          untilDestroyed(this),
          map((game) => sharedActions.addNewGameSuccess(game)),
          catchError((error) => of(sharedActions.addNewGameFailure(error))),
        ),
      ),
    ),
  );

  updateGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActions.updateGame),
      exhaustMap((action) =>
        this.gameService.updateGame(action.game).pipe(
          untilDestroyed(this),
          map((game) => sharedActions.updateGameSuccess(game)),
          catchError((error) => of(sharedActions.updateGameFailure(error))),
        ),
      ),
    ),
  );
}
