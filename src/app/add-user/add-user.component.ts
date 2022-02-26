import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from '../types';
import { UserStorageService } from '../user-storage.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
    userInfo: UserInfo = {
        username: '',
        role: '',
        salary: 0
    }

    userInfoPrev: UserInfo = {
        username: '',
        role: '',
        salary: 0
    }

    constructor(
        private userStorageService: UserStorageService,
        private dialogRef: MatDialogRef<AddUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { userInfo: UserInfo }
    ) {
        this.userInfo = data.userInfo
        this.userInfoPrev = { ...data.userInfo }
    }

    ngOnInit(): void {
    }
    submit() {
        if (
            !this.userInfo.username ||
            !this.userInfo.role ||
            !this.userInfo.salary
        ) {
            alert('Fill all fields')
            return
        }
        this.userStorageService.removeUser(this.userInfoPrev.username)
        this.userStorageService.addUser(this.userInfo)
    }
}
