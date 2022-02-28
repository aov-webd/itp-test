import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResult } from '../types';
import { UserAuthService } from '../user-auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
    routeSubscription: Subscription;
    isLogin = false
    isAuth = false
    isAuthSubscription: Subscription

    isProgressVisible: boolean;
    signupForm: FormGroup;
    loginForm: FormGroup;
    firebaseErrorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userAuthService: UserAuthService,
    ) {
        this.routeSubscription = route.params.subscribe(() => {
            this.isLogin = this.route.snapshot.params['param'] === 'login';
        });
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
                if (data) {
                    this.router.navigate(['']);
                }
            }
        })
    }

    ngOnInit(): void {
        this.signupForm = new FormGroup({
            'displayName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });

        this.loginForm = new FormGroup({
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });

        this.firebaseErrorMessage = '';
    }

    signup() {
        this.isProgressVisible = true;

        if (this.signupForm.invalid)
            return;

        this.userAuthService.signupUser(this.signupForm.value).then((result) => {
            if (result == null)
                this.router.navigate(['']);
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;

            this.isProgressVisible = false;
        }).catch(() => {
            this.isProgressVisible = false;
        });
    }

    loginUser() {
        this.isProgressVisible = true;

        if (this.loginForm.invalid)
            return;

        this.userAuthService.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((result) => {
            this.isProgressVisible = false;
            if (result == null) {
                console.log('logging in...');
                this.router.navigate(['']);
            }
            else if (result.isValid == false) {
                console.log('login error', result);
                this.firebaseErrorMessage = result.message;
            }
        });
    }

    setIsLogin(value: boolean) {
        this.isLogin = value
    }

    ngOnDestroy(): void {
        this.routeSubscription.unsubscribe()
    }
}
