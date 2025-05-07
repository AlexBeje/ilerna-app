import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from '@/components/user/usersList.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserListComponent],
  template: `
    <main class="container mx-auto px-4">
      <div class="my-4">
        <app-user-list />
      </div>
      <router-outlet />
    </main>
  `
})
export class AppComponent {
}
