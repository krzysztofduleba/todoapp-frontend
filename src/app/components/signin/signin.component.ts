import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm!: FormGroup;
  submitted: boolean = false;
  error: boolean = false;

  returnUrl!: string;
  signedIn = this.route.snapshot.queryParams['signedIn'] || false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);
    console.log(this.signedIn);
  }

  get fval() { 
    return this.signInForm.controls;
  }

  onFormSubmit(user: User) {
    this.submitted = true;
    if (this.signInForm.invalid) {
      console.log(1);
      return;
    }

    this.authService.signIn(user).subscribe(
      (response: any) => {
        this.authService.authenticate(response);
        this.router.navigateByUrl(this.returnUrl);
      },
      (error: HttpErrorResponse) => {
        this.error = true;
      }
    )
  }
}
