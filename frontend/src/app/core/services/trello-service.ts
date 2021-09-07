import { TrelloCard } from '@shared/models/trello/trello-card';
import { TrelloList } from '@shared/models/trello/trello-list';
import { AuthenticationService } from '@core/services/authentication.service';
import { TrelloMember } from '@shared/models/trello/trello-member';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrelloBoard } from '@shared/models/trello/trello-board';
import { Observable, of, Subject } from 'rxjs';
import { authorizeIntegration } from './dialogs/auth-trello.dialog';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TrelloService {
    private trelloTokenFromAuthorize: Subject<string | null> = new Subject<string | null>();
    private trelloToken: string;
    private apiKey = '54419603da6616388f1256beedc53731';
    private apiUrl = 'https://api.trello.com/1';

    constructor(private httpClient: HttpClient, private authService: AuthenticationService) {
        this.getToken().subscribe(t => this.setTrelloToken(t));
        this.trelloTokenFromAuthorize.subscribe(t => {
            this.setTrelloToken(t);
        });
    }

    clearToken() {
        this.trelloToken = '';
    }

    getBoardsByCurrentIntegration() {
        return this.getToken().pipe(
            switchMap(()=> this.httpClient.get<TrelloBoard[]>(
                `${this.apiUrl}/members/me/boards`, { params: this.getParams() }
            ))
        );
    }

    searchMembers(query: string) {
        if (!query) return of(null);
        return this.httpClient.get<TrelloMember[]>(`${this.apiUrl}/search/members/?query=${query}`);
    }

    addMemberToCurrentBoard(memberId: string) {
        return this.authService.getOrganization()
            .pipe(switchMap(org => this.httpClient.put(
                `${this.apiUrl}/boards/${org.trelloBoard}/members/${memberId}`,
                { params: this.getParams() }
            )));
    }

    addMembersWithIssueToBoardTodo(name: string, desc: string, memberId: string) {
        return this.addCardIssuesToTodo(name, desc)
            .pipe(switchMap(card => this.assigneeMemberToCard(memberId, card.id)));
    }

    getMember(id: string) {
        return this.httpClient.get<TrelloMember>(`${this.apiUrl}/members/${id}`);
    }

    getToken(): Observable<string | null> {
        if (!this.trelloToken) {
            return this.authService.getOrganization().pipe(
                switchMap(organization => {
                    if (!organization.trelloToken) {
                        this.authorizeTrello();
                        return this.trelloTokenFromAuthorize.asObservable();
                    }
                    this.setTrelloToken(organization.trelloToken);
                    return of(this.trelloToken);
                })
            );
        }
        return of(this.trelloToken);
    }

    private assigneeMemberToCard(memberId: string, cardId: string) {
        return this.httpClient.post(
            `${this.apiUrl}/cards/${cardId}/idMembers`,
            null,
            { params: this.getParams().set('value', memberId) }
        );
    }

    private addCardIssuesToTodo(name: string, desc: string) {
        return this.getBoardLists().pipe(
            switchMap(lists => of(lists[0].id))
        ).pipe(switchMap(listId => this.addCardIssues(name, desc, listId)));
    }

    private addCardIssues(name: string, desc: string, listId: string): Observable<TrelloCard> {
        return this.httpClient.post<TrelloCard>(
            `${this.apiUrl}/cards`,
            null,
            {
                params: this.getParams().set('name', name)
                    .set('idList', listId).set('desc', desc)
            }
        );
    }



    private getBoardLists() {
        return this.authService.getOrganization()
            .pipe(switchMap(org => this.httpClient.get<TrelloList[]>(
                `${this.apiUrl}/boards/${org.trelloBoard}/lists`,
                { params: this.getParams() }
            )));
    }

    private getListsCards(listId: string) {
        return this.httpClient.get<TrelloCard[]>(
            `${this.apiUrl}/lists/${listId}/cards`,
            { params: this.getParams() }
        );
    }

    private getParams() {
        const params = new HttpParams();
        return params.set('key', this.apiKey)
            .set('token', this.trelloToken);
    }

    private setTrelloToken(token: string) {
        this.trelloToken = token;
    }

    private authorizeTrello() {
        authorizeIntegration(this.apiKey, token => {
            this.trelloTokenFromAuthorize.next(token);
        });
    }
}
