import { Pipe, PipeTransform } from '@angular/core';
import { Game } from '../models';

@Pipe({
  name: 'isGuessed',
})
export class IsGuessedPipe implements PipeTransform {
  transform(letter: string, game: Game): string {
    if (game.word.value.indexOf(letter.toLowerCase()) === -1) {
      return '';
    } else {
      return game.guessedLetters.includes(letter.toLowerCase()) ? letter : '';
    }
  }
}
