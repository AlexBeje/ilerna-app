import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Album {
  userId: string;
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/albums';

  constructor(private http: HttpClient) { }

  getAlbums(id: string | undefined): Observable<Album[] | undefined> {
    return this.http.get<Album[]>(this.apiUrl).pipe(
      map(albums => albums.filter(album => album.userId.toString() === id))
    );
  }
}