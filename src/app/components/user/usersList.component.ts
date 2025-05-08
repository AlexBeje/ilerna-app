import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { UserService } from '@/services/user.service';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import type { User } from '@/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="relative">
    <button (click)="scrollLeft()" class="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 w-10 h-10 lg:hidden">
      <i class="fas fa-angle-left"></i>
    </button>
    <button (click)="scrollRight()" class="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 w-10 h-10 lg:hidden">
      <i class="fas fa-angle-right"></i>
    </button>
    <div #scrollContainer class="flex overflow-x-hidden gap-6 lg:gap-10 px-14 lg:px-0 scrollbar-hide">
      <div *ngFor="let user of users(); let i = index" class="w-14 cursor-pointer" (click)="navigateToUser(user.id)">
        <div [ngClass]="getRandomColor(i) + ' rounded-full w-14 h-14 flex items-center justify-center text-2xl'">
          {{ getUserNameFirstLetter(user.name) }}
        </div>
        <div class="text-xs w-full text-center mt-2">{{ user.name }}</div>
      </div>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  users = signal<User[]>([]);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  getUserNameFirstLetter(user: string): string {
    return user.charAt(0).toUpperCase();
  }

  getRandomColor(index: number): string {
    const colors = [
      'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200',
      'bg-indigo-200', 'bg-violet-200', 'bg-purple-200', 'bg-pink-200', 'bg-rose-200',
    ];
    return colors[index % colors.length];
  }

  navigateToUser(userId: number): void {
    this.router.navigate([`/user/${userId}`]);
  }

  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}