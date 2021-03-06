import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueDetailsPageComponent } from '@shared/modules/issues/issue-details/issue-details-page/issue-details-page.component';
import { IssuesComponent } from '@shared/modules/issues/issues.component';

const routes: Routes = [{
    path: '',
    component: IssuesComponent,
}, {
    path: ':issueId/:eventId',
    component: IssueDetailsPageComponent,
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IssuesRoutingModule {
}
