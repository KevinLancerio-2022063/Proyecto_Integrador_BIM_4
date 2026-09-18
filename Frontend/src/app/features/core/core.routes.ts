import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';
export const coreRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./components/auth/login/login.component').then((m) => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/auth/register/register.component').then((m) => m.RegisterComponent)
    },
    // ============ USUARIOS (solo admin por guard) ============
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
    // ============ ZONAS (cualquier rol autenticado) ============
    {
        path: 'zonas',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./components/zonas/zona-list/zona-list.component').then(
                        (m) => m.ZonaListComponent
                    )
            },
            {
                path: 'nuevo',
                loadComponent: () =>
                    import('./components/zonas/zona-form/zona-form.component').then(
                        (m) => m.ZonaFormComponent
                    )
            },
            {
                path: ':id',
                loadComponent: () =>
                    import('./components/zonas/zona-detail/zona-detail.component').then(
                        (m) => m.ZonaDetailComponent
                    )
            },
            {
                path: ':id/editar',
                loadComponent: () =>
                    import('./components/zonas/zona-form/zona-form.component').then(
                        (m) => m.ZonaFormComponent
                    )
            }
        ]
    },
    // ============ PERFIL ============
    {
        path: 'perfil',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/usuarios/usuario-profile/usuario-profile.component').then(
                (m) => m.UsuarioProfileComponent
            )
    }
];