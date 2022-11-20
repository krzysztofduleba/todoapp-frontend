import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  submitted: boolean = false;
  success: boolean = false;
  userExists = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });
  }

  get fval() {
    return this.signUpForm.controls;
  }

  onFormSubmit(user: User) {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    this.authService.signUp(user).subscribe(
      (response: any) => {
        this.router.navigate(['signin'], { queryParams: { signedIn: 'true' } });
      },
      (error: HttpErrorResponse) => {
        if (error.status == 409) {
          this.userExists = true;
        }
      }
    )
  }

}
