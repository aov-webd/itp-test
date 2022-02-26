import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    islogin = false
    loginValid = true
    username = ''
    password = ''
    constructor(
        private route: ActivatedRoute
    ) {
        this.islogin = this.route.snapshot.params['param'] === 'login';
    }

    ngOnInit(): void {
    }
    onSubmit() { }
}
