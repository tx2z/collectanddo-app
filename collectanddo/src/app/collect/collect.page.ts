import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import * as graphql from './collect.graphql';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.page.html',
  styleUrls: ['./collect.page.scss'],
})
export class CollectPage implements OnInit {

  private newTodo: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private router: Router
    ) { }

  ngOnInit() {
    this.newTodo = this.formBuilder.group({
      title:   ['', Validators.required],
      url:     [''],
      content: ['']
    });
  }

  saveTodo() {
    console.log(this.newTodo.value);

    this.apollo.mutate({
      mutation: graphql.mutation,
      variables: {
        todoValue: this.newTodo.value
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.newTodo.reset();
      this.router.navigate(['/collected']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

}
