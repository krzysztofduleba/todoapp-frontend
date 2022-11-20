import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TodoListService } from '../../services/todo-list.service';
import { TodoList } from '../../models/todo-list';
import { TodoItem } from 'src/app/models/todo-item';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { JWTService } from 'src/app/jwt.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public lists!: TodoList[];
  public list!: TodoList;
  public items!: TodoItem[];

  constructor(private todoListService: TodoListService, public authService: AuthService, public localStorageService: LocalStorageService, public jwt: JWTService) { }

  isLoggedIn!: boolean;

  ngOnInit(): void {
    this.isLoggedIn = this.isAuthenticated();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}