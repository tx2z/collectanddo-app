import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Router } from '@angular/router';
import { CustomValidators } from 'ngx-custom-validators';
import * as graphql from './event.graphql';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  private newEvent: FormGroup;
  private groupSubscription: Subscription;
  private groupQuery: QueryRef<any>;
  private groups: graphModel.Group[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {

    this.newEvent = this.formBuilder.group({
      title:      [''],
      content:    [''],
      start_date: ['', [Validators.required, CustomValidators.date]],
      start_time: ['', Validators.required],
      end_date:   ['', [Validators.required, CustomValidators.date]],
      end_time:   ['', Validators.required],
      group_id:   ['', Validators.required],
      groupSearch: [''],
    });

    this.newEvent.controls.groupSearch.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(term => {
      this.addRadios(term);
    });
  }

  execGroupQuery(term: string) {
    const searchQuery: string = '%' + term + '%';

    return new Promise(resolve => {
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

  addRadios(term: string) {
    let selectedGroup: graphModel.Group;
    this.groups.map((group) => {
      if (group.id === this.newEvent.controls.group_id.value) {
        selectedGroup = group;
      }
    });
    this.groups = [];
    if (typeof selectedGroup !== "undefined") {
      this.groups.push(selectedGroup);
    }

    if (term !== '') {
      this.execGroupQuery(term);
    }

  }

  saveEvent() {
    console.log(this.newEvent.value);

    const event: graphModel.Event = {
      start: this.newEvent.value.start_date + 'T' + this.newEvent.value.start_time,
      end: this.newEvent.value.end_date + 'T' + this.newEvent.value.end_time,
      group_id: this.newEvent.value.group_id
    };

    if (this.newEvent.value.title) {
      event.title = this.newEvent.value.title;
    }
    if (this.newEvent.value.content) {
      event.content = this.newEvent.value.content;
    }

    console.log(event);

    this.apollo.mutate({
      mutation: graphql.mutation,
      variables: {
        eventValue: event
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.router.navigate(['/do']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

}
