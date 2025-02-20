import gql from "graphql-tag";

export const GET_WISHLIST = gql`
  query wishlists {
    wishlists {
      book {
        _id
      }
    }
  }
`;
