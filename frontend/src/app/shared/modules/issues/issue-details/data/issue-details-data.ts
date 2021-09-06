import { IssueStatus } from '@shared/models/issue/enums/issue-status';
import { IssueStatusDropdown } from '@shared/modules/issues/issue-details/data/models/issue-status-dropdown';

export class IssueDetailsData {
    public static getIssueStatusDropdownItems(): IssueStatusDropdown[] {
        return [
            {
                type: IssueStatus.Active,
                name: 'Active'
            },
            {
                type: IssueStatus.Resolved,
                name: 'Resolved'
            },
            {
                type: IssueStatus.Ignored,
                name: 'Ignored'
            },
        ];
    }
}
