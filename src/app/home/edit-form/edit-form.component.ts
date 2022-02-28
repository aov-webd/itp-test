import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/types';

@Component({
    selector: 'app-edit-form',
    templateUrl: './edit-form.component.html',
    styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {
    form: FormGroup;
    newEntry: boolean
    constructor(
        private firestore: AngularFirestore,
        @Inject(MAT_DIALOG_DATA) public data: { userInfo: UserInfo, newEntry: boolean },
        private dialogRef: MatDialogRef<EditFormComponent>
    ) {
        console.log(data.userInfo)
        this.newEntry = data.newEntry
        this.form = new FormGroup({
            'accountType': new FormControl(data.userInfo.accountType, [Validators.required]),
            'displayName': new FormControl(data.userInfo.displayName, [Validators.required]),
            'displayName_lower': new FormControl(data.userInfo.displayName_lower, [Validators.required]),
            'email': new FormControl(data.userInfo.email, [Validators.required, Validators.email]),
            'email_lower': new FormControl(data.userInfo.email_lower, [Validators.required, Validators.email]),
        });
        if (!this.newEntry) {
            this.form.controls['email_lower'].disable()
        }
    }
    submit() {
        console.log(this.form.value.email_lower)
        if (this.newEntry) {
            this.firestore.collection('users').doc(this.form.value.email_lower).set(this.form.value)
        } else {
            this.firestore.collection('users').doc(this.form.value.email_lower).update(this.form.value)
        }
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }

}
