import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { regexs } from '@shared/constants/regexs';
import { Dashboard } from '@shared/models/dashboard/dashboard';
import { UpdateDashboard } from '@shared/models/dashboard/update-dashboard';
import { SelectItem } from 'primeng/api/selectitem';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { icons } from './icons-list';

@Component({
    selector: 'app-update-dashboard',
    templateUrl: './dashboard-template.html',
    styleUrls: ['./dashboard-template.sass']
})
export class UpdateDashboardComponent implements OnInit {
    title: string = 'Edit dashboard';
    public formGroup: FormGroup = {} as FormGroup;
    selectedIcon: SelectItem;
    icons: SelectItem[] = icons;
    dashboard: Dashboard;

    constructor(
        private dialogRef: DynamicDialogRef,
        private dialogConfig: DynamicDialogConfig,
    ) { }

    ngOnInit() {
        this.dashboard = this.dialogConfig.data.dashboard;
        this.formGroup = new FormGroup({
            id: new FormControl(
                this.dashboard.id,
                [
                    Validators.required
                ]
            ),
            name: new FormControl(
                this.dashboard.name,
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(50),
                    Validators.pattern(regexs.dashboardName)
                ]
            )
        });
        this.selectedIcon = { label: `pi ${this.dashboard.icon}`, value: `${this.dashboard.icon}` };
    }

    onSelect(icon: SelectItem): void {
        this.selectedIcon = icon;
    }

    saveHandle(): void {
        const dashboard: UpdateDashboard = <UpdateDashboard> this.formGroup.value;
        dashboard.icon = this.selectedIcon.value;
        this.close(dashboard);
    }

    close(dashboard?: UpdateDashboard) {
        this.dialogRef.close(dashboard);
    }

    get name() { return this.formGroup.controls.name; }
}
