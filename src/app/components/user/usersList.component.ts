import { Component, OnInit } from '@angular/core';
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
    <div class="flex overflow-x-auto gap-6 lg:gap-12">
      <div *ngFor="let user of usersSignal(); let i = index" class="w-14 cursor-pointer" (click)="navigateToUser(user.id)">
        <div [ngClass]="getRandomColor(i) + ' rounded-full w-14 h-14 flex items-center justify-center text-2xl'">
          {{ getUserNameFirstLetter(user.name) }}
        </div>
        <div class="text-xs w-full text-center mt-2">{{ user.name }}</div>
      </div>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  usersSignal = signal<User[]>([]);

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usersSignal.set(data);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('User data loading completed');
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
}