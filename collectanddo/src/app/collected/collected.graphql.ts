import gql from 'graphql-tag';

export const CollectedSubscription = gql`
subscription CollectedSubscription (
  $creationDate: timestamptz
) {
  todo (
    where: { created: {_gte: $creationDate} },
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

export const CollectedQuery = gql`
query {
  todo (
    order_by: [{created: desc}, {updated: desc}],
    limit: 5
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

export interface CollectedResponse {
  todo: graphModel.Todo;
}
