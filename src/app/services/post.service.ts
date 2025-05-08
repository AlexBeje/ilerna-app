import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  getPosts(userId: string | undefined): Observable<Post[] | undefined> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      map(posts => posts.filter(post => post.userId.toString() === userId))
    );
  }
}