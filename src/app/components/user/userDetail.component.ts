import { Component, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '@/services/user.service';
import { PostService, Post } from '@/services/post.service';
import { AlbumService, Album } from '@/services/album.service';
import { CommentService, Comment } from '@/services/comment.service';
import { PhotoService, Photo } from '@/services/photo.service';
import { TodoService, Todo } from '@/services/todo.service';
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
            <h2 class="text-xl font-semibold text-gray-800">{{ getCapitalized(post.title) }}</h2>
            <h3 class="text-lg text-gray-600">{{ getCapitalized(post.body) }}</h3>
            <hr />
            <div class="flex justify-between items-center">
              <h3 class="text-lg text-gray-800 font-semibold">Comments</h3>
              <p class="text-sm text-gray-600"
                (click)="toggleComments(post.id)"
                class="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out">
                {{ this.comments[post.id]().length > 0 ? 'Hide Comments' : 'Show Comments' }}
              </p>
            </div>
            <div *ngIf="this.comments[post.id]().length > 0" class="flex flex-col gap-2">
              <div *ngFor="let comment of comments[post.id](); let j = index" class="bg-gray-100 rounded-lg p-4 flex flex-col gap-1">
                <div class="text-lg font-semibold">{{ comment.name }}</div>
                <p class="text-gray-600">{{ getCapitalized(comment.body) }}</p>
                <div class="text-sm text-gray-500 font-semibold">{{ comment.email }}</div>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="activeTab() === 'albums'">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div
              *ngFor="let album of albums(); let j = index"
              class=" bg-white shadow overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition duration-100 ease-in-out"
              (click)="openAlbumModal(album)"
            >
              <div class="flex-1 bg-gray-200  border-white">
                <img
                  src="https://dummyimage.com/600"
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
        <div class="bg-white rounded-2xl shadow-md overflow-hidden p-6 flex flex-col gap-2">
          <h2 class="text-xl font-semibold text-gray-800">ToDo's</h2>
          <div class="flex flex-col gap-2">
            <div *ngFor="let todo of todos()" class="bg-gray-100 rounded-lg p-4 flex items-center">
              <input type="checkbox" [checked]="todo.completed" class="mr-2" (click)="$event.preventDefault()"/>{{ todo.title }}
            </div>
          </div>
        </div>
        </div>
      </div>

      <div *ngIf="showAlbumModal()" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4" (click)="closeAlbumModal()">
        <div class="bg-white shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative" (click)="$event.stopPropagation()">
          <button class="absolute top-4 right-6 text-white bg-black bg-opacity-40 hover:bg-opacity-70 px-2 py-1 rounded" (click)="closeAlbumModal()">✕</button>
          <h2 class="text-xl font-semibold mb-4">{{ selectedAlbumTitle() }}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <ng-container *ngIf="!photosLoading(); else photosLoadingTemplate">
              <div *ngFor="let photo of photos()" class="flex flex-col items-center cursor-pointer" (click)="openPhotoModal(photo)">
                <img [src]="photo.thumbnailUrl" [alt]="photo.title" class="w-full h-auto rounded-md shadow hover:shadow-lg transition duration-200 ease-in-out" (load)="photosLoading.set(false)">
                <p class="text-sm text-center mt-2">{{ photo.title }}</p>
              </div>
            </ng-container>
            <ng-template #photosLoadingTemplate>
              <div class="col-span-full text-center py-10">
                <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-[spin_1s_linear_infinite]"></div>
                <p class="mt-2 text-gray-600">Loading photos...</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="showPhotoModal()" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4" (click)="closePhotoModal()">
      <div class="relative max-w-4xl w-full" (click)="$event.stopPropagation()">
        <ng-container *ngIf="!photoLoading(); else photoLoadingTemplate">
          <img [src]="selectedPhoto()?.url" [alt]="selectedPhoto()?.title" class="w-full h-auto rounded shadow-lg" (load)="photoLoading.set(false)">
          <button class="absolute top-2 right-2 text-white bg-black bg-opacity-40 hover:bg-opacity-70 px-2 py-1 rounded" (click)="closePhotoModal()">✕</button>
          <p class="text-white text-center mt-2 text-sm">{{ selectedPhoto()?.title }}</p>
        </ng-container>
        <ng-template #photoLoadingTemplate>
          <div class="flex flex-col items-center justify-center py-10">
            <div class="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-[spin_1s_linear_infinite]"></div>
            <p class="mt-4 text-sm text-white">Loading photo...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class UserComponent implements OnInit {
  user = signal<User | undefined>(undefined);
  posts = signal<Post[] | undefined>([]);
  albums = signal<Album[] | undefined>([]);
  activeTab = signal<string>('posts');
  comments: { [postId: number]: WritableSignal<Comment[]> } = {};
  todos = signal<Todo[] | undefined>([]);
  photos = signal<Photo[] | undefined>([]);
  selectedAlbumTitle = signal<string>('');
  showAlbumModal = signal<boolean>(false);
  selectedPhoto = signal<Photo | null>(null);
  showPhotoModal = signal(false);
  photosLoading = signal<boolean>(false);
  photoLoading = signal<boolean>(false);

  constructor(
    private userService: UserService,
    private postService: PostService,
    private albumService: AlbumService,
    private commentsService: CommentService,
    private todoService: TodoService,
    private photoService: PhotoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const userId = params.get('id');
          return this.userService.getUser(userId);
        })
      )
      .subscribe({
        next: (data) => {
          this.user.set(data);

          this.postService.getPosts(data?.id.toString()).subscribe({
            next: (data) => {
              this.posts.set(data);
              data?.forEach(post => {
                this.comments[post.id] = signal([]);
              });
            },
            error: (error) => {
              console.error('Error fetching posts:', error);
            },
          });

          this.albumService.getAlbums(data?.id.toString()).subscribe({
            next: (data) => {
              this.albums.set(data);
            },
            error: (error) => {
              console.error('Error fetching albums:', error);
            },
          });

          this.todoService.getTodos(data?.id.toString()).subscribe({
            next: (data) => {
              this.todos.set(data);
            },
            error: (error) => {
              console.error('Error fetching todos:', error);
            },
          });
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
      });
  }

  getCapitalized(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  toggleComments(postId: number): void {
    const currentComments = this.comments[postId]();
    if (currentComments.length > 0) {
      this.comments[postId].set([]);
    } else {
      this.commentsService.getComments(postId).subscribe({
        next: (comments) => {
          this.comments[postId].set(comments);
        },
        error: (error) => {
          console.error(`Error fetching comments for post ${postId}:`, error);
        },
      });
    }
  }

  openAlbumModal(album: Album): void {
    this.selectedAlbumTitle.set(album.title);
    this.photosLoading.set(true);
  
    this.photoService.getPhotos(album.id).subscribe({
      next: (data) => {
        this.photos.set(data);
        this.showAlbumModal.set(true);
        setTimeout(() => {
          this.photosLoading.set(false);
        }, 1000);
      },
      error: (err) => {
        console.error('Error fetching photos:', err);
        this.photosLoading.set(false);
      },
    });
  }

  closeAlbumModal(): void {
    this.showAlbumModal.set(false);
    this.photos.set([]);
    this.selectedAlbumTitle.set('');
    this.photosLoading.set(false);
  }

  openPhotoModal(photo: Photo): void {
    this.photoLoading.set(true);
    this.showPhotoModal.set(true);
    this.selectedPhoto.set(photo);
    setTimeout(() => {
      this.photoLoading.set(false);
    }, 1000);
  }

  closePhotoModal(): void {
    this.showPhotoModal.set(false);
    this.selectedPhoto.set(null);
    this.photoLoading.set(true);
  }
}