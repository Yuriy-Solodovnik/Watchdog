import { Member } from '@shared/models/member/member';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthenticationService } from '@core/services/authentication.service';
import { ConfirmWindowService } from '@core/services/confirm-window.service';
import { ProjectService } from '@core/services/project.service';
import { SpinnerService } from '@core/services/spinner.service';
import { ToastNotificationService } from '@core/services/toast-notification.service';
import { hasAccess } from '@core/utils/access.utils';
import { AlertCategory } from '@shared/models/alert-settings/alert-category';
import { AlertSettings } from '@shared/models/alert-settings/alert-settings';
import { Platform } from '@shared/models/platforms/platform';
import { Project } from '@shared/models/projects/project';
import { RecipientTeam } from '@shared/models/projects/recipient-team';
import { UpdateProject } from '@shared/models/projects/update-project';
import { User } from '@shared/models/user/user';
import { PrimeIcons } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { zip } from 'rxjs';
import { Data } from '../data';
import { TabPanel, TabView } from 'primeng/tabview';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.sass'],
    providers: [Data, DialogService]
})
export class EditComponent extends BaseComponent implements OnInit {
    user: User;
    member: Member;
    alertSetting = {} as AlertSettings;
    editForm: FormGroup = new FormGroup({});
    editFormAlert: FormGroup = new FormGroup({});
    project: Project;
    id: string;
    dropPlatform: Platform[];
    recipientTeams: RecipientTeam[];

    notFound: boolean;
    loading: boolean;
    activeIndex: number = 0;

    hasAccess = () => hasAccess(this.member);

    private tabView: TabView;
    private tabPanel: TabPanel;

    @ViewChild(TabView) set tabviewChild(value: TabView) {
        this.tabView = value;
        if (this.tabPanel) {
            setTimeout(() => this.change(), 0);
        }
    }
    @ViewChild('configure') set tabPanelChild(value: TabPanel) {
        this.tabPanel = value;
        if (this.tabView) {
            setTimeout(() => this.change(), 0);
        }
    }

    constructor(
        private toastNotifications: ToastNotificationService,
        private authService: AuthenticationService,
        private projectService: ProjectService,
        public alertData: Data,
        private router: Router,
        private spinner: SpinnerService,
        private activatedRoute: ActivatedRoute,
        private confirmService: ConfirmWindowService
    ) {
        super();
    }

    changed: boolean;
    change(): void {
        if (!this.changed) {
            const index = this.tabView.tabs.findIndex(x => x.id === this.tabPanel.id);
            this.activeIndex = index;
            this.changed = true;
        }
    }

    ngOnInit() {
        this.changed = false;
        this.loading = true;
        this.spinner.show(true);
        this.id = this.activatedRoute.snapshot.params.id;
        this.activatedRoute.paramMap
            .pipe(this.untilThis)
            .subscribe(params => {
                this.id = params.get('id');
                this.user = this.authService.getUser();
                zip(this.authService.getMember(), this.projectService.getProjectById(this.id))
                    .pipe(this.untilThis)
                    .subscribe(([member, project]) => {
                        if (project?.organizationId !== member.organizationId) {
                            this.notFound = true;
                        } else {
                            this.member = member;
                            this.project = project;
                        }
                        this.loading = false;
                        this.spinner.hide();
                    }, () => {
                        this.notFound = true;
                        this.loading = false;
                        this.spinner.hide();
                    });
            });
        this.activatedRoute.queryParamMap
            .pipe(this.untilThis)
            .subscribe(params => {
                const tab = params.get('tab');
                if (tab !== 'configure') {
                    this.changed = true;
                }
            });
    }

    alertFormatting() {
        const specialAlert = { ...this.editFormAlert.value };
        this.alertSetting = {
            alertCategory: specialAlert.alertCategory,
            specialAlertSetting: specialAlert.alertCategory === AlertCategory.Special ? specialAlert : null
        };
        this.recipientTeams = specialAlert.alertCategory === AlertCategory.None ? [] : specialAlert.recipientTeams;
    }

    updateProjectFunction() {
        this.alertFormatting();
        const project: UpdateProject = { ...this.editForm.value, alertSettings: this.alertSetting, recipientTeams: this.recipientTeams };
        if (this.editForm.valid) {
            this.projectService.updateProject(this.id, project)
                .pipe(this.untilThis)
                .subscribe((updatedProject) => {
                    this.project = updatedProject;
                    this.toastNotifications.success('Project has been updated!');
                }, error => {
                    this.toastNotifications.error(error);
                });
        } else {
            this.toastNotifications.error('Form is not valid', 'Error');
        }
    }

    deleteProjectModal() {
        this.confirmService.confirm({
            title: `Remove Project ${this.project.name}`,
            message: 'Are you sure, you want to delete this project?',
            icon: PrimeIcons.BAN,
            acceptButton: { label: 'Yes', class: 'p-button-outlined p-button-danger' },
            cancelButton: { label: 'No', class: 'p-button-outlined p-button-secondary' },
            accept: () => {
                this.deleteProject();
            }
        });
    }

    deleteProject() {
        this.projectService.removeProject(this.project.id)
            .pipe(this.untilThis)
            .subscribe(() => {
                this.router.navigate(['home', 'projects']).then(() => {
                    this.toastNotifications.success('Project has been deleted');
                });
            }, error => {
                this.toastNotifications.error(error);
            });
    }

    get isBrowser() { return this.project.platform.platformTypes.isBrowser; }
}
