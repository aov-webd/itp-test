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

    users: Observable<any>;
    usersData: UserInfo[]

    constructor(
        private userAuthService: UserAuthService,
        private matDialog: MatDialog,
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore
    ) {
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
                this.users = this.firestore.collection('users').valueChanges((data: UserInfo[]) => {
                    this.usersData = data
                    console.log(this.usersData)
                });
            }
        });
    }

    onAdd() {
    }
    onEdit(userInfo) {
        console.log(userInfo)
        this.matDialog.open(EditFormComponent, { data: { userInfo } })
    }
    onRemove(user) {
    }
}
