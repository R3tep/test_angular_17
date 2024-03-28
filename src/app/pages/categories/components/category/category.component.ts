import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PillComponent } from '../../../../shared';
import { Pill } from '../../../../common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [PillComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {

  @Input() public pill: {
    text: string,
    color: Pill
  } | undefined

  @Input() public title = ''
  @Input() public text = ''

  @Input() public isSelected = false

}
