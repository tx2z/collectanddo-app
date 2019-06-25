import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Router } from '@angular/router';
import * as graphql from './collection.graphql';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {

  private newGroup: FormGroup;
  private todoSubscription: Subscription;
  private todoQuery: QueryRef<any>;
  private todos: graphModel.Todo[] = [];
  private selectedTodos: Array<number> = [];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.newGroup = this.formBuilder.group({
      title: ['', Validators.required],
      content: [''],
      color: [''],
      todoSearch: [''],
      todos: new FormArray([])
    });

    this.newGroup.controls.todoSearch.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(term => {
      console.log(term);
      this.addCheckboxes(term);
    });

  }

  execTodoQuery(term: string) {
    const searchQuery: string = '%' + term + '%';

    return new Promise(resolve => {
      this.todoQuery = this.apollo.watchQuery<graphql.CollectedResponse>({
        query: graphql.CollectedQuery,
        variables: {
          query: searchQuery,
        },
      });

      this.todoSubscription = this.todoQuery.valueChanges.subscribe(
        ({ data }) => {
          if (data && data.todo) {
            this.todos.push(...data.todo);
            resolve();
          }
        }
      );
    })
  }

  cleanCheckboxes() {
    let selectedTodos: graphModel.Todo[] = [];

    return new Promise(resolve => {

      // keep the todos we need
      (this.newGroup.controls.todos as FormArray).controls.map((control, index) => {
        if (control.value) {
          selectedTodos.push(this.todos[index]);
          this.selectedTodos.push(this.todos[index].id);
        }
      });

      // remove all controls
      while ((this.newGroup.controls.todos as FormArray).length !== 0) {
        (this.newGroup.controls.todos as FormArray).removeAt(0)
      }

      this.todos = selectedTodos;
      resolve();
    })
  }

  async addCheckboxes(term: string) {
    await this.cleanCheckboxes();

    if (term !== '') {
      await this.execTodoQuery(term);
      this.todos = this.commonService.arrayUnique(this.todos);
    }

    this.todos.map((todo) => {
        const control = new FormControl(this.selectedTodos.includes(todo.id));
        (this.newGroup.controls.todos as FormArray).push(control);
    });
    
  }

  saveGroup() {
    const groupData = this.newGroup.value;
    let selectedtodoIds = [];

    this.newGroup.value.todos
      .map((v, i) => {
        if (v) {
          const todoID = {
            todo_id: this.todos[i].id
          } 
          selectedtodoIds.push(todoID);
        }
      });

    delete groupData.todos;
    delete groupData.todoSearch;
    
    groupData.group_todos = {
      data: selectedtodoIds
    }
    
    console.log(groupData);
    
    this.apollo.mutate({
      mutation: graphql.mutation,
      variables: {
        groupValue: groupData
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.newGroup.reset();
      this.router.navigate(['/collections']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }


}
