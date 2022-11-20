import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePassword } from 'src/app/models/change-password';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  username!: string;
  changePasswordForm!: FormGroup;
  submitted!: boolean;
  changePasswordServerError!: boolean;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getUserInfo();

    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });
  }

  getUserInfo() {
    this.authService.getUserInfo().subscribe(
      (response: string) => {
        this.username = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  changePassword(passwords: ChangePassword) {
    if (!this.changePasswordForm.valid) {
      return;
    }

    this.submitted = true;

    this.authService.changePassword(passwords).subscribe(
      (response: any) => {
        this.authService.signOut();
        this.closeModal('changePasswordModal');
      },
      (error: HttpErrorResponse) => {
        this.changePasswordServerError = true;
      }
    );
  }

  get fval() {
    return this.changePasswordForm.controls;
  }

  closeModal(modal: string) {
    document.getElementById(modal)?.click();
  }

}
