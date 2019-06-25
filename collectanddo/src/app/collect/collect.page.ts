import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Router } from '@angular/router';
import * as graphql from './collect.graphql';
import { CommonService } from '../services/common.service';

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
  private selectedGroups: Array<number> = [];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private commonService: CommonService
    ) { }

  ngOnInit() {
    this.newTodo = this.formBuilder.group({
      title:   ['', Validators.required],
      url:     [''],
      content: [''],
      groupSearch: [''],
      groups: new FormArray([]),
      newGroups: new FormArray([])
    });

    this.newTodo.controls.groupSearch.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(term => {
      console.log(term);
      this.addCheckboxes(term);
    });
  }

  execGroupQuery(term: string) {
    const searchQuery: string = '%' + term + '%';

    return new Promise( resolve => {
      this.groupQuery = this.apollo.watchQuery<graphql.CollectionsResponse>({
        query: graphql.CollectionsQuery,
        variables: {
          query: searchQuery,
        },
      });

      this.groupSubscription = this.groupQuery.valueChanges.subscribe(
        ({ data }) => {
          if (data && data.group) {
            this.groups.push(...data.group);
            resolve();
          }
        }
      );
    })
  }

  cleanCheckboxes() {
    let selectedGroups: graphModel.Group[] = [];

    return new Promise(resolve => {

      // keep the groups we need
      (this.newTodo.controls.groups as FormArray).controls.map((control, index) => {
        if (control.value) {
          selectedGroups.push(this.groups[index]);
          this.selectedGroups.push(this.groups[index].id);
        }
      });

      // remove all controls
      while ((this.newTodo.controls.groups as FormArray).length !== 0) {
        (this.newTodo.controls.groups as FormArray).removeAt(0)
      }

      this.groups = selectedGroups;
      resolve();
    })
  }

  async addCheckboxes(term: string) {
    await this.cleanCheckboxes();

    if (term !== '') {
      await this.execGroupQuery(term);
      this.groups = this.commonService.arrayUnique(this.groups);
    }

    this.groups.map((todo) => {
      const control = new FormControl(this.selectedGroups.includes(todo.id));
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

  removeNewGroup(index: number) {
    (this.newTodo.controls.newGroups as FormArray).removeAt(index);
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
