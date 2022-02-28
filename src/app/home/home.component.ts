import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from '../types';
import { UserAuthService } from '../user-auth.service';
import { EditFormComponent } from './edit-form/edit-form.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    isAuthSubscription: Subscription
    isAuth = false

    usersSubscription: Subscription

    users: Observable<UserInfo[]>;
    usersData: UserInfo[]
    searchText: string
    constructor(
        private userAuthService: UserAuthService,
        private matDialog: MatDialog,
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore
    ) {
        this.users = null;
        this.searchText = ''
    }

    ngOnInit(): void {
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.firestore.collection<UserInfo>('users').valueChanges().subscribe({
                    next: (data) => {
                        this.usersData = data
                    }
                });
            }
        });
    }

    onAdd() {
        this.matDialog.open(EditFormComponent, {
            data: {
                userInfo: {
                    accountType: '',
                    displayName: '',
                    displayName_lower: '',
                    email: '',
                    email_lower: ''
                },
                newEntry: true
            }
        })
    }
    onEdit(userInfo: UserInfo) {
        this.matDialog.open(EditFormComponent, { data: { userInfo } })
    }
    onRemove(user: UserInfo) {
        this.firestore.collection('users').doc(user.email_lower).delete()
    }
}
