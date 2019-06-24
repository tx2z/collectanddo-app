import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular'
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import * as graphql from './collected.graphql';

@Component({
  selector: 'app-collected',
  templateUrl: './collected.page.html',
  styleUrls: ['./collected.page.scss'],
})
export class CollectedPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  private todoSubscription: Subscription;
  private todoQuery: QueryRef<any>;
  private todos: graphModel.Todo[] = [];
  private loading: boolean = true;
  private error: any;
  private limit: number = 100;
  private offsetCount: number = 0;
  private offsetIncrease: number = this.limit;
  private offsetNeedMore: boolean = true;

  constructor(
    private apollo: Apollo,
    ) { }

  ngOnInit() {

    this.execTodoQuery().then(result => { 
      this.todos.push.apply(this.todos, result); 
      this.loading = false;
      this.error = null;
      const dateNow: string = new Date().toUTCString();
      const dateNowISO: string = new Date(dateNow).toISOString();
      this.setupSubscription(dateNowISO);
    });
    
  }

  execTodoQuery(offset: number = 0) {
    let todosResult: graphModel.Todo[] = [];
    return new Promise(resolve => {
      this.todoQuery = this.apollo.watchQuery<graphql.CollectedResponse>({
        query: graphql.CollectedQuery,
        variables: {
          limit: this.limit,
          offset: offset,
        },
      });

      this.todoSubscription = this.todoQuery.valueChanges.subscribe(
        ({ data }) => {
          if (data && data.todo) {
            todosResult.push(...data.todo);

            // If we receive less than the offsetIncrease we don't need to recover more
            if (data.todo.length < this.offsetIncrease) {
              this.offsetNeedMore = false;
            }

            resolve(todosResult);
          }
        }
      );
    })
  };
  
  uniq(todoArray): graphModel.Todo[] {
    const uniqueArray = todoArray.filter((todo, index) => {
      return index === todoArray.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(todo);
      });
    });
    return uniqueArray;
  }

  updateTodos(newTodos) {
    const oldData = this.todos;
    const newData = [...newTodos, ...oldData];
    this.todos = this.uniq(newData);
  }

  setupSubscription(date: string) {
    this.todoQuery.subscribeToMore({
      document: graphql.CollectedSubscription,
      variables: {
        creationDate: date,
      },
      updateQuery: (prev, { subscriptionData }) => {

        if (subscriptionData.data && subscriptionData.data.todo && subscriptionData.data.todo.length > 0) {
          this.updateTodos(subscriptionData.data.todo);

          return Object.assign({}, prev, {
            todo: [...subscriptionData.data.todo, ...prev['todo']]
          });

        } 
      }
    });
  }

  async loadMore(event) {
    this.offsetCount = this.offsetCount + this.offsetIncrease;
    await this.execTodoQuery(this.offsetCount).then(result => {
      this.todos.push.apply(this.todos, result);
    });
    if (this.offsetNeedMore === false) {
      event.target.disabled = true;
    }
    event.target.complete();
  }

  ngOnDestroy() {
    this.todoSubscription.unsubscribe();
  }

}
