import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from '../types';
import { UserStorageService } from '../user-storage.service';

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

    constructor(
        private userStorageService: UserStorageService,
        private dialogRef: MatDialogRef<AddUserComponent>
    ) { }

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
        this.userStorageService.addUser(this.userInfo)
        this.dialogRef.close();
    }
}
