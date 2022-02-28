import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    private authorizedSubject = new BehaviorSubject<boolean>(false)
    authorized = this.authorizedSubject.asObservable()

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
    ) {
        this.afAuth.onAuthStateChanged((user) => {
            if (user) {
                this.authorizedSubject.next(true)
            } else {
                this.authorizedSubject.next(false)
            }
        })
    }

    async loginUser(email: string, password: string): Promise<any> {
        try {
            await this.afAuth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.log('error code', error.code);
            if (error.code)
                return { isValid: false, message: error.message };
        }
    }

    async signupUser(user: any): Promise<any> {
        try {
            await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
        } catch (e) {
            console.log(e.message)
        }
    }

    async logoutUser(): Promise<void> {
        try {
            await this.afAuth.signOut();
            this.router.navigate(['']);
        } catch (error) {
            console.log('error code', error.code);
            if (error.code)
                return error;
        }
    }
}
