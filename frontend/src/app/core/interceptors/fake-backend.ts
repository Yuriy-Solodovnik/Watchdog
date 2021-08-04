import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '@core/models/user';
import { AuthUser } from '@core/models/auth/auth-user';

const users: User[] = [{ id: 1, email: 'test@test', password: 'test', firstName: 'first', lastName: 'last', avatar: 'link' }];

@Injectable({
    providedIn: 'root'
})
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, body } = request;

        function authenticate(): Observable<HttpResponse<AuthUser>> | Observable<HttpResponse<string>> {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) {
                return of(new HttpResponse({
                    status: 404, body: 'Email or password is incorrect'
                }));
            }

            return of(new HttpResponse({
                status: 200,
                body: {
                    user: {
                        id: user.id,
                        password: user.password,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar
                    },
                    token: 'fake-token'
                }
            }));
        }

        function checkRegister(): Observable<HttpResponse<AuthUser>> | Observable<HttpResponse<string>> {
            const { email } = body;
            const user = users.find(x => x.email === email);
            if (!user) {
                return of(new HttpResponse({
                    status: 404, body: 'This email is already assigned to the user'
                }));
            }

            return of(new HttpResponse({
                status: 200,
                body: {
                    user: {
                        id: user.id,
                        password: user.password,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        avatar: user.avatar
                    },
                    token: 'fake-token'
                }
            }));
        }

        function updateUser(): Observable<HttpResponse<User>> | Observable<HttpResponse<string>> {
            const user: User = body;
            const userToUpdate = users.find(x => x.id === user.id);
            if (!userToUpdate) {
                return of(new HttpResponse<string>({
                    status: 404, body: 'This user is not exist'
                }));
            }

            return of(new HttpResponse<User>({
                status: 200,
                body: {
                    id: user.id,
                    password: user.password,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }));
        }

        function handleRoute() {
            switch (true) {
                case url.endsWith('/user/login') && method === 'POST':
                    return authenticate();
                case url.endsWith('user/register') && method === 'POST':
                    return checkRegister();
                case url.endsWith('user') && method === 'PUT':
                    return updateUser();
                default:
                    return next.handle(request);
            }
        }
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
