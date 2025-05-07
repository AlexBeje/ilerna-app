import { Routes } from '@angular/router';
import { UserComponent } from '@/components/user/user.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', redirectTo: '/user/1', pathMatch: 'full' }, 
    { path: 'user/:id', component: UserComponent },
];