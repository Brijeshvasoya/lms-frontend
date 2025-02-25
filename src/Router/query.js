import gql from "graphql-tag";

export const GET_USER = gql`
  query GetUser {
    GetUser {
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
      isBlocked
    }
  }
`;
