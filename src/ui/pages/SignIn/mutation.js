import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignInUser($userData: signinUserInput!) {
    signInUser(userData: $userData) {
      token
      user {
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
  }
`;
