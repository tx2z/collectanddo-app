import gql from 'graphql-tag';
import * as interfaces from '../app.interfaces';

export const query = gql`
query {
  todo (
    order_by: [{created: desc}, {updated: desc}]
    ) {
    id
    title
    content
    url
    done
    todo_groups (
      order_by: [{group: {created: desc}}, {group: {updated: desc}}]
      ) {
      group {
        id
        title
        color
      }
    }
  }
}
`;

export interface Response {
    todo: interfaces.Todo;
}
