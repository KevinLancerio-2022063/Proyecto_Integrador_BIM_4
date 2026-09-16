// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { coreRoutes } from './features/core/core.routes';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
    },
    ...coreRoutes,
    {
        path: '**',
        redirectTo: 'usuarios'
    }
];