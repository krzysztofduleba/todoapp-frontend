import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoItem } from 'src/app/models/todo-item';
import { TodoList } from 'src/app/models/todo-list';
import { TodoListService } from 'src/app/services/todo-list.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  listId!: number;
  items!: TodoItem[];

  addTaskForm!: FormGroup;
  editTaskForm!: FormGroup;
  editProjectForm!: FormGroup;
  invalidDate: boolean = false;

  sortBy: string = 'id,asc';

  constructor(private router: Router, private route: ActivatedRoute, private todoListService: TodoListService, private formBuilder: FormBuilder) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.listId = params['id'];
    })

    if (this.listId == null) {
      this.router.navigate(['/']);
      return;
    }

    this.getSortedList(this.sortBy);
    console.log(this.sortBy);

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

    this.editProjectForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });
  }

  onNavigate(location: string) {
    this.sortBy = location;
    this.ngOnInit();
  }

  public getSortedList(sortBy: string): void {
    this.todoListService.getSortedList(this.listId, sortBy).subscribe(
      (response: TodoItem[]) => {
        this.items = response;
      },
      (error: HttpErrorResponse) => {
        this.router.navigate(['/']);
      }
    )
  }

  public deleteProject() {
    this.todoListService.deleteProject(this.listId).subscribe(
      (response: any) => {
        this.router.navigate(['/projects/today']);
        this.closeModal('deleteProjectModal');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public editProject(project: any) {
    if (this.editProjectForm.invalid) {
      console.log('invalid');
      alert('Project name must be between 1-50 characters')
      return;
    }

    this.todoListService.editProject(this.listId, project).subscribe(
      (response: any) => {
        window.location.reload();
        this.closeModal('editProjectModal');
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
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

  addTask(task: any) {
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

    if (this.addTaskForm.invalid) {
      alert('Name cannot be empty');
      console.log('invalid');
      return;
    }

    if (this.validateDate(inputDate) || task.date == "") {
      //console.log('OKKKK');
      this.todoListService.addTask(this.listId, task).subscribe(
        (response: any) => {
          this.ngOnInit();
          this.closeModal('addTaskModal');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    } else {
      this.invalidDate = true;
      alert('Date cannot be earlier than today\'s day');
    }
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
      //console.log('invalid');
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
