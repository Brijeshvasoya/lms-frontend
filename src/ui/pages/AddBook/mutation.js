import gql from "graphql-tag";

export const ADD_BOOK = gql`
  mutation CreateBook($input: bookInput!) {
    createBook(input: $input) {
      _id
      title
      author
      publisher
      publishDate
      coverImage
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: bookInput!) {
    updateBook(_id: $id, input: $input) {
      _id
      title
      author
      publisher
      publishDate
      coverImage
    }
  }
`;
