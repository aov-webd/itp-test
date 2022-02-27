import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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
    users: UserInfo[]

    constructor(
        private userAuthService: UserAuthService,
        private userStorageService: UserStorageService,
        private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.isAuthSubscription = this.userAuthService.authorized.subscribe({
            next: (data) => {
                this.isAuth = data
            }
        })

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
