import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateUser($userData: updateUserInput!) {
    updateUser(userData: $userData) {
      _id
      fname
      lname
      email
      dob
      age
      profilePicture
      role
    }
  }
`;
