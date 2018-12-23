import gql from 'graphql-tag';

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
  todo: graphModel.Todo;
}
