import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular'
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import * as graphql from './collections.graphql';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  private groupSubscription: Subscription;
  private groupQuery: QueryRef<any>;
  private groups: graphModel.Group[] = [];
  private loading = true;
  private error: any;
  private limit: number = 100;
  private offsetCount: number = 0;
  private offsetIncrease: number = this.limit;
  private offsetNeedMore: boolean = true;

  constructor(
    private apollo: Apollo,
    private commonService: CommonService
  ) { }

  ngOnInit() {

    this.execGroupQuery().then(result => {
      this.groups.push.apply(this.groups, result);
      this.loading = false;
      this.error = null;
      const dateNow: string = new Date().toUTCString();
      const dateNowISO: string = new Date(dateNow).toISOString();
      this.setupSubscription(dateNowISO);
    });

  }

  execGroupQuery(offset: number = 0) {
    let groupsResult: graphModel.Group[] = [];
    return new Promise(resolve => {
      this.groupQuery = this.apollo.watchQuery<graphql.CollectionsResponse>({
        query: graphql.CollectionsQuery,
        variables: {
          limit: this.limit,
          offset: offset,
        },
      });

      this.groupSubscription = this.groupQuery.valueChanges.subscribe(
        ({ data }) => {
          if (data && data.group) {
            groupsResult.push(...data.group);

            // If we receive less than the offsetIncrease we don't need to recover more
            if (data.group.length < this.offsetIncrease) {
              this.offsetNeedMore = false;
            }

            resolve(groupsResult);
          }
        }
      );
    })
  };

  updateGroups(newGroups) {
    const oldData = this.groups;
    const newData = [...newGroups, ...oldData];
    this.groups = this.commonService.arrayUnique(newData);
  }

  setupSubscription(date: string) {
    this.groupQuery.subscribeToMore({
      document: graphql.CollectionsSubscription,
      variables: {
        creationDate: date,
      },
      updateQuery: (prev, { subscriptionData }) => {

        if (subscriptionData.data && subscriptionData.data.group && subscriptionData.data.group.length > 0) {
          this.updateGroups(subscriptionData.data.group);

          return Object.assign({}, prev, {
            group: [...subscriptionData.data.group, ...prev['group']]
          });
        }
      }
    });
  }

  async loadMore(event) {
    this.offsetCount = this.offsetCount + this.offsetIncrease;
    await this.execGroupQuery(this.offsetCount).then(result => {
      this.groups.push.apply(this.groups, result);
    });
    if (this.offsetNeedMore === false) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }

}
