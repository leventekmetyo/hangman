import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isGuessed',
})
export class IsGuessedPipe implements PipeTransform {
  transform(letter: string, word: string, guessed: string[]): string {
    if (guessed.includes(letter.toLowerCase())) {
      return word.includes(letter.toLowerCase()) ? letter : '';
    }

    return '';
  }
}
