import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthResult } from '../types';
import { UserAuthService } from '../user-auth.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, provideAuth } from '@angular/fire/auth';



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
    firebaseErrorMessage: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userAuthService: UserAuthService,
        // private afAuth: AngularFireAuth
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
        if (this.userAuthService.userLoggedIn) {                       // if the user's logged in, navigate them to the dashboard (NOTE: don't use afAuth.currentUser -- it's never null)
            this.router.navigate(['/dashboard']);
        }

        this.signupForm = new FormGroup({
            'displayName': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            'password': new FormControl('', Validators.required)
        });

    }

    signup() {
        if (this.signupForm.invalid)                            // if there's an error in the form, don't submit it
            return;

        this.isProgressVisible = true;
        this.userAuthService.signupUser(this.signupForm.value).then((result) => {
            if (result == null)                                 // null is success, false means there was an error
                this.router.navigate(['/dashboard']);
            else if (result.isValid == false)
                this.firebaseErrorMessage = result.message;

            this.isProgressVisible = false;                     // no matter what, when the auth service returns, we hide the progress indicator
        }).catch(() => {
            this.isProgressVisible = false;
        });
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
