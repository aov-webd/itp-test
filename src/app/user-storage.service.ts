import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from './types';
// import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private usersSubject = new BehaviorSubject<UserInfo[]>([]);
    users: Observable<UserInfo[]>

    constructor(
        private firestore: AngularFirestore
    ) {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify({}))
        }
        this.refreshUsers()
        // const usersCollection = collection(firestore, 'users');
        // this.users = collectionData(usersCollection);
    }

    addUser(user: UserInfo) {
        let tmpUsers = JSON.parse(localStorage.getItem('users'))
        console.log(tmpUsers)
        if (!tmpUsers) tmpUsers = {}
        tmpUsers[user.username] = { "role": user.role, "salary": user.salary }
        // console.log(JSON.stringify(tmpUsers))
        // localStorage.setItem('users', JSON.stringify(tmpUsers))
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
