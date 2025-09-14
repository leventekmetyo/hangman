import { IsGuessedPipe } from './is-guessed.pipe';

describe('IsGuessedPipe', () => {
  it('create an instance', () => {
    const pipe = new IsGuessedPipe();
    expect(pipe).toBeTruthy();
  });
});
