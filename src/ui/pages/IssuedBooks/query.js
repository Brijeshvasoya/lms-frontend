import gql from "graphql-tag";

export const GET_ISSUED_BOOKS = gql`
  query BookIssuer {
    BookIssuer {
      _id
      bookToBeReturned
      bookid {
        _id
        title
        author
        publisher
        publishDate
        coverImage
      }
    }
  }
`;
