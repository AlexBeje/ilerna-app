import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) { }

  getTodos(userId: string | undefined): Observable<Todo[] | undefined> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      map(todos => todos.filter(todo => todo.userId.toString() === userId))
    );
  }
}