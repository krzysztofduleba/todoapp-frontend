import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/models/todo-item';
import { TodoList } from 'src/app/models/todo-list';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  completedItems!: TodoItem[];

  constructor(private todoListService: TodoListService) { }

  ngOnInit(): void {
    this.getCompletedTasks();
  }

  public getCompletedTasks(): void {
    this.todoListService.getCompletedTasks().subscribe(
      (response: TodoItem[]) => {
        this.completedItems = response;
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    )
  }

  restoreTask(itemId: any): void {
    this.todoListService.restoreTask(itemId).subscribe(
      (response: any) => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    )
  }
}
