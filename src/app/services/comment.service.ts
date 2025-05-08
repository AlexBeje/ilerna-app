import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/comments';

    constructor(private http: HttpClient) { }

    getComments(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(this.apiUrl).pipe(
            map(comments => comments.filter(comment => comment.postId === postId))
        );
    }
}