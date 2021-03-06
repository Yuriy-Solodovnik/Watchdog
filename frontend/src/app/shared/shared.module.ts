import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserInitialsPipe } from './pipes/user-initials.pipe';

import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TooltipWithFullNameDirective } from './directives/dashboard/tooltip-with-full-name';
import { PrimeComponentsModule } from './modules/prime-components/prime-components.module';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { SavePipe } from './pipes/save.pipe';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ChartsComponent } from './components/charts/charts.component';
import { NoContentPlaceholderComponent } from './components/no-content-placeholder/no-content-placeholder';
import { TeamNameAvatarPipe } from './pipes/team-name-avatar.pipe';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxPhotoEditorModule } from 'ngx-photo-editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeComponentsModule,
        NgxJsonViewerModule,
        NgxChartsModule,
        GoogleChartsModule,
        NgxPhotoEditorModule,
        ProgressSpinnerModule,
    ],
    declarations: [
        LoadingSpinnerComponent,
        NotFoundComponent,
        TimeAgoPipe,
        SavePipe,
        UserInitialsPipe,
        TooltipWithFullNameDirective,
        ChartsComponent,
        NoContentPlaceholderComponent,
        TeamNameAvatarPipe
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerComponent,
        NotFoundComponent,
        PrimeComponentsModule,
        TimeAgoPipe,
        SavePipe,
        TeamNameAvatarPipe,
        NgxChartsModule,
        UserInitialsPipe,
        TooltipWithFullNameDirective,
        NgxJsonViewerModule,
        ChartsComponent,
        NoContentPlaceholderComponent,
        GoogleChartsModule,
        NgxPhotoEditorModule,
        ProgressSpinnerModule,
    ]
})
export class SharedModule { }
