import gql from "graphql-tag";

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($userData: forgotPasswordInput!) {
    forgotPassword(userData: $userData) {
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
