import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as graphql from './collect.graphql';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.page.html',
  styleUrls: ['./collect.page.scss'],
})
export class CollectPage implements OnInit {

  public items: any;
  public loading = true;
  public error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo
      .watchQuery<graphql.Response>({
        query: graphql.TODO_QUERY,
      })
      .valueChanges.subscribe(result => {
        // console.log(result.data.todo);
        this.items = result.data && result.data.todo;
        this.loading = result.loading;
        this.error = result.errors;
      });
  }

}
