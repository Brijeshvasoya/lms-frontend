import gql from "graphql-tag";

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(_id: $id)
  }
`;