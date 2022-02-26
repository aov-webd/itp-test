import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from './types';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private usersSubject = new BehaviorSubject<UserInfo[]>([]);
    users = this.usersSubject.asObservable()

    constructor() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify({}))
        }
        this.refreshUsers()
    }

    addUser(user: UserInfo) {
        let tmpUsers = JSON.parse(localStorage.getItem('users'))
        console.log(tmpUsers)
        if (!tmpUsers) tmpUsers = {}
        tmpUsers[user.username] = { "role": user.role, "salary": user.salary }
        // console.log(JSON.stringify(tmpUsers))
        localStorage.setItem('users', JSON.stringify(tmpUsers))
        this.refreshUsers()
    }

    removeUser(username: string) {
        let tmpUsers = JSON.parse(localStorage.getItem('users'))
        delete tmpUsers[username]
        console.log('remove', username)
        localStorage.setItem('users', JSON.stringify(tmpUsers))
        this.refreshUsers()
    }

    refreshUsers() {
        this.usersSubject.next(JSON.parse(localStorage.getItem('users')))
    }
}
