# Real-Time Collaborative Document Editor

This project is a **Real-Time Collaborative Document Editor** that enables multiple users to work on the same document simultaneously. It incorporates advanced features such as AI-powered suggestions, version control, and real-time commenting. Below is an overview of the technologies used, their implementation, and key features.

---

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Key Features](#key-features)
3. [Implementation Details](#implementation-details)
4. [Challenges](#challenges)
5. [Future Improvements](#future-improvements)

---

## Technologies Used

### 1. **WebSocket API (Socket.IO)**
- **Purpose**: Real-time document collaboration.
- **Key Features**:
  - Bi-directional communication for text changes.
  - Presence tracking (active users).
  - Version control synchronization.
  - Real-time comment system updates.
- **Endpoints**:
  - `ws://localhost:3000` (WebSocket connection).
- **Events**:
  - `get-document`, `send-changes`, `save-document`, etc.

### 2. **Clerk Authentication API**
- **Purpose**: User management and authentication.
- **Key Features**:
  - JWT token verification.
  - User session management.
  - User profile data retrieval.
- **Endpoints**:
  - `https://api.clerk.dev/v1/tokens/verify` (Token verification).
  - `https://api.clerk.dev/v1/users/{user_id}` (User data retrieval).

### 3. **Groq AI API**
- **Purpose**: AI-powered features.
- **Key Features**:
  - Text suggestions and corrections.
  - Template generation.
  - Content analysis.
- **Endpoints**:
  - `https://api.groq.com/v1/chat/completions` (AI completions).
- **Models Used**:
  - `mixtral-8x7b-32768` (Primary LLM).

### 4. **Document Persistence API**
- **Purpose**: Document storage and versioning.
- **Endpoints**:
  - `POST /documents/{id}` - Save document.
  - `GET /documents/{id}` - Load document.
  - `GET /documents/{id}/versions` - Get version history.
  - `POST /comments` - Add comment (via WebSocket).

### 5. **Export APIs**
- **jsPDF**: Client-side PDF generation.
- **Blob API**: Native browser API for file creation.
- **File System Access API**: For "Save As" functionality.

### 6. **MongoDB Atlas API**
- **Purpose**: Data persistence.
- **Collections**:
  - `documents`: Stores document content and metadata.
  - `versions`: Document version history.
  - `comments`: Comment threads.

### 7. **React and Quill**
- **Purpose**: Frontend interface for the document editor.
- **Key Features**:
  - Rich text editing using Quill.
  - Real-time updates and AI suggestions.
  - Custom toolbar options.

### 8. **Readability Scoring**
- **Purpose**: Provide readability insights.
- **Key Features**:
  - Flesch Reading Ease Score.
  - Advanced vocabulary analysis.

---

## Key Features

1. **Real-Time Collaboration**:
   - Multiple users can edit the same document simultaneously.
   - Changes are synchronized in real-time using WebSocket.

2. **AI-Powered Features**:
   - Text suggestions, corrections, and template generation.
   - Real-time readability scoring.

3. **Version Control**:
   - Maintains a history of document versions.
   - Users can restore previous versions.

4. **Comment System**:
   - Users can add comments to documents.
   - Comments are saved and displayed in real-time.

5. **Export Functionality**:
   - Documents can be exported as PDF, Word, or plain text.

6. **Presence Tracking**:
   - Displays active users in the document.
   - Updates in real-time as users join or leave.

---

## Implementation Details

### WebSocket API (Socket.IO)
- **Rooms**: Each document has a dedicated room for isolating communication.
- **Active Users**: A `Map` is used to track users in real-time.
- **Events**:
  - `send-changes`: Broadcasts text changes to all users in the room.
  - `receive-changes`: Updates the document with changes from other users.
  - `save-document`: Persists the document state to the database.

### Clerk Authentication API
- **JWT Token Verification**: Tokens are verified on the server to authenticate users.
- **User Data Retrieval**: User details (e.g., name, profile picture) are fetched from Clerk.

### Groq AI API
- **Text Suggestions**: Real-time suggestions are displayed as the user types.
- **Template Generation**: Users can generate document templates using AI.

### Document Persistence API
- **MongoDB**: Used for storing documents, versions, and comments.
- **Version History**: Created whenever a user disconnects or manually saves the document.

### Export APIs
- **PDF Export**: Uses `jsPDF` for client-side PDF generation.
- **Word Export**: Uses the `Blob API` to create `.doc` files.
- **Plain Text Export**: Exports documents as `.txt` files.

### React and Quill
- **Quill Editor**: Integrated for rich text editing.
- **Custom Toolbar**: Configured for enhanced functionality.

### Readability Scoring
- **Flesch Score**: Calculated using a custom algorithm.
- **Advanced Scoring**: Penalizes documents with a high ratio of uncommon words.

---

## Challenges

1. **Real-Time Synchronization**:
   - Ensuring smooth performance with multiple users editing simultaneously.
   - Handling disconnections and reconnections gracefully.

2. **AI Integration**:
   - Managing API rate limits and costs.
   - Ensuring suggestions are relevant and context-aware.

3. **Database Management**:
   - Efficiently storing and retrieving large documents.
   - Managing version history without excessive database growth.

4. **Export Functionality**:
   - Ensuring consistent formatting across different export formats.
   - Handling large documents during export.

---

## Future Improvements

1. **Enhanced AI Features**:
   - Grammar and style checking.
   - Advanced content analysis.

2. **Offline Support**:
   - Allow users to edit documents offline and sync changes when online.

3. **Cloud Storage Integration**:
   - Integrate with services like Google Drive or Dropbox for document storage.

4. **Improved UI/UX**:
   - Add more customization options for the editor.
   - Enhance the comment system with mentions and replies.

5. **Multilingual Hivemind**:
   - Enable real-time collaboration across multiple languages.
   - Use AI to translate and synchronize edits between users writing in different languages.
   - Provide language-specific suggestions and corrections.

---

# API Documentation

This document provides an overview of the APIs used in the project, including their purposes, key features, and endpoints.

## WebSocket API (Socket.IO)

**Purpose:** Real-time document collaboration

**Key Features:**
- Bi-directional communication for text changes
- Presence tracking (active users)
- Version control synchronization
- Comment system updates

**Endpoints:**
- `ws://localhost:3000` (WebSocket connection)

**Events:**
- `get-document`
- `send-changes`
- `save-document`
- etc.

## Clerk Authentication API

**Purpose:** User management and authentication

**Key Features:**
- JWT token verification
- User session management
- User profile data retrieval

**Endpoints Used:**
- `https://api.clerk.dev/v1/tokens/verify` (Token verification)
- `https://api.clerk.dev/v1/users/{user_id}` (User data retrieval)

## Groq AI API

**Purpose:** AI-powered features

**Key Features:**
- Text suggestions/corrections
- Template generation
- Content analysis

**Endpoints Used:**
- `https://api.groq.com/v1/chat/completions` (AI completions)

**Models Used:**
- `mixtral-8x7b-32768` (Primary LLM)

## Document Persistence API

**Purpose:** Document storage and versioning

**Endpoints (Internal):**
- `POST /documents/{id}` - Save document
- `GET /documents/{id}` - Load document
- `GET /documents/{id}/versions` - Get version history
- `POST /comments` - Add comment (via WebSocket)

## Export APIs

- **jsPDF:** Client-side PDF generation
- **Blob API:** Native browser API for file creation
- **File System Access API:** (For "Save As" functionality)

## MongoDB Atlas API

**Purpose:** Data persistence

**Collections:**
- `documents`: Stores document content and metadata
- `versions`: Document version history
- `comments`: Comment threads

# Socket Documentation

| **Event Name**        | **Direction**    | **Data Structure** | **Description** |
|----------------------|----------------|--------------------|----------------|
| **Authentication** |
| `authenticate` | Client → Server | `{ token: string }` | Send Clerk JWT token for authorization. |
| **Document Management** |
| `get-all-documents` | Client → Server | `-` | Request a list of all documents. |
| `all-documents` | Server → Client | `Array<{ _id: string, name: string }>` | Returns a list of documents with IDs and names. |
| `get-document` | Client → Server | `{ documentId: string, documentName: string }` | Join a document room and request its content. |
| `load-document` | Server → Client | `Delta` | Sends the initial document content (Quill Delta format). |
| `send-changes` | Client → Server | `Delta` | Broadcast document edits to collaborators. |
| `receive-changes` | Server → Client | `Delta` | Receive edits from other collaborators. |
| `save-document` | Client → Server | `Delta` | Persist the document state to the database. |
| **Version Control** |
| `get-document-versions` | Client → Server | `-` | Request the document's version history. |
| `document-versions` | Server → Client | `Array<{ data: Delta, createdAt: Date, updatedBy: string }>` | Returns the document's version history. |
| **Comments** |
| `send-comment` | Client → Server | `{ documentId: string, text: string, createdAt: number, createdBy: string, userName: string }` | Post a new comment. |
| `receive-comment` | Server → Client | `Full comment object` | Broadcast a new comment to all users in the document. |
| `comments` | Server → Client | `Array<Comment>` | Sends the initial list of comments when joining the document. |
| **Presence** |
| `active-users` | Server → Client | `Array<{ userId: string, name: string, imageUrl: string }>` | List of users currently editing the document. |

---

## Conclusion

The **Real-Time Collaborative Document Editor** is a powerful tool that combines modern technologies to deliver a seamless and feature-rich user experience. It demonstrates the effective use of WebSocket, AI, and database technologies to solve real-world problems in document collaboration.