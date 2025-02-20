import { gql } from "@apollo/client";

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($id: ID!) {
    removeFromWishlist(_id: $id)
  }
`;
