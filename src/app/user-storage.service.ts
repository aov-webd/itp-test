import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from './types';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private usersSubject = new BehaviorSubject<UserInfo[]>([]);

    constructor() {
    }
}
