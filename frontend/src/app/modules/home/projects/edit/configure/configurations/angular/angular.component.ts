import { main, errorHandler, appModule } from './angular.constants';
import { Component, OnInit } from '@angular/core';
import { BaseConfigurationComponent } from '../base-configuration.component';

@Component({
    selector: 'app-angular',
    templateUrl: './angular.component.html',
    styleUrls: ['../../configure-styles.sass']
})
export class AngularComponent extends BaseConfigurationComponent implements OnInit {
    main: string;
    errorHandler: string;
    appModule: string;

    ngOnInit(): void {
        this.main = main(this.apiKey);
        this.errorHandler = errorHandler;
        this.appModule = appModule;
    }
}