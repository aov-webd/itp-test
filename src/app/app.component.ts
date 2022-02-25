import { Component, OnInit } from '@angular/core';
import { UserAuthService } from './user-auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'itp-test';

    constructor(private userAuthService: UserAuthService) { }

    ngOnInit(): void {
        this.userAuthService.registration('asdf', 'asdf', 'asdf')
        this.userAuthService.login('asdf', 'asdf')
    }
}
