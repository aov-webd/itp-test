import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuthService } from '../user-auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    isAuthSubscription: Subscription
    isAuth = false
    constructor(private userAuthService: UserAuthService) {
    }

    ngOnInit(): void {
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })
    }

}
