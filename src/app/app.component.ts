import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from '@/components/user/usersList.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserListComponent],
  template: `
    <main class="lg:container mx-auto">
      <div class="p-2">
        <app-user-list />
      </div>
      <hr class="py-2"/>
      <div class="px-4">
        <router-outlet />
      </div>
    </main>
  `
})
export class AppComponent {
}
