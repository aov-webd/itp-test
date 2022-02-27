import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AddUserComponent } from '../add-user/add-user.component';
import { UserInfo } from '../types';
import { UserAuthService } from '../user-auth.service';
import { UserStorageService } from '../user-storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isAuthSubscription: Subscription
    isAuth = false

    usersSubscription: Subscription

    users: Observable<any>;
    user: Observable<any>;

    constructor(
        private userAuthService: UserAuthService,
        private userStorageService: UserStorageService,
        private matDialog: MatDialog,
        private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = null;
        this.users = null;
    }

    ngOnInit(): void {
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })
        this.afAuth.authState.subscribe(user => {
            if (user) {
                let emailLower = user.email.toLowerCase();
                this.users = this.firestore.collection('users').valueChanges();
                this.user = this.firestore.collection('users').doc(emailLower).valueChanges();
            }
        });

        // this.usersSubscription = this.userStorageService.users.subscribe({
        //     next: (data) => {
        //         this.users = data
        //     }
        // })
    }

    addUser() {
        this.matDialog.open(AddUserComponent, {
            data: {
                userInfo: {
                    'username': '',
                    'role': '',
                    'salary': null,
                }
            }
        })
    }

    editUser(userInfo: UserInfo) {
        this.matDialog.open(AddUserComponent, {
            data: { userInfo: userInfo }
        })
    }
    removeUser(username: string) {
        this.userStorageService.removeUser(username)
    }
}
