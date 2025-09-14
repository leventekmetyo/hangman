import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Difficulty, Status } from '@app/shared/enums';
import { Word } from '@app/shared/models';
import { GameService, WordService } from '@app/shared/services';

@Component({
  selector: 'hm-start',
  imports: [RouterLink],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
  private readonly gameService: GameService = inject(GameService);
  private readonly wordService: WordService = inject(WordService);
  private readonly router: Router = inject(Router);

  public readonly Difficulty = Difficulty;

  difficulty = Difficulty.Easy;

  ngOnInit(): void {
    this.gameService.loadGames().subscribe((games) => {
      if (games.length !== 0) {
        const index = games.length - 1;
        const game = games[index];
        if (game.status === Status.Playing) {
          this.router.navigate([`/game/${game.id}`]);
        }
      }
    });
    this.wordService.loadWords().subscribe();
  }

  createNewGame(): void {
    let words: Word[] = this.wordService.getWords();
    let maxWrongGuesses: number = 0;

    switch (this.difficulty) {
      case Difficulty.Easy:
        words = words.filter((word) => word.value.length <= 8);
        maxWrongGuesses = 6;
        break;
      case Difficulty.Medium:
        words = words.filter(
          (word) => word.value.length > 8 && word.value.length <= 11,
        );
        maxWrongGuesses = 8;
        break;
      case Difficulty.Hard:
        words = words.filter((word) => word.value.length > 11);
        maxWrongGuesses = 10;
        break;
    }

    if (words.length > 0) {
      const index: number = Math.floor(Math.random() * words.length);
      const word: Word = words[index];
      const id = (this.gameService.getGame().length + 1).toString();

      this.gameService.createNewGame({
        id,
        difficulty: this.difficulty,
        word,
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses,
        status: Status.Playing,
      });

      this.router.navigate([`/game/${id}`]);
    } else {
      alert(
        'Nincsenek elérhető szavak a játékhoz! Kérlek, próbáld újra később.',
      );
    }
  }
}
