import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode"
import { BehaviorSubject } from 'rxjs';
import { AuthResult } from './types';
import { UserStorageService } from './user-storage.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    $host: AxiosInstance
    $authHost: AxiosInstance

    private authorizedSubject = new BehaviorSubject<boolean>(false)
    authorized = this.authorizedSubject.asObservable()

    userLoggedIn: boolean

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore
    ) {
        this.userLoggedIn = false
        this.afAuth.onAuthStateChanged((user) => {
            if (user) {
                this.userLoggedIn = true
            } else {
                this.userLoggedIn = false
            }
        })

        this.$host = axios.create({
            baseURL: environment.authUrl
        })
        this.$authHost = axios.create({
            baseURL: environment.authUrl
        })
        const authInterceptor = (config) => {
            config.headers.authorization = `${localStorage.getItem('token')}`
            return config
        }
        this.$authHost.interceptors.request.use(authInterceptor)
    }

    async loginUser(email: string, password: string): Promise<any> {
        try {
            await this.afAuth.signInWithEmailAndPassword(email, password);
            console.log('Auth Service: loginUser: success');
        } catch (error) {
            console.log('Auth Service: login error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return { isValid: false, message: error.message };
        }
    }

    async signupUser(user: any): Promise<any> {
        try {
            const result = await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
            let emailLower = user.email.toLowerCase();

            this.afs.doc('/users/' + emailLower) // on a successful signup, create a document in 'users' collection with the new user's info
                .set({
                    accountType: 'endUser',
                    displayName: user.displayName,
                    displayName_lower: user.displayName.toLowerCase(),
                    email: user.email,
                    email_lower: emailLower
                });
            result.user.sendEmailVerification(); // immediately send the user a verification email
        } catch (error) {
            console.log('Auth Service: signup error', error);
            if (error.code)
                return { isValid: false, message: error.message };
        }
    }

    async resetPassword(email: string): Promise<any> {
        try {
            await this.afAuth.sendPasswordResetEmail(email);
            console.log('Auth Service: reset password success');
        } catch (error) {
            console.log('Auth Service: reset password error...');
            console.log(error.code);
            console.log(error);
            if (error.code)
                return error;
        }
    }

    async resendVerificationEmail() {                         // verification email is sent in the Sign Up function, but if you need to resend, call this function
        return (await this.afAuth.currentUser).sendEmailVerification()
            .then(() => {
                // this.router.navigate(['home']);
            })
            .catch(error => {
                console.log('Auth Service: sendVerificationEmail error...');
                console.log('error code', error.code);
                console.log('error', error);
                if (error.code)
                    return error;
            });
    }

    async logoutUser(): Promise<void> {
        try {
            await this.afAuth.signOut();
            this.router.navigate(['/home']); // when we log the user out, navigate them to home
        } catch (error) {
            console.log('Auth Service: logout error...');
            console.log('error code', error.code);
            console.log('error', error);
            if (error.code)
                return error;
        }
    }

    setUserInfo(payload: object) {
        console.log('Auth Service: saving user info...');
        this.afs.collection('users')
            .add(payload).then(function (res) {
                console.log("Auth Service: setUserInfo response...")
                console.log(res);
            })
    }

    getCurrentUser() {
        return this.afAuth.currentUser;                                 // returns user object for logged-in users, otherwise returns null
    }

    async registration(name: string, email: string, password: string): Promise<AuthResult> {
        try {
            const { data } = await this.$host.post('api/v1/users', { name, email, password })
            return { error: false, message: '', token: '' }
        } catch (e) {
            return { error: true, message: e.message, token: '' }
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        try {
            const { data } = await this.$host.post('api/v1/auth', { email, password })
            localStorage.setItem('token', data.token)
            this.authorizedSubject.next(true)
            return { error: false, message: '', token: jwt_decode(data.token) }
        } catch (e) {
            return { error: true, message: e.message, token: '' }
        }
    }

    logout() {
        localStorage.removeItem('token')
        this.authorizedSubject.next(false)
    }

    async check() {
        await this.$authHost.get('api/v1/users')
            .catch(e => console.log(e))
        // localStorage.setItem('token', data.token)
        // return jwt_decode(data.token)
    }

    setAuthorized(value: boolean) {
        this.authorizedSubject.next(value)
    }
}
