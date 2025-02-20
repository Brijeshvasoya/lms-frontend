import gql from "graphql-tag";

export const GET_WISHLIST = gql`
  query wishlists {
    wishlists {
      _id
      book {
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
