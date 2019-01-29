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
