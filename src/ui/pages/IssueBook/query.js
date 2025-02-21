import gql from "graphql-tag";

export const GET_BOOK = gql`
  query Book($id: ID!) {
    book(_id: $id) {
      _id
      title
      author
      publisher
      publishDate
      coverImage
    }
  }
`;
