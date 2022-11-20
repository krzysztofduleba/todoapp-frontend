import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { AuthGuard } from './services/auth/auth.guard';
import { SignedInGuard } from './services/signedin/signed-in.guard';
import { ProjectComponent } from './components/project/project.component';
import { AccountComponent } from './components/account/account.component';
import { TodayComponent } from './components/today/today.component';
import { CompletedComponent } from './components/completed/completed.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent, canActivate: [SignedInGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [SignedInGuard] },
  { path: 'signout', component: SignoutComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'projects/today', component: TodayComponent, canActivate: [AuthGuard] },
  { path: 'projects/completed', component: CompletedComponent, canActivate: [AuthGuard] },
  { path: 'projects/project', component: ProjectComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
