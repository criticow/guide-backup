import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './ui/sidenav/sidenav.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { provideNgxMask } from 'ngx-mask';
import { LoaderComponent } from "./ui/loader/loader.component";
registerLocaleData(localePt, 'pt');

@Component({
    selector: 'app-root',
    standalone: true,
    providers: [
        { provide: LOCALE_ID, useValue: 'pt' },
        provideNgxMask()
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, SidenavComponent, LoaderComponent]
})
export class AppComponent {
  title = 'web';
}
