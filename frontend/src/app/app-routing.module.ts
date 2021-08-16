import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { UnauthorizedGuard } from '@core/guards/unauthorized.guard';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: 'landing',
        canActivate: [UnauthorizedGuard],
        loadChildren: () => import('./modules/landing/landing.module')
            .then(m => m.LandingModule),
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/home/home.module')
            .then(m => m.HomeModule)
    },
    {
        path: 'signin',
        canActivate: [UnauthorizedGuard],
        loadChildren: () => import('./modules/authorization/authorization.module')
            .then(m => m.AuthorizationModule)
    },
    {
        path: 'signup',
        canActivate: [UnauthorizedGuard],
        loadChildren: () => import('./modules/registration/registration.module')
            .then(m => m.RegistrationModule)
    },
    {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/user/user.module')
            .then(m => m.UserModule)
    },
    { path: '**',
        component: PageNotFoundComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
