import gql from 'graphql-tag';

export const mutation = gql`
mutation insert_group ($groupValue: [group_insert_input!]!) {
  insert_group(objects: $groupValue) {
    returning {
      id
      title
    }
  }
}
`;

export interface Response {
  group: graphModel.Group;
}

export const CollectedQuery = gql`
query CollectedQuery($query: String!) {
  todo (
    where: {title: {_ilike: $query}},
    order_by: [{created: desc}, {updated: desc}],
    ) {
    id
    title
    done
  }
}
`;

export interface CollectedResponse {
  todo: graphModel.Todo;
}