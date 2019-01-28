import gql from 'graphql-tag';

export const DoSubscription = gql`
subscription DoSubscription (
  $creationDate: timestamptz,
  $startFirst: timestamptz,
  $startLast: timestamptz,
) {
  event (
    where: {_and: [{ created: {_gte: $creationDate} },{start: {_gte: $startFirst}}, {start: {_lte: $startLast}}]},
    order_by: {start: asc}
    ) {
    id
    title
    content
    start
    end
    group {
      id
      title
      color
    }
  }
}
`;

export const DoQuery = gql`
query DoQuery (
  $startFirst: timestamptz,
  $startLast: timestamptz,
  ){
  event (
    where: {_and: [{start: {_gte: $startFirst}}, {start: {_lte: $startLast}}]},
    order_by: {start: asc}
    ) {
    id
    title
    content
    start
    end
    group {
      id
      title
      color
    }
  }
}
`;

export interface DoResponse {
  todo: graphModel.Event;
}
