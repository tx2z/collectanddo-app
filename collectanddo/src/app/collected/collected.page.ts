import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';

import { AuthService } from 'src/app/services/auth.service';

import { Subscription } from 'rxjs/Subscription';

import * as graphql from './collected.graphql';

@Component({
  selector: 'app-collected',
  templateUrl: './collected.page.html',
  styleUrls: ['./collected.page.scss'],
})
export class CollectedPage implements OnInit, OnDestroy {

  private todoSubscription: Subscription;
  private todoQuery: QueryRef<any>;
  private todos: graphModel.Todo[] = [];
  private loading = true;
  private error: any;

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    ) { }

  ngOnInit() {

    console.log(this.authService.user);

    this.todoQuery = this.apollo.watchQuery<graphql.CollectedResponse>({
      query: graphql.CollectedQuery
    });

    this.todoSubscription = this.todoQuery.valueChanges.subscribe(
      ({ data }) => {
        if (data && data.todo) {
          this.todos = [...data.todo];
          this.loading = false;
          this.error = null;
        }
      }
    );

    const dateNow: string = new Date().toUTCString();
    const dateNowISO: string = new Date(dateNow).toISOString();
    this.setupSubscription(dateNowISO);

  }

  setupSubscription(date: string) {
    this.todoQuery.subscribeToMore({
      document: graphql.CollectedSubscription,
      variables: {
        creationDate: date,
      },
      updateQuery: (prev, { subscriptionData }) => {

        if (subscriptionData.data && subscriptionData.data.todo && subscriptionData.data.todo.length > 0) {
          console.log('prev');
          console.log(prev);
          console.log('subscriptionData');
          console.log(subscriptionData.data);
          console.log(date);

          const newTodo = subscriptionData.data.todo[0];

          return Object.assign({}, prev, {
            todo: [newTodo, ...prev['todo']]
          });
        } else {
          return prev;
        }
      }
    });
  }

  ngOnDestroy() {
    this.todoSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

}
