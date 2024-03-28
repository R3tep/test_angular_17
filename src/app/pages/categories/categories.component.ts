import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, effect, signal } from '@angular/core';
import { PillComponent, TabComponent } from '../../shared';
import { Category, Group, Pill, TabSvg } from '../../common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CategoryComponent } from './components';
import { CategoriesService } from './data';
import { Observable, combineLatest, of, startWith } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    PillComponent,
    TabComponent,
    ReactiveFormsModule,
    MatIconModule,
    CategoryComponent,
    AsyncPipe
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit {

  public group$: Observable<{
      id: number;
      name: string;
  }[]> = of([])

  public searchForm = new FormGroup({
    search: new FormControl(''),
    group: new FormControl(-1)
  })

  public TabSvg = TabSvg

  public Pill = Pill

  public isList: WritableSignal<boolean> = signal(false)
  public isSort: WritableSignal<boolean> = signal(true)

  private sortChangeEffect = effect(() => {
      this.categoriesService.sortCategories(this.isSort())

  });

  public allVisibleCategories$: Observable<Category[]> = of()
  public allVisibleCategoriesByGroup$: Observable<Group[]> = of()

  public constructor(private categoriesService: CategoriesService) {
  }

  public ngOnInit(): void {
      this.categoriesService.initAllVisibleCategories()

      this.allVisibleCategories$ = this.categoriesService.allVisibleCategoriesFiltered$
      this.allVisibleCategoriesByGroup$ = this.categoriesService.allVisibleCategoriesFilteredByGroup$
      this.group$ = this.categoriesService.getGroup()

      this.formAction()

      this.sortChangeEffect
  }

  public handleSaveSelectedCategories(): void {
      console.log('Save')
  }

  /**
   * Form action call filter
   */
  private formAction(): void {
    const search$ = this.searchForm.get('search')?.valueChanges.pipe(startWith('')) || of('')
    const group$ = this.searchForm.get('group')?.valueChanges.pipe(startWith(-1)) || of(-1)

    combineLatest([search$, group$]).pipe(
        untilDestroyed(this),
    ).subscribe(([search, group]) => 
        this.categoriesService.filterCategories(search || '', group || -1)
    )
  }
}
