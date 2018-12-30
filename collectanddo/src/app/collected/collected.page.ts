import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';

import { AuthService } from 'src/app/services/auth.service';

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
    private apollo: Apollo,
    private authService: AuthService,
    ) { }

  ngOnInit() {

    console.log(this.authService.user);

    const getCollected = this.apollo
      .watchQuery<graphql.CollectedResponse>({
        query: graphql.CollectedQuery,
      });

    getCollected
      .subscribeToMore({
        document: graphql.CollectedSubscription,
        updateQuery: (previous, { subscriptionData }) => {

          this.todos = subscriptionData.data && subscriptionData.data.todo;

          return { };
        }
      });

    const querySubscription = getCollected.valueChanges.subscribe(result => {

        this.todos = result.data && result.data.todo;
        this.loading = result.loading;
        this.error = result.errors;

      });
  }

  logout() {
    this.authService.logout();
  }

}
