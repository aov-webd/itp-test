import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResult } from '../types';
import { UserAuthService } from '../user-auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    routeSubscription: Subscription;
    isLogin = false
    loginValid = true
    registerValid = true
    username = ''
    password = ''
    result: AuthResult
    errMessage: string = ''
    isAuth = false
    isAuthSubscription: Subscription

    constructor(
        private route: ActivatedRoute,
        private userAuthService: UserAuthService
    ) {
        this.routeSubscription = route.params.subscribe(() => {
            this.isLogin = this.route.snapshot.params['param'] === 'login';
            console.log(this.isLogin)
        });
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })

    }

    ngOnInit(): void {
    }
    onSubmit() {
        if (!this.isLogin) {
            this.userAuthService.registration('a', this.username, this.password).then((result: AuthResult) => {
                this.registerValid = !result.error
                this.errMessage = result.message
                if (this.registerValid) {
                    window.alert('Registered Successfully')
                }
            })
        } else {
            this.userAuthService.login(this.username, this.password).then((result: AuthResult) => {
                this.loginValid = !result.error
                this.errMessage = result.message

            })
        }
        console.log(this.username, this.password, this.result)
    }

    setIsLogin(value: boolean) {
        this.isLogin = value
    }

}
