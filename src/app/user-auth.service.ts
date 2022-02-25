import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode"


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {
    $host: AxiosInstance
    $authHost: AxiosInstance

    constructor() {
        this.$host = axios.create({
            baseURL: environment.authUrl
        })
        this.$authHost = axios.create({
            baseURL: environment.authUrl
        })
        const authInterceptor = (config) => {
            config.headers.authorization = `bearer ${localStorage.getItem('token')}`
            return config
        }
        this.$authHost.interceptors.request.use(authInterceptor)
    }

    async registration(name, email, password) {
        try {
            const { data } = await this.$host.post('api/v1/users', { email, password })
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)

        } catch (e) {
            console.log(e)

        }
    }

    async login(email, password) {
        try {
            const { data } = await this.$host.post('api/v1/auth', { email, password })
            localStorage.setItem('token', data.token)
            return jwt_decode(data.token)
        } catch (e) {
            console.log(e)
        }
    }
}
