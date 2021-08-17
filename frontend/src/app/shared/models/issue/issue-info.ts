import { IssueMessageInfo } from '@shared/models/issue/issue-message-info';

export interface IssueInfo {
    issueId: string,
    errorMessage: string,
    errorClass: string,
    eventsCount: number,
    newest: IssueMessageInfo
}
