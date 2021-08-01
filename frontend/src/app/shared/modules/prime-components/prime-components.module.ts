import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ChipModule } from 'primeng/chip';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple'
import {DropdownModule} from 'primeng/dropdown';

// import and export here all required modules from primeng
@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        PanelMenuModule,
        SidebarModule,
        ToastModule,
        ScrollTopModule,
        ChipModule,
        DialogModule,
        MessagesModule,
        MessageModule,
        PanelModule,
        RippleModule,
        DropdownModule
    ],
    exports: [
        ButtonModule,
        InputTextModule,
        PanelMenuModule,
        SidebarModule,
        DialogModule,
        ToastModule,
        ScrollTopModule,
        ChipModule,
        MessagesModule,
        MessageModule,
        PanelModule,
        RippleModule,
        DropdownModule
    ],
    declarations: [],
    providers: [
        MessageService,
        PrimeNGConfig
    ]
})
export class PrimeComponentsModule {
    constructor(private primengConfig: PrimeNGConfig) {
        this.primengConfig.ripple = true;
    }
}
