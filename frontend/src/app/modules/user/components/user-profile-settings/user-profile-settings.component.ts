import { AuthenticationService } from '@core/services/authentication.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { User } from '@shared/models/user/user';
import { ToastNotificationService } from '@core/services/toast-notification.service';
import { UserService } from '@core/services/user.service';
import { changeEmailValidator } from '@shared/validators/change-email-validator.validator';
import { regexs } from '@shared/constants/regexs';
import { FileUpload } from 'primeng/fileupload';
import { CroppedEvent } from 'ngx-photo-editor';
import { AvatarDto } from '@shared/models/avatar/avatarDto';

@Component({
    selector: 'app-user-profile-settings',
    templateUrl: './user-profile-settings.component.html',
    styleUrls: ['../user-profile/user-profile.component.sass']
})
export class UserProfileSettingsComponent extends BaseComponent implements OnInit {
    @Input() user: User;
    @Input() editForm: FormGroup;
    @ViewChild(FileUpload) fileUpload: FileUpload;
    imageChangedEvent: { target: { files: File[] } };
    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private toastNotificationService: ToastNotificationService
    ) {
        super();
    }

    ngOnInit(): void {
        this.editForm.addControl('firstName', new FormControl(this.user.firstName, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern(regexs.firstName),
        ]));
        this.editForm.addControl('lastName', new FormControl(this.user.lastName, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern(regexs.lastName),
        ]));
        this.editForm.addControl('email', new FormControl(this.user.email, {
            validators: [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(regexs.email),
            ],
            asyncValidators: [
                changeEmailValidator(this.user, this.userService)
            ]
        }));
        this.editForm.addControl('avatarUrl', new FormControl(this.user.avatarUrl));
    }

    get firstName() { return this.editForm.controls.firstName; }

    get lastName() { return this.editForm.controls.lastName; }

    get email() { return this.editForm.controls.email; }

    get avatarUrl() { return this.editForm.controls.avatarUrl; }

    onError(e) {
        this.toastNotificationService.error(e.error);
        this.fileUpload.clear();
    }

    upload(e: { files: File[] }) {
        this.imageChangedEvent = { target: { files: e.files } };
        this.fileUpload.clear();
    }

    imageCropped(event: CroppedEvent) {
        const avatar: AvatarDto = { id: this.authService.getUserId(), base64: event.base64 };
        this.user.avatarUrl = event.base64;
        const user = this.authService.getUser();
        this.authService.setUser({ ...user, avatarUrl: event.base64 }); // DELETE this line after fixing local storage
        this.userService.updateAvatar(avatar)
            .subscribe(() => { },
                error => {
                    this.toastNotificationService.error(error);
                });
    }
}
