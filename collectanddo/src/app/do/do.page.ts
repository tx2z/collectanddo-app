import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import * as graphql from './do.graphql';

@Component({
  selector: 'app-do',
  templateUrl: './do.page.html',
  styleUrls: ['./do.page.scss'],
})
export class DoPage implements OnInit, OnDestroy {

  private eventSubscription: Subscription;
  private eventQuery: QueryRef<any>;
  private events: graphModel.Event[] = [];
  private loading = true;
  private error: any;

  constructor(
    private apollo: Apollo,
    ) { }

  ngOnInit() {
    this.eventQuery = this.apollo.watchQuery<graphql.DoResponse>({
      query: graphql.DoQuery,
      variables: {
        startFirst: '2019-01-01',
        startLast: '2019-01-31'
      }
    });

    this.eventSubscription = this.eventQuery.valueChanges.subscribe(
      ({ data }) => {
        if (data && data.event) {
          console.log('subscribe');
          console.log(data.event);

          data.event.sort((a: graphModel.Event, b: graphModel.Event) => (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0));

          console.log('subscribe sort');
          console.log(data.event);

          this.events = [...data.event];
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
    this.eventQuery.subscribeToMore({
      document: graphql.DoSubscription,
      variables: {
        creationDate: date,
        startFirst: '2019-01-01',
        startLast: '2019-01-31'
      },
      updateQuery: (prev, { subscriptionData }) => {

        if (subscriptionData.data && subscriptionData.data.event && subscriptionData.data.event.length > 0) {

          console.log('more');
          console.log(subscriptionData.data.event);
          console.log('prev');
          console.log(prev);

          const newEvent = subscriptionData.data.event[0];
          return Object.assign({}, prev, {
            event: [newEvent, ...prev['event']]
          });
        } else {
          return prev;
        }
      }
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

}
