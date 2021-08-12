import { Component, OnInit } from '@angular/core';
import { User } from '@shared/models/user/user';
import { AuthenticationService } from '@core/services/authentication.service';
import { BaseComponent } from '@core/components/base/base.component';
import { NewOrganization } from '@shared/models/organization/newOrganization';
import { ToastNotificationService } from '@core/services/toast-notification.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { regexs } from '@shared/constants/regexs';
import { RegOrganizationDto } from '../DTO/regOrganizationDto';
import { NewUserDto } from '../DTO/newUserDto';

@Component({
    selector: 'app-registration-form',
    templateUrl: './registration-form.component.html',
    styleUrls: ['./registration-form.component.sass']
})
export class RegistrationFormComponent extends BaseComponent implements OnInit {
    formGroup: FormGroup;
    user = {} as User;
    organization = {} as NewOrganization;
    organizationSlug: string;

    password: string;
    confirmPassword: string;

    isNotFinishedRegistration = false;

    constructor(
        private authService: AuthenticationService,
        private toastService: ToastNotificationService
    ) {
        super();
    }

    ngOnInit(): void {
        const user = this.authService.getUser();
        this.isNotFinishedRegistration = Boolean(user) && !user.registeredAt;
        if (this.isNotFinishedRegistration) {
            this.user = user;
        }

        this.formGroup = new FormGroup({
            firstName: new FormControl(
                { value: '', disabled: this.isNotFinishedRegistration },
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(30),
                    Validators.pattern(regexs.firstName)
                ]
            ),
            lastName: new FormControl(
                { value: '', disabled: this.isNotFinishedRegistration },
                [
                    Validators.minLength(2),
                    Validators.maxLength(30),
                    Validators.pattern(regexs.lastName)
                ]
            ),
            email: new FormControl(
                { value: '', disabled: this.isNotFinishedRegistration },
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.pattern(regexs.email)
                ]
            ),
            password: new FormControl(
                { value: '', disabled: this.isNotFinishedRegistration },
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(30),
                    Validators.pattern(regexs.password)
                ]
            ),
            confirmPassword: new FormControl(
                { value: '', disabled: this.isNotFinishedRegistration },
                [
                    Validators.required,
                    this.equals
                ]
            ),
            organizationName: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(50),
                    Validators.pattern(regexs.organizationName),
                ]
            ),
            organizationSlug: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(50),
                    Validators.pattern(regexs.organizationSlag),
                ]
            )
        });
    }

    equals = (control: AbstractControl) => {
        if (control.value !== this.password) {
            return { notEqual: true };
        }
        return null;
    };

    onSubmit() {
        const organizationDto: RegOrganizationDto = {
            organizationSlug: this.organizationSlug,
            name: this.organization.name,
            openMembership: true, //TEMP
            defaultRoleId: 1, //TEMP
            avatarUrl: null //TEMP
        } as RegOrganizationDto;

        if (!this.isNotFinishedRegistration) {
            const userDto = {
                ...this.user,
            } as NewUserDto;

            this.authService.signOnWithEmailAndPassword({ organization: organizationDto, user: userDto }, this.password, ['home'])
                .subscribe(() => { },
                    error => {
                        this.toastService.error(`${error}`, 'Error');
                    });
        } else {
            this.authService.finishPartialRegistration({ organization: organizationDto, userId: this.user.id }, ['home'])
                .subscribe(() => { },
                    error => {
                        this.toastService.error(`${error}`, 'Error');
                    });
        }
    }
}
