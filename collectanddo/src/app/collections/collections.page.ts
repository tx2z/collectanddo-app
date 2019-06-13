import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import * as graphql from './collections.graphql';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {

  private groupSubscription: Subscription;
  private groupQuery: QueryRef<any>;
  private groups: graphModel.Group[] = [];
  private loading = true;
  private error: any;

  constructor(
    private apollo: Apollo,
  ) { }

  ngOnInit() {

    this.groupQuery = this.apollo.watchQuery<graphql.CollectionsResponse>({
      query: graphql.CollectionsQuery
    });

    this.groupSubscription = this.groupQuery.valueChanges.subscribe(
      ({ data }) => {
        if (data && data.group) {
          this.groups = [...data.group];
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
    this.groupQuery.subscribeToMore({
      document: graphql.CollectionsSubscription,
      variables: {
        creationDate: date,
      },
      updateQuery: (prev, { subscriptionData }) => {

        if (subscriptionData.data && subscriptionData.data.group && subscriptionData.data.group.length > 0) {
          console.log('prev');
          console.log(prev);
          console.log('subscriptionData');
          console.log(subscriptionData.data);
          console.log(date);

          const newGroup = subscriptionData.data.group[0];

          return Object.assign({}, prev, {
            group: [newGroup, ...prev['group']]
          });
        } else {
          return prev;
        }
      }
    });
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }

}
