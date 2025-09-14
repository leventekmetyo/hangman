import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isAvailable',
})
export class IsAvailablePipe implements PipeTransform {
  transform(letter: string, guessed: string[]): boolean {
    return !guessed.includes(letter.toLowerCase());
  }
}
