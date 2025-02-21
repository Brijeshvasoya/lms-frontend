import gql from "graphql-tag";

export const RETURN_BOOK = gql`
mutation ReturnBook($input: returnBookInput!) {
  returnBook(input: $input)
}
`;