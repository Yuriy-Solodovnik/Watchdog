import { Component, OnInit } from '@angular/core';
import { Issue } from '@shared/models/issue/issue';
import { IssueService } from '@core/services/issue.service';
import { IssueMessage } from '@shared/models/issues/issue-message';
import { BaseComponent } from '@core/components/base/base.component';
import { ToastNotificationService } from '@core/services/toast-notification.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-issues',
    templateUrl: './issues.component.html',
    styleUrls: ['./issues.component.sass']
})
export class IssuesComponent extends BaseComponent implements OnInit {
    issues: IssueMessage[];

    countNew: { [type: string]: number };

    selectedIssues: Issue[] = [];

    timeOptions: string[];

    selectedTime: string;

    paginators = false;

    numberOfIssues = 0;

    itemsPerPage = 10;

    constructor(private issueService: IssueService, private toastNotification: ToastNotificationService) {
        super();
    }

    ngOnInit(): void {
        // this.loadIssues();
        // this.showPaginator();
        // this.setAllFieldsTemp();

        this.setAllFieldsTemp();
        this.loadIssues()
            .pipe(this.untilThis)
            .subscribe(() => {
                this.showPaginator();
            });
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

    private showPaginator() {
        this.paginators = this.numberOfIssues > this.itemsPerPage;
    }

    // private loadIssues() {
    //     this.issueService.getIssues()
    //         .pipe(this.untilThis)
    //         .subscribe(response => {
    //             this.issues = response;
    //             this.itemsPerPage = this.issues.length;
    //         }, errorResponse => {
    //             this.toastNotification.error(errorResponse, 'Error', 1500);
    //         });
    // }

    private loadIssues() {
        return this.issueService.getIssues()
            .pipe(
                tap(issues => {
                    this.issues = issues;
                    this.numberOfIssues = issues.length;
                }),
                catchError(error => of(this.toastNotification.error(error, 'Error', 1500)))
            )
    }

    private setAllFieldsTemp() {
        this.countNew = {
            all: 3,
            secondtype: 1,
            thirdtype: 0
        };
    }
}
