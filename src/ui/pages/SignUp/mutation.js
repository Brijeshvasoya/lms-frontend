import gql from "graphql-tag";

export const SIGN_UP = gql`
  mutation CreateUser($input: userInput!) {
    createUser(input: $input) {
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
