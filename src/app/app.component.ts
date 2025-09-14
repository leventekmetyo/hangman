import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { loadGames, loadWords } from './shared/store/shared.actions';

@UntilDestroy()
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly store: Store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(loadWords());
    this.store.dispatch(loadGames());
  }
}
