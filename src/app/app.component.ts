import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from '@/components/user/usersList.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserListComponent],
  template: `
    <main class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-center text-[#010202] my-4">Proyecto Ilerna</h1>
      <div class="mb-4">
        <app-user-list />
      </div>
      <router-outlet />
    </main>
  `
})
export class AppComponent {
}
