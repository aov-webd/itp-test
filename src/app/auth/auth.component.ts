import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResult } from '../types';
import { UserAuthService } from '../user-auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

    isProgressVisible: boolean;
    signupForm: FormGroup;
    loginForm: FormGroup;
    firebaseErrorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userAuthService: UserAuthService,
        // private afAuth: AngularFireAuth
    ) {
        this.routeSubscription = route.params.subscribe(() => {
            this.isLogin = this.route.snapshot.params['param'] === 'login';
        });
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })
    }

    ngOnInit(): void {
        if (this.userAuthService.userLoggedIn) {
            this.router.navigate(['']);
        }

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
        if (this.signupForm.invalid)
            return;

        this.isProgressVisible = true;
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
}
