import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
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

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    const today = new Date();

    this.newEvent = this.formBuilder.group({
      title:      [''],
      content:    [''],
      start_date: ['', [Validators.required, CustomValidators.date]],
      start_time: ['', Validators.required],
      end_date:   ['', [Validators.required, CustomValidators.date]],
      end_time:   ['', Validators.required],
      group_id:   ['', [Validators.required, CustomValidators.number]],
    });
  }

  get f() { return this.newEvent.controls; }

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
