import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';
import { TabSvg } from '../../../common';
import { MatIconModule } from '@angular/material/icon'


@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent {
  @Input() public svg: TabSvg = TabSvg.Sort
  @Input() public signalIsActive: WritableSignal<boolean> = signal(true)

  public title =  {
    [TabSvg.Group]: "Grouper par catégorie",
    [TabSvg.Sort]: "Trier par ordre alphabétique"
  }

  public text = {
    [TabSvg.Group]: "Groupe de catégorie",
    [TabSvg.Sort]: "Ordre alphabétique"
  }


  public setSignal(): void {
    this.signalIsActive.update((value) => !value)
  }

}
