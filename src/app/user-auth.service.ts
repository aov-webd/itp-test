import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode"
import { BehaviorSubject } from 'rxjs';
import { AuthResult } from './types';
import { UserStorageService } from './user-storage.service';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    $host: AxiosInstance
    $authHost: AxiosInstance

    private authorizedSubject = new BehaviorSubject<boolean>(false)
    authorized = this.authorizedSubject.asObservable()

    constructor(private userStorage: UserStorageService) {
        this.$host = axios.create({
            baseURL: environment.authUrl
        })
        this.$authHost = axios.create({
            baseURL: environment.authUrl
        })
        const authInterceptor = (config) => {
            config.headers.authorization = `${localStorage.getItem('token')}`
            return config
        }
        this.$authHost.interceptors.request.use(authInterceptor)
    }

    async registration(name: string, email: string, password: string): Promise<AuthResult> {
        try {
            const { data } = await this.$host.post('api/v1/users', { name, email, password })
            return { error: false, message: '', token: '' }
        } catch (e) {
            return { error: true, message: e.message, token: '' }
        }
    }

    async login(email: string, password: string): Promise<AuthResult> {
        try {
            const { data } = await this.$host.post('api/v1/auth', { email, password })
            localStorage.setItem('token', data.token)
            this.authorizedSubject.next(true)
            return { error: false, message: '', token: jwt_decode(data.token) }
        } catch (e) {
            return { error: true, message: e.message, token: '' }
        }
    }

    logout() {
        localStorage.removeItem('token')
        this.authorizedSubject.next(false)
    }

    async check() {
        await this.$authHost.get('api/v1/users')
            .catch(e => console.log(e))
        // localStorage.setItem('token', data.token)
        // return jwt_decode(data.token)
    }

    setAuthorized(value: boolean) {
        this.authorizedSubject.next(value)
    }
}
