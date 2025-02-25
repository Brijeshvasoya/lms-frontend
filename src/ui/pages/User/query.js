import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query users($searchTerm: String) {
    users(searchTerm: $searchTerm) {
      _id
      fname
      lname
      email
      age
      dob
      role
      isVerified
      isDeleted
      profilePicture
      totalPenalty
    }
  }
`;
