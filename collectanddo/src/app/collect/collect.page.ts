import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import * as graphql from './collect.graphql';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.page.html',
  styleUrls: ['./collect.page.scss'],
})
export class CollectPage implements OnInit {

  private newTodo: FormGroup;
  private groupSubscription: Subscription;
  private groupQuery: QueryRef<any>;
  private groups: graphModel.Group[] = [];
  private counGNewgroups: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
    ) { }

  ngOnInit() {
    this.newTodo = this.formBuilder.group({
      title:   ['', Validators.required],
      url:     [''],
      content: [''],
      groups: new FormArray([]),
      newGroups: new FormArray([])
    });
  }

  execGroupQuery() {
    return new Promise( resolve => {
      this.groupQuery = this.apollo.watchQuery<graphql.CollectionsResponse>({
        query: graphql.CollectionsQuery
      });

      this.groupSubscription = this.groupQuery.valueChanges.subscribe(
        ({ data }) => {
          if (data && data.group) {
            this.groups = [...data.group];
            resolve();
          }
        }
      );
    })
  }

  async addCheckboxes() {
    await this.execGroupQuery();
    this.groups.map((o, i) => {
      const control = new FormControl(false);
      (this.newTodo.controls.groups as FormArray).push(control);
    });
  }

  addNewGroup() {
    const group = new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      color: new FormControl(''),
    });

    (this.newTodo.controls.newGroups as FormArray).push(group);
  }

  saveTodo() {
    const todoData = this.newTodo.value;
    let addedGroups = [];

    // Add existing goups_ids
    this.newTodo.value.groups
      .map((value, index) => {
        if (value) {
          const groupID = {
            group_id: this.groups[index].id
          }
          addedGroups.push(groupID);
        }
      });
    
    // Create new groups
    this.newTodo.value.newGroups
      .map((value, index) => {
        if (value) {
          const newGroup = {
            group: {
              data: value
            }
          }
          addedGroups.push(newGroup);
        }
      });

    // remove info we don't need to send
    delete todoData.groups;
    delete todoData.newGroups;

    todoData.todo_groups = {
      data: addedGroups
    }

    console.log(todoData);


    this.apollo.mutate({
      mutation: graphql.mutation,
      variables: {
        todoValue: todoData
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.newTodo.reset();
      this.router.navigate(['/collected']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

}
