import { Injectable } from '@angular/core';
import { Member } from '@shared/models/member/member';
import { Observable } from 'rxjs';
import { CoreHttpService } from './core-http.service';

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    readonly routePrefix = '/members';

    constructor(private httpService: CoreHttpService) { }

    getMembersByOrganizationId(organizationId: number): Observable<Member[]> {
        return this.httpService.getRequest<Member[]>(`${this.routePrefix}/organization/${organizationId}`);
    }

    getMemberByUserAndOgranization(organizationId: number, userId: number): Observable<Member> {
        return this.httpService.getRequest<Member>(`${this.routePrefix}/organization/${organizationId}/user/${userId}`);
    }

    searchMembersNotInTeam(teamId: number, memberEmail: string): Observable<Member[]> {
        const url = `team/${teamId}/exceptTeam/${memberEmail !== '' ? `?memberEmail=${memberEmail}` : ''}`;
        return this.httpService.getRequest<Member[]>(`${this.routePrefix}/${url}`);
    }

    getInitials(member: Member) {
        return member.user.firstName.toUpperCase().substr(0, 1) + member.user.lastName.toUpperCase().substr(0, 1);
    }
}
