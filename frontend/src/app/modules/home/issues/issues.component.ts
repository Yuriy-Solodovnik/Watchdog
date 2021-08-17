import { IssuesHubService } from '@core/hubs/issues-hub.service';
import { Component, OnInit } from '@angular/core';
import { IssueService } from '@core/services/issue.service';
import { BaseComponent } from '@core/components/base/base.component';
import { ToastNotificationService } from '@core/services/toast-notification.service';
import { IssueInfo } from '@shared/models/issue/issue-info';

@Component({
    selector: 'app-issues',
    templateUrl: './issues.component.html',
    styleUrls: ['./issues.component.sass']
})
export class IssuesComponent extends BaseComponent implements OnInit {
    issues: IssueInfo[] = [];

    countNew: { [type: string]: number };

    selectedIssues: IssueInfo[] = [];

    timeOptions: string[];

    selectedTime: string;

    //TODO Fix when use real projects
    projectsIdsArray: number[] = [1, 2];

    constructor(
        private issuesHub: IssuesHubService,
        private issueService: IssueService,
        private toastNotification: ToastNotificationService
    ) { super(); }

    ngOnInit(): void {
        this.loadIssues();
        this.setAllFieldsTemp();

        this.subscribeToIssuesHub();
    }

    subscribeToIssuesHub() {
        this.issuesHub.messages.pipe(this.untilThis)
            .subscribe(issue => {
                this.issues.unshift(issue);
            });
        this.issuesHub.projects.next(this.projectsIdsArray);
    }

    selectAll(event: { checked: boolean, originalEvent: Event }) {
        this.disableParentEvent(event);
        if (event.checked) {
            this.selectedIssues = Object.assign([], this.issues);
        } else {
            this.selectedIssues = [];
        }
    }

    disableParentEvent(event: { originalEvent: Event }) { // to disable sorting
        event.originalEvent.stopPropagation();
    }

    private loadIssues() {
        this.issueService.getIssuesInfo()
            .pipe(this.untilThis)
            .subscribe(issues => {
                this.issues = issues;
            }, errorResponse => {
                this.toastNotification.error(errorResponse, 'Error', 1500);
            });
    }

    private setAllFieldsTemp() {
        this.countNew = {
            all: 3,
            secondtype: 1,
            thirdtype: 0
        };
    }
    error() {
        throw Error('OSIIBKA');
    }
    error2() {
        throw Error('OSIIBKA222');
    }
}
