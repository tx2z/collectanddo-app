import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as graphql from './collected.graphql';

@Component({
  selector: 'app-collected',
  templateUrl: './collected.page.html',
  styleUrls: ['./collected.page.scss'],
})
export class CollectedPage implements OnInit {

  public todos: any;
  public loading = true;
  public error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo
      .watchQuery<graphql.Response>({
        query: graphql.query,
      })
      .valueChanges.subscribe(result => {
        this.todos = result.data && result.data.todo;
        this.loading = result.loading;
        this.error = result.errors;
      });
  }

}
