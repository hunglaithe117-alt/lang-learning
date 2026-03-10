import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      refreshToken
      user {
        id
        email
        firstname
        lastname
        role
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($data: SignupInput!) {
    signup(data: $data) {
      accessToken
      refreshToken
      user {
        id
        email
        firstname
        lastname
        role
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: JWT!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

// ---- Notebooks ----

export const CREATE_NOTEBOOK = gql`
  mutation CreateNotebook($data: CreateNotebookInput!) {
    createNotebook(data: $data) {
      id
      title
      description
      language
      createdAt
    }
  }
`;

export const UPDATE_NOTEBOOK = gql`
  mutation UpdateNotebook($id: String!, $data: UpdateNotebookInput!) {
    updateNotebook(id: $id, data: $data)
  }
`;

export const DELETE_NOTEBOOK = gql`
  mutation DeleteNotebook($id: String!) {
    deleteNotebook(id: $id)
  }
`;

// ---- Documents ----

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: String!) {
    deleteDocument(id: $id)
  }
`;

// ---- Flashcards ----

export const REVIEW_FLASHCARD = gql`
  mutation ReviewFlashcard($id: String!, $quality: Int!) {
    reviewFlashcard(id: $id, quality: $quality) {
      id
      easeFactor
      interval
      repetitions
      nextReview
    }
  }
`;

export const DELETE_FLASHCARD = gql`
  mutation DeleteFlashcard($id: String!) {
    deleteFlashcard(id: $id)
  }
`;

// ---- Exercises ----

export const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer($exerciseId: String!, $answer: String!) {
    submitAnswer(exerciseId: $exerciseId, answer: $answer)
  }
`;
