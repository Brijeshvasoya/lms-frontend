import { gql } from "@apollo/client";

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($verifyUserId: ID!) {
    verifyUser(id: $verifyUserId)
  }
`;

export const DEACTIVE_USER = gql`
  mutation DeactiveUser($deactiveUserId: ID!) {
    deactiveUser(id: $deactiveUserId)
  }
`;