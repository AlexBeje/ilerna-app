import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/photos';

    constructor(private http: HttpClient) { }

    getPhotos(albumId: number): Observable<Photo[]> {
        return this.http.get<Photo[]>(this.apiUrl).pipe(
            map(photos =>
                photos
                    .filter(photo => photo.albumId === albumId)
                    .map(photo => ({
                        ...photo,
                        url: photo.url.replace('https://via.placeholder.com', 'https://dummyimage.com'),
                        thumbnailUrl: photo.thumbnailUrl.replace('https://via.placeholder.com', 'https://dummyimage.com')
                    }))
            )
        );
    }
}