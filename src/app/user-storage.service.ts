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
            localStorage.setItem('users', JSON.stringify([]))
        }
        this.refreshUsers()
    }

    addUser(user: UserInfo) {
        try {
            let tmpUsers = JSON.parse(localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([...tmpUsers, user]))
        } catch (e) {
            localStorage.setItem('users', JSON.stringify([user]))
            console.log(e.message)
        } finally {
            this.refreshUsers()
        }
    }

    refreshUsers() {
        this.usersSubject.next(JSON.parse(localStorage.getItem('users')))
    }
}
