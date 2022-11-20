import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoList } from '../models/todo-list';
import { TodoListService } from '../services/todo-list.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public lists!: TodoList[];
  createProjectForm!: FormGroup;

  constructor(private todoListService: TodoListService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getLists();
    this.createProjectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]]
    });
  }

  public getLists(): void {
    this.todoListService.getLists().subscribe(
      (response: TodoList[]) => {
        this.lists = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  createProject(name: any) {
    console.log(name);

    if (this.createProjectForm.valid) {
      this.closeModal();
      this.todoListService.createList(this.createProjectForm.value).subscribe(
        (response: any) => {
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
  }

  closeModal() {
    document.getElementById('newProjectModal')?.click();
  }

}
