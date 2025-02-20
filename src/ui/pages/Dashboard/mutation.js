import gql from "graphql-tag";

export const ADD_WISH_LIST = gql`
mutation AddToWishlist($input: wishlistInput!) {
  addToWishlist(input: $input) {
    _id
    user {
      fname
      lname
    }
    book {
      _id
    }
  }
}
`;