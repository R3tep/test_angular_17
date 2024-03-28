import { Routes } from '@angular/router';

import { CategoriesComponent } from './pages/categories'

export const routes: Routes = [
    {
        path: 'categories_group',
        component: CategoriesComponent
    },
    {
        path: '**',
        component: CategoriesComponent,
    },
];
