import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import * as graphql from './collection.graphql';

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

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.newGroup = this.formBuilder.group({
      title: ['', Validators.required],
      content: [''],
      color: [''],
      todos: new FormArray([])
    });

    this.todoQuery = this.apollo.watchQuery<graphql.CollectedResponse>({
      query: graphql.CollectedQuery
    });

    this.todoSubscription = this.todoQuery.valueChanges.subscribe(
      ({ data }) => {
        if (data && data.todo) {
          this.todos = [...data.todo];
          this.addCheckboxes();
        }
      }
    );

  }

  addCheckboxes() {
    this.todos.map((o, i) => {
      const control = new FormControl(false); // if first item set to true, else false
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
