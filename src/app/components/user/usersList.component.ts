import { Component, OnInit } from '@angular/core';
import { UserService } from '@/services/user.service';
import { CommonModule } from '@angular/common';
import type { User } from '@/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-details">
      <ul>
        <li *ngFor="let user of users">
          <h3>{{ user.name }}</h3>
        </li>
      </ul>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('User data loading completed');
      }
    });
  }
}