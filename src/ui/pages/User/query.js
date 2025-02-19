import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($searchTerm: String) {
    users(searchTerm: $searchTerm) {
      _id
      fname
      lname
      email
      password
      age
      dob
      role
      isVerified
      isDeleted
      profilePicture
    }
  }
`;
