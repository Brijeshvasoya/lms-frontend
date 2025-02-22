import gql from "graphql-tag";

export const GET_USER_BOOKS = gql`
query StudentBookIssuers($studentid: ID!) {
  studentBookIssuers(studentid: $studentid) {
    _id
    bookid {
      title
      author
      publisher
      publishDate
      coverImage
    }
    studentid {
      fname
      lname
    }
    issuedDate
    bookToBeReturned
    returnDate
    isReturned
    panalty
  }
}
`;