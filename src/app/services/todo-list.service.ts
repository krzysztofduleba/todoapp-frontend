import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { TodoItem } from '../models/todo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  public getLists(): Observable<any> {
    return this.http.get(`${this.apiServerUrl}/api/lists`);
  }

  public getList(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/lists/${id}`);
  }

  public getSortedList(id: number, sortBy: string): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/lists/${id}/items?sort=${sortBy}`);
  }

  public getItemsByToday(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/items/today`);
  }

  public getCompletedTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/items/completed`);
  }

  public getUnlistedItems(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/items/inbox`);
  }

  public createList(listName: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/api/lists`, listName);
  }

  public addTask(listId: number, task: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/api/lists/${listId}/items`, task);
  }

  public completeTask(itemId: any) {
    return this.http.patch(`${this.apiServerUrl}/api/items/${itemId}/complete`, null);
  }

  public restoreTask(itemId: any) {
    return this.http.patch(`${this.apiServerUrl}/api/items/${itemId}/restore`, null);
  }

  public completeUnlistedTask(itemId: any) {
    return this.http.put(`${this.apiServerUrl}/api/items/${itemId}/complete`, null);
  }

  public editTask(task: TodoItem) {
    return this.http.put(`${this.apiServerUrl}/api/items`, task);
  }

  public deleteTask(itemId: any) {
    return this.http.delete(`${this.apiServerUrl}/api/items/${itemId}`);
  }

  public deleteProject(listId: any) {
    return this.http.delete(`${this.apiServerUrl}/api/lists/${listId}`);
  }

  public editProject(listId: any, project: any) {
    return this.http.patch(`${this.apiServerUrl}/api/lists/${listId}`, project);
  }

  public getItems(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/api/lists/${id}/items`);
  }
}