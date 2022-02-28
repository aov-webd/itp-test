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
        this.newEntry = data.newEntry
        this.form = new FormGroup({
            'email': new FormControl(data.userInfo.email, [Validators.required, Validators.email]),
            'accountType': new FormControl(data.userInfo.accountType, [Validators.required]),
            'displayName': new FormControl(data.userInfo.displayName, [Validators.required]),
        });
        if (!this.newEntry) {
            this.form.controls['email'].disable()
        }
    }
    submit() {
        this.form.controls['email'].enable()

        if (this.newEntry) {
            try {
                this.firestore.collection('users').doc(this.form.value.email).set(this.form.value)
            } catch (e) {
                console.log(e.message)
            }
        } else {
            this.firestore.collection('users').doc(this.form.value.email).update(this.form.value)
        }
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }
}
