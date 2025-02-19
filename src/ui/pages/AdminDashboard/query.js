import gql from "graphql-tag";

export const GET_BOOKS = gql`
  query Books {
    books {
      _id
      title
      author
      publisher
      publishDate
      coverImage
    }
  }
`;
