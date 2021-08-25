import { AbstractControl } from '@angular/forms';
import { OrganizationService } from '@core/services/organization.service';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap, take } from 'rxjs/operators';

export const checkOrganizationMembership = (orgService: OrganizationService) => (ctrl: AbstractControl) =>
    of(ctrl.value).pipe(
        delay(500),
        switchMap(slug => orgService.isOrganizationMembershipOpen(slug).pipe(
            map(isUnique =>
                (isUnique ? null : { notUnique: true })),
            catchError(() => of({ serverError: true }))
        )), take(1)
    );
