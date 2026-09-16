// src/app/features/core/core.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const coreRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./components/auth/login/login.component').then(
                (m) => m.LoginComponent
            )
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/auth/register/register.component').then(
                (m) => m.RegisterComponent
            )
    },
    {
        path: 'usuarios',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./components/usuarios/usuario-list/usuario-list.component').then(
                        (m) => m.UsuarioListComponent
                    )
            },
            {
                path: 'nuevo',
                loadComponent: () =>
                    import('./components/usuarios/usuario-form/usuario-form.component').then(
                        (m) => m.UsuarioFormComponent
                    )
            },
            {
                path: ':id',
                loadComponent: () =>
                    import('./components/usuarios/usuario-detail/usuario-detail.component').then(
                        (m) => m.UsuarioDetailComponent
                    )
            },
            {
                path: ':id/editar',
                loadComponent: () =>
                    import('./components/usuarios/usuario-form/usuario-form.component').then(
                        (m) => m.UsuarioFormComponent
                    )
            }
        ]
    },
    {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/usuarios/usuario-profile/usuario-profile.component').then(
                (m) => m.UsuarioProfileComponent
            )
    }
];