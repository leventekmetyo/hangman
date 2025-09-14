import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Difficulty, Status } from '@app/shared/enums';
import { Game, Word } from '@app/shared/models';
import { addNewGame, setCurrentGame } from '@app/shared/store/shared.actions';
import { selectGames, selectWords } from '@app/shared/store/shared.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'hm-start',
  imports: [],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
  private readonly store: Store = inject(Store);
  private readonly router: Router = inject(Router);

  public readonly Difficulty = Difficulty;

  difficulty = Difficulty.Easy;
  games$!: Observable<Game[]>;
  words$!: Observable<Word[]>;

  games: Game[] = [];
  words: Word[] = [];

  ngOnInit(): void {
    this.games$ = this.store.select(selectGames);
    this.words$ = this.store.select(selectWords);

    this.games$.pipe(untilDestroyed(this)).subscribe((games) => {
      this.games = games;
      if (games.length !== 0) {
        const index = games.length - 1;
        const game = games[index];
        if (game.status === Status.Playing) {
          this.store.dispatch(setCurrentGame(game));
          this.router.navigate([`/game/${game.id}`]);
        }
      }
    });

    this.words$.pipe(untilDestroyed(this)).subscribe((words) => {
      this.words = words;
    });
  }

  createNewGame(): void {
    let words: Word[] = this.words;
    let maxWrongGuesses: number = 0;

    switch (this.difficulty) {
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

      const newGame = {
        id,
        difficulty: this.difficulty,
        word,
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses: 6,
        status: Status.Playing,
      };

      this.store.dispatch(setCurrentGame(newGame));
      this.store.dispatch(addNewGame(newGame));

      this.router.navigate([`/game/${id}`]);
    } else {
      alert(
        'Nincsenek elérhető szavak a játékhoz! Kérlek, próbáld újra később.',
      );
    }
  }
}
