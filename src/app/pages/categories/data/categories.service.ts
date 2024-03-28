import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, combineLatestWith, map, of, tap } from 'rxjs';
import { Category, Group } from '../../../common';
import { removeDuplicatesById } from '../../../shared/utils/utils';

const url = 'http://localhost:3000'

@Injectable({
    providedIn: 'root'
  })
export class CategoriesService {

    public allVisibleCategoriesFiltered$: BehaviorSubject<Category[]> =
        new BehaviorSubject<Category[]>([])
    public allVisibleCategoriesFilteredByGroup$: BehaviorSubject<Group[]> =
        new BehaviorSubject<Group[]>([])

    private allVisibleCategories$: Observable<Category[]> = of([])
    private groups: Group[] = []
    private groupsFiltered: Group[] = []
    private searchFilter = ''
    private groupIdFilter = -1
    private allVisibleCategories: Category[] = []

    constructor(private http: HttpClient) { }

    /**
     * Init all visible categories
     */
    public initAllVisibleCategories(): void {
        this.allVisibleCategories$ = this.getVisibleCategories().pipe(
            combineLatestWith(this.getAllCategories()),
            map(([visibleCategories, allCategories]) => {
                return allCategories.filter((category) => visibleCategories.map(({id}) => id).includes(category.id))
            }),
            tap((allCategories) => {
                this.allVisibleCategoriesFiltered$.next(allCategories)
                this.allVisibleCategories = allCategories
                this.sortCategories()
            })
        )
    }

    /**
     * Sort categories
     * @param { boolean } order
     */
    public async sortCategories(order: boolean = true): Promise<void> {
        this.allVisibleCategories = this.allVisibleCategories.sort((a, b) => {
            const nameA = (a.wording || '').toUpperCase();
            const nameB = (b.wording || '').toUpperCase();
            if (nameA < nameB) {
              return order ? -1 : 1;
            }
            if (nameA > nameB) {
              return order ? 1 : -1;
            }
            return 0;
          })
        
        this.applyFilterCategories()
    }

    /**
     * Set filter property and apply filter
     * @param { string } search 
     * @param { number } groupId 
     */
    public filterCategories(search: string, groupId: number): void {
        this.searchFilter = search
        this.groupIdFilter = groupId

        this.applyFilterCategories()
    }

    /**
     * Get group
     * @returns { Observable<Group[]> }
     */
    public getGroup(): Observable<Group[]> {
        return this.allVisibleCategories$.pipe(
            map((categories) => { 
                return [removeDuplicatesById(categories.map((category) => {
                    return {
                        id: category.group?.id,
                        name: category.group?.name,
                        color: category.group?.color,
                        categories: []
                    }
                }).sort((a, b) => {
                    const nameA = (a.name || '').toUpperCase();
                    const nameB = (b.name || '').toUpperCase();
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  })), categories]
            }),
            tap(([groups, categories]) => {
                this.groups = groups
                this.formatVisibleCategoriesByGroup(categories)
            }),
            map(([groups]) => groups)
        )
    }

    /**
     * Format visible categories by group
     * @param { Category[] } visibleCategories 
     */
    private formatVisibleCategoriesByGroup(visibleCategories: Category[]): void {
        this.groupsFiltered = JSON.parse(JSON.stringify( this.groups)); 
        visibleCategories.forEach((category) => {
            const indexGroup = this.groupsFiltered.findIndex((group) => 
                group.id === category.group?.id 
            )
            if (indexGroup > -1) {
                this.groupsFiltered[indexGroup].categories.push({
                    id: category.id,
                    wording: category.wording,
                    description: category.description,
                })               
            }
        })
        this.groupsFiltered = this.groupsFiltered.filter(( group ) => {
            return group.categories.length > 0;
        });
        this.allVisibleCategoriesFilteredByGroup$.next(this.groupsFiltered)   
    }

    /**
     * Apply filter on categories
     * @param { Category[] } visibleCategories 
     */
    private applyFilterCategories(): void {
        let allVisibleCategories = this.allVisibleCategories
        if (this.groupIdFilter === -1) {
            this.formatVisibleCategoriesByGroup(allVisibleCategories)
        } else {
            allVisibleCategories = allVisibleCategories.filter((category) => category.group?.id === this.groupIdFilter)
            this.formatVisibleCategoriesByGroup(allVisibleCategories)
        }   

        allVisibleCategories = allVisibleCategories.filter((category) => category.wording.toLowerCase().includes(this.searchFilter.toLowerCase()))
        this.formatVisibleCategoriesByGroup(allVisibleCategories)
        this.allVisibleCategoriesFiltered$.next(allVisibleCategories)

        this.allVisibleCategoriesFiltered$.next(allVisibleCategories)

    }

    /**
     * HTTP call to get all categories
     * @returns { Observable<Category[]> }
     */
    private getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(url + "/all-categories");
    }

    /**
     * HTTP call to get visible categories
     * @returns Observable<{ id: number }[]>
     */
    private getVisibleCategories(): Observable<{ id: number }[]> {
        return this.http.get<{ id: number }[]>(url + "/visible-categories");
    }
}
