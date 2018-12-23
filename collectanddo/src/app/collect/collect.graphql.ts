import gql from 'graphql-tag';

export const mutation = gql`
mutation insert_todo ($todoValue: [todo_insert_input!]!) {
  insert_todo(objects: $todoValue) {
    returning {
      id
      title
    }
  }
}
`;

export interface Response {
  todo: graphModel.Todo;
}
