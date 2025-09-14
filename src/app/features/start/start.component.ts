import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'hm-start',
  imports: [RouterLink],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartComponent {

}
