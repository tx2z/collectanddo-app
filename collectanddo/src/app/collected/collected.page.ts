import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as graphql from './collected.graphql';

@Component({
  selector: 'app-collected',
  templateUrl: './collected.page.html',
  styleUrls: ['./collected.page.scss'],
})
export class CollectedPage implements OnInit {

  private todos: any;
  private loading = true;
  private error: any;

  constructor(
    private apollo: Apollo
    ) { }

  ngOnInit() {

    const getCollected = this.apollo
      .watchQuery<graphql.CollectedResponse>({
        query: graphql.CollectedQuery,
      });

    getCollected
      .subscribeToMore({
        document: graphql.CollectedSubscription,
        updateQuery: (previous, { subscriptionData }) => {
          console.log(previous);
          console.log(subscriptionData);
          return { }
        }
      });

    const querySubscription = getCollected.valueChanges.subscribe(result => {
        this.todos = result.data && result.data.todo;
        this.loading = result.loading;
        this.error = result.errors;
      });
  }

}
