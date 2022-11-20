import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItem } from 'src/app/models/todo-item';
import { TodoList } from 'src/app/models/todo-list';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {
  todayItems!: TodoItem[];

  addTaskForm!: FormGroup;
  editTaskForm!: FormGroup;
  invalidDate: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private todoListService: TodoListService, private formBuilder: FormBuilder) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: [''],
      date: ['']
    });

    this.editTaskForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      description: [''],
      date: ['']
    });

    this.getItemsByToday();
  }

  public getItemsByToday(): void {
    this.todoListService.getItemsByToday().subscribe(
      (response: TodoItem[]) => {
        this.todayItems = response;
      },
      (error: HttpErrorResponse) => {
        //this.router.navigate(['/']);
      }
    )
  }





  validateDate(inputDate: Date) {
    let todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    todayDate.setMilliseconds(0);

    inputDate.setHours(0);
    inputDate.setMinutes(0);
    inputDate.setSeconds(0);
    inputDate.setMilliseconds(0);

    return inputDate >= todayDate;
  }

  closeModal(modal: string) {
    document.getElementById(modal)?.click();
  }

  completeTask(itemId: any) {
    this.todoListService.completeTask(itemId).subscribe(
      (response: any) => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  editTask(task: any, itemId: any) {
    let todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    todayDate.setMilliseconds(0);

    let inputDate = new Date(task.date);
    inputDate.setHours(0);
    inputDate.setMinutes(0);
    inputDate.setSeconds(0);
    inputDate.setMilliseconds(0);

    if (this.editTaskForm.invalid) {
      console.log('invalid');
      return;
    }

    task.id = itemId;

    if (this.validateDate(inputDate) || task.date == "") {
      console.log('OKKKK');
      this.todoListService.editTask(task).subscribe(
        (response: any) => {
          this.ngOnInit();
          this.closeModal('editTaskModal' + itemId);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      this.invalidDate = true;
    }
  }

  deleteTask(itemId: any) {
    this.todoListService.deleteTask(itemId).subscribe(
      (response: any) => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}