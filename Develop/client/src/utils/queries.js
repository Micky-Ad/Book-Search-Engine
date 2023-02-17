import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query GET_ME {
    me {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
