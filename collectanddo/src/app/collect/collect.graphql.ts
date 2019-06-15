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

export const CollectionsQuery = gql`
query {
  group (
    where: {  },
    order_by: [
      {created: desc},
      {updated: desc}
    ]
    ) {
    id
    title
    color
  }
}
`;

export interface CollectionsResponse {
  group: graphModel.Group;
}