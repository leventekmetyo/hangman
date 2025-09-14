import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Game } from '../models';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  private readonly games: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>(
    [],
  );
  games$: Observable<Game[]> = this.games.asObservable();

  setGame(games: Game[]) {
    this.games.next(games);
  }

  getGames() {
    return this.games.getValue();
  }

  loadGames(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(`${environment.url}/games`).pipe(
      tap((game) => {
        this.games.next(game);
      }),
    );
  }

  loadGameById(id: string): Observable<Game> {
    return this.httpClient.get<Game>(`${environment.url}/games/${id}`);
  }

  createNewGame(game: Game): Observable<Game> {
    return this.httpClient.post<Game>(`${environment.url}/games`, game);
  }

  updateGame(game: Game): Observable<Game> {
    return this.httpClient.put<Game>(
      `${environment.url}/games/${game.id}`,
      game,
    );
  }
}
