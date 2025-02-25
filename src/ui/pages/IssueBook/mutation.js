import gql from "graphql-tag";

export const ISSUE_BOOK = gql`
mutation IssueBook($input: issueBookInput!) {
  issueBook(input: $input) {
    _id
    bookid {
      _id
      title
      author
      publisher
      publishDate
      coverImage
    }
    studentid {
      _id
      fname
      lname
    }
    returnDays
    issuedDate
    bookToBeReturned
    returnDate
    isReturned
    penalty
  }
}
`;