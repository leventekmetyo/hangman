import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Difficulty, Status } from '@app/shared/enums';
import { Game, Word } from '@app/shared/models';
import { IsAvailablePipe, IsGuessedPipe } from '@app/shared/pipes';
import { addNewGame, updateGame } from '@app/shared/store/shared.actions';
import {
  selectCurrentGame,
  selectGames,
  selectWords,
} from '@app/shared/store/shared.selectors';
import { getAlphabet } from '@app/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'hm-game',
  imports: [IsAvailablePipe, IsGuessedPipe, AsyncPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly ref: ChangeDetectorRef = inject(ChangeDetectorRef);

  games$!: Observable<Game[]>;
  words$!: Observable<Word[]>;

  games: Game[] = [];
  words: Word[] = [];
  alphabet: string[] = [];
  game!: Game;

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    this.words$ = this.store.select(selectWords);

    this.alphabet = getAlphabet();

    this.games$.pipe(untilDestroyed(this)).subscribe((games) => {
      this.games = games;
    });

    this.words$.pipe(untilDestroyed(this)).subscribe((words) => {
      this.words = words;
    });

    this.loadCurrentGame();
  }

  guessLetter(letter: string): void {
    let wrongGuesses = this.game.wrongGuesses;
    let status = this.game.status;
    let guessedLetters: string[] = [
      ...this.game.guessedLetters,
      letter.toLowerCase(),
    ];

    if (!this.game.word.value.includes(letter.toLowerCase())) {
      wrongGuesses += 1;
    }
    if (this.game.wrongGuesses >= this.game.maxWrongGuesses) {
      status = Status.Lost;
    } else if (
      this.game.word.value
        .split('')
        .every((char) => guessedLetters.includes(char.toLowerCase()))
    ) {
      status = Status.Won;
    }
    this.store.dispatch(
      updateGame({
        ...this.game,
        wrongGuesses,
        status,
        guessedLetters,
      }),
    );

    this.ref.detectChanges();
  }

  loadCurrentGame(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.game = this.games.find((g) => g.id === id) as Game;
    } else {
      console.error('Nincs játék ID megadva az útvonalban.');
    }
  }

  endGame(): void {
    this.game.status = Status.Lost;
    this.store.dispatch(updateGame(this.game));

    this.router.navigate(['/start']);
  }

  createNewGame(): void {
    this.store.dispatch(
      updateGame({
        ...this.game,
        status: Status.Lost,
      }),
    );

    let words = this.words;

    switch (this.game.difficulty) {
      case Difficulty.Easy:
        words = words.filter((word) => word.value.length <= 8);
        break;
      case Difficulty.Medium:
        words = words.filter(
          (word) => word.value.length > 8 && word.value.length <= 11,
        );
        break;
      case Difficulty.Hard:
        words = words.filter((word) => word.value.length > 11);
        break;
    }

    if (words.length > 0) {
      const index: number = Math.floor(Math.random() * words.length);
      const word: Word = words[index];
      const id = (this.games.length + 1).toString();

      this.store.dispatch(
        addNewGame({
          id,
          difficulty: this.game.difficulty,
          word,
          guessedLetters: [],
          wrongGuesses: 0,
          maxWrongGuesses: 6,
          status: Status.Playing,
        }),
      );

      this.router.navigate([`/game/${id}`]);
    } else {
      alert(
        'Nincsenek elérhető szavak a játékhoz! Kérlek, próbáld újra később.',
      );
    }
  }
}
