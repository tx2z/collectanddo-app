import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const TODO_QUERY = gql`
  query {
    todo(where: {done: {_eq: false}}) {
      id
      title
      content
      url
      done
    }
  }
`;

interface Todo {
  id: number;
  title: string;
  content: string;
  url: string;
  done: boolean;
}

interface Response {
  todo: Todo;
}

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  public items: any;
  public loading = true;
  public error: any;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<Response>({
        query: TODO_QUERY,
      })
      .valueChanges.subscribe(result => {
        // console.log(result.data.todo);
        this.items = result.data && result.data.todo;
        this.loading = result.loading;
        this.error = result.errors;
      });
  }

}
