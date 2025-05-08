import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '@/services/user.service';
import { PostService, Post } from '@/services/post.service';
import { AlbumService, Album } from '@/services/album.service';
import { signal } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold">{{user()?.name}}</h1>
      <div class="flex space-x-4 border-b">
        <button 
          class="px-4 py-2"
          [class.border-b-2]="activeTab() === 'posts'"
          [class.border-blue-500]="activeTab() === 'posts'"
          [class.text-blue-600]="activeTab() === 'posts'"
          (click)="activeTab.set('posts')">
          Posts
        </button>
        <button 
          class="px-4 py-2"
          [class.border-b-2]="activeTab() === 'albums'"
          [class.border-blue-500]="activeTab() === 'albums'"
          [class.text-blue-600]="activeTab() === 'albums'"
          (click)="activeTab.set('albums')">
          Albums
        </button>
        <button 
          class="px-4 py-2"
          [class.border-b-2]="activeTab() === 'todos'"
          [class.border-blue-500]="activeTab() === 'todos'"
          [class.text-blue-600]="activeTab() === 'todos'"
          (click)="activeTab.set('todos')">
          ToDo's
        </button>
      </div>
      
      <div class="tab-content mb-6">
        <div *ngIf="activeTab() === 'posts'" class="flex flex-col gap-2">
          <div *ngFor="let post of posts(); let i = index" class="bg-white rounded-2xl shadow-md overflow-hidden p-6 flex flex-col gap-2">
            <h2 class="text-xl font-semibold text-gray-800">{{getCapitalized(post.title)}}</h2>
            <h3 class="text-lg text-gray-600">{{getCapitalized(post.body)}}</h3>
            <hr />
            <h3 class="text-lg text-gray-800 font-semibold">Comments</h3>
          </div>
        </div>
        <div *ngIf="activeTab() === 'albums'">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div
              *ngFor="let album of albums(); let j = index"
              class=" bg-white shadow overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition duration-100 ease-in-out"
            >
              <div class="flex-1 bg-gray-200  border-white">
                <img
                  src="https://dummyimage.com/300"
                  alt="Album photo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-3 bg-white text-center border-t border-gray-200">
                <div class="text-sm font-semibold text-gray-800">
                  {{ album.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="activeTab() === 'todos'">
          <p>List of todos...</p>
        </div>
      </div>
    </div>
  `,
})
export class UserComponent implements OnInit {
  user = signal<User | undefined>(undefined);
  posts = signal<Post[] | undefined>([]);
  albums = signal<Album[] | undefined>([]);
  activeTab = signal<string>('posts');

  constructor(
    private userService: UserService,
    private postService: PostService,
    private albumService: AlbumService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          return this.userService.getUser(id);
        })
      )
      .subscribe({
        next: (data) => {
          this.user.set(data);

          this.postService.getPosts(data?.id.toString()).subscribe({
            next: (data) => {
              this.posts.set(data);
            },
            error: (error) => {
              console.error('Error fetching posts:', error);
            },
          });

          this.albumService.getAlbums(data?.id.toString()).subscribe({
            next: (data) => {
              console.log('Albums:', data);
              this.albums.set(data);
            },
            error: (error) => {
              console.error('Error fetching albums:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
        complete: () => {
          console.log('User data loading completed');
        },
      });
  }

  getCapitalized(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}