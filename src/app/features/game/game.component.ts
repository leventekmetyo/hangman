import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Difficulty, Status } from '@app/shared/enums';
import { Game, Word } from '@app/shared/models';
import { IsAvailablePipe, IsGuessedPipe } from '@app/shared/pipes';
import { GameService, WordService } from '@app/shared/services';
import { getAlphabet } from '@app/shared/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'hm-game',
  imports: [AsyncPipe, IsAvailablePipe, IsGuessedPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly gameService: GameService = inject(GameService);
  private readonly wordService: WordService = inject(WordService);

  game$!: Observable<Game>;
  alphabet: string[] = [];
  words: Word[] = [];

  ngOnInit(): void {
    this.words = this.wordService.getWords();
    this.loadGame();
    this.alphabet = getAlphabet();
  }

  guessLetter(letter: string): void {
    this.game$.subscribe((game) => {
      if (
        game.status === Status.Playing &&
        !game.guessedLetters.includes(letter.toLowerCase())
      ) {
        game.guessedLetters.push(letter.toLowerCase());
        if (!game.word.value.includes(letter.toLowerCase())) {
          game.wrongGuesses += 1;
        }
        if (game.wrongGuesses >= game.maxWrongGuesses) {
          game.status = Status.Lost;
        } else if (
          game.word.value
            .split('')
            .every((char) => game.guessedLetters.includes(char.toLowerCase()))
        ) {
          game.status = Status.Won;
        }
        this.gameService.updateGame(game);
        this.loadGame();
      }
    });
  }

  loadGame(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.game$ = this.gameService.loadGameById(id);
    } else {
      console.error('Nincs játék ID megadva az útvonalban.');
    }
  }

  endGame(): void {
    this.game$.subscribe((game) => {
      game.status = Status.Lost;
      this.gameService.updateGame(game);

      this.router.navigate(['/start']);
    });
  }

  createNewGame(): void {
    this.game$.subscribe((game) => {
      game.status = Status.Lost;
      this.gameService.updateGame(game);

      let words = this.words;

      switch (game.difficulty) {
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
        const id = (this.gameService.getGame().length + 1).toString();

        this.gameService.createNewGame({
          id,
          difficulty: game.difficulty,
          word,
          guessedLetters: [],
          wrongGuesses: 0,
          maxWrongGuesses: 6,
          status: Status.Playing,
        });

        this.router.navigate([`/game/${id}`]);
      } else {
        alert(
          'Nincsenek elérhető szavak a játékhoz! Kérlek, próbáld újra később.',
        );
      }
    });
  }
}
