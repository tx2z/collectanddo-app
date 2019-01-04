import gql from 'graphql-tag';

export const CollectionsSubscription = gql`
subscription CollectionsSubscription (
  $creationDate: timestamptz
) {
  group (
    where: {
      _and: [
        { created: {_gte: $creationDate} },
        { group_todos: {} }
      ]}
    order_by: [
      {created: desc},
      {updated: desc}
    ]
    ) {
    id
    title
    color
    group_todos (
      order_by: [{group: {created: desc}}, {group: {updated: desc}}]
      ) {
      todo {
        id
        title
        content
        url
        done
      }
    }
  }
}
`;

export const CollectionsQuery = gql`
query {
  group (
    where: { group_todos: {} },
    order_by: [
      {created: desc},
      {updated: desc}
    ]
    ) {
    id
    title
    color
    group_todos (
      order_by: [{group: {created: desc}}, {group: {updated: desc}}]
      ) {
      todo {
        id
        title
        content
        url
        done
      }
    }
  }
}
`;

export interface CollectionsResponse {
  group: graphModel.Group;
}
