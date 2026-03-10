import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstname
      lastname
      role
      createdAt
    }
  }
`;

export const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts($query: String, $orderBy: PostOrder) {
    publishedPosts(query: $query, orderBy: $orderBy) {
      edges {
        node {
          id
          title
          content
          published
          createdAt
          author {
            id
            firstname
            lastname
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// ---- Notebooks ----

export const GET_MY_NOTEBOOKS = gql`
  query GetMyNotebooks {
    myNotebooks {
      id
      title
      description
      language
      userId
      createdAt
      updatedAt
    }
  }
`;

export const GET_NOTEBOOK = gql`
  query GetNotebook($id: String!) {
    notebook(id: $id) {
      id
      title
      description
      language
      createdAt
    }
  }
`;

// ---- Documents ----

export const GET_NOTEBOOK_DOCUMENTS = gql`
  query GetNotebookDocuments($notebookId: String!) {
    notebookDocuments(notebookId: $notebookId) {
      id
      filename
      originalName
      mimeType
      size
      language
      isProcessed
      chunksCount
      createdAt
    }
  }
`;

export const GET_DOCUMENT = gql`
  query GetDocument($id: String!) {
    document(id: $id) {
      id
      filename
      originalName
      mimeType
      size
      language
      isProcessed
      chunksCount
      createdAt
    }
  }
`;

// ---- Flashcards ----

export const GET_MY_FLASHCARDS = gql`
  query GetMyFlashcards {
    myFlashcards {
      id
      front
      back
      easeFactor
      interval
      repetitions
      nextReview
      documentId
      createdAt
    }
  }
`;

export const GET_DUE_FLASHCARDS = gql`
  query GetDueFlashcards {
    dueFlashcards {
      id
      front
      back
      easeFactor
      interval
      repetitions
      nextReview
    }
  }
`;

// ---- Exercises ----

export const GET_MY_EXERCISES = gql`
  query GetMyExercises {
    myExercises {
      id
      type
      question
      options
      answer
      explanation
      difficulty
      documentId
      createdAt
    }
  }
`;

export const GET_DOCUMENT_EXERCISES = gql`
  query GetDocumentExercises($documentId: String!) {
    documentExercises(documentId: $documentId) {
      id
      type
      question
      options
      answer
      explanation
      difficulty
    }
  }
`;
