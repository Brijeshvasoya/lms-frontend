import gql from "graphql-tag";

export const GET_HISTORY = gql`
  query UserHistory {
    userHistory {
      _id
      totalIssuedBooks
      totalPenalty
      totalPendingBooks
      totalReturnedBooks
      totalLateReturnedBooks
      issuedBooksDetails {
        bookid
        title
        returnDays
        issuedDate
        bookToBeReturned
        returnDate
        isReturned
        penalty
      }
    }
  }
`;
