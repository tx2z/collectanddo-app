import gql from 'graphql-tag';

export const mutation = gql`
mutation insert_event ($eventValue: [event_insert_input!]!) {
  insert_event(objects: $eventValue) {
    returning {
      id
      title
      start
      end
      group {
        id
        title
        content
      }
    }
  }
}
`;

export interface Response {
  event: graphModel.Event;
}

export const CollectionsQuery = gql`
query CollectionsQuery($query: String!) {
  group (
    where: {title: {_ilike: $query}},
    order_by: [{created: desc}, {updated: desc}],
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