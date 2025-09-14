import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Word } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly words: BehaviorSubject<Word[]> = new BehaviorSubject<Word[]>(
    [],
  );
  words$: Observable<Word[]> = this.words.asObservable();

  setWords(words: Word[]) {
    this.words.next(words);
  }

  getWords() {
    return this.words.getValue();
  }

  loadWords(): Observable<Word[]> {
    return this.httpClient.get<Word[]>(`${environment.url}/words`).pipe(
      tap((words) => {
        this.words.next(words);
      }),
    );
  }
}
