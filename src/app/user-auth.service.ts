import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode"
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    $host: AxiosInstance
    $authHost: AxiosInstance

    private authorizedSubject = new BehaviorSubject<boolean>(false)
    authorized = this.authorizedSubject.asObservable()

    constructor() {
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

    async registration(name: string, email: string, password: string) {
        try {
            const { data } = await this.$host.post('api/v1/users', { email, password })
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)
        } catch (e) {
            console.log(e)
        }
    }

    async login(email: string, password: string) {
        try {
            const { data } = await this.$host.post('api/v1/auth', { email, password })
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)
        } catch (e) {
            console.log(e)
        }
    }

    async logout() {
        localStorage.removeItem('token')
        this.authorizedSubject.next(false)
    }

    async check() {
        try {
            await this.$authHost.get('api/v1/users')
                .catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }
        // localStorage.setItem('token', data.token)
        // return jwt_decode(data.token)
    }
}
