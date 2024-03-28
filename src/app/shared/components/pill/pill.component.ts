import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pill } from '../../../common';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [],
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillComponent {
  @Input() public color: Pill = Pill.Default
  @Input() public text: string = 'Default text'
  @Input() public hasRadius: boolean = false
}
