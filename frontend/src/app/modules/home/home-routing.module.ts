import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from '@shared/components/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home-page/home-page.component';
import {ProjectsComponent} from "@modules/home/projects/projects.component";
import {IssuesComponent} from "@modules/home/issues/issues.component";

const routes: Routes = [{
    path: '',
    component: HomeComponent,
    children: [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    }, {
        path: 'projects',
        component: ProjectsComponent,
    }, {
        path: 'issues',
        component: IssuesComponent,
    },{
        path: 'dashboard/:name',
        component: DashboardComponent,
    }, {
        path: '**',
        component: NotFoundComponent,
        pathMatch: 'full'
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
