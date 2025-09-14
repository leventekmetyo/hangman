import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Game } from '../models';

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

  getGame() {
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

  createNewGame(game: Game): void {
    this.httpClient.post<Game>(`${environment.url}/games`, game).subscribe({
      next: (newGame) => {
        const currentGames = this.getGame();
        this.setGame([...currentGames, newGame]);
      },
      error: (error) => {
        console.error('Hiba az új játék létrehozásakor:', error);
      },
    });
  }

  updateGame(game: Game): void {
    this.httpClient
      .put<Game>(`${environment.url}/games/${game.id}`, game)
      .subscribe({
        next: (updatedGame) => {
          const currentGames = this.getGame();
          const index = currentGames.findIndex((g) => g.id === updatedGame.id);
          if (index !== -1) {
            currentGames[index] = updatedGame;
            this.setGame([...currentGames]);
          }
        },
        error: (error) => {
          console.error('Hiba a játék frissítésekor:', error);
        },
      });
  }
}
