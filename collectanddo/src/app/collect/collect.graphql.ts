import gql from 'graphql-tag';

export const TODO_QUERY = gql`
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

export interface Todo {
    id: number;
    title: string;
    content: string;
    url: string;
    done: boolean;
}

export interface Response {
    todo: Todo;
}
