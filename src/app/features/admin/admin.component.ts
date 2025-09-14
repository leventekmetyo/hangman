import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Word } from '@app/shared/models';
import { WordService } from '@app/shared/services';
import { addNewWord } from '@app/shared/store/shared.actions';
import { selectWords } from '@app/shared/store/shared.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'hm-admin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  private readonly store: Store = inject(Store);

  wordFormGroup = new FormGroup({
    wordValue: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(14),
      ],
    }),
  });

  get value() {
    return this.wordFormGroup.get('wordValue') as FormControl;
  }

  words$!: Observable<Word[]>;

  words: Word[] = [];

  ngOnInit(): void {
    this.words$ = this.store.select(selectWords);

    this.words$.pipe(untilDestroyed(this)).subscribe((words) => {
      this.words = words;
    });
  }

  addNewWord(): void {
    if (this.value.valid) {
      const value = this.value.value?.toLowerCase();
      if (value) {
        const newWord: Word = {
          id: (this.words.length + 1).toString(),
          value,
        };

        this.store.dispatch(addNewWord(newWord));
      }
    }
  }
}
