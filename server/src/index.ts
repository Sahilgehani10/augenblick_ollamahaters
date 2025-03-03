import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { getAllDocuments, findOrCreateDocument, updateDocument,getDocumentVersions,createVersionOnDisconnect } from "./controllers/documentController";
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});


const PORT = Number(process.env.PORT || 3000);

/** Connect to MongoDB */
mongoose.connect(process.env.DATABASE_URL || "", { dbName: "Google-Docs" })
  .then(() => { console.log("Database connected."); })
  .catch((error) => { console.log("DB connection failed. " + error); });

// Define ActiveUser interface
interface ActiveUser {
  userId: string;
  name: string;
  imageUrl: string;
}

// Use a Map to track active users per document (documentId -> Map<userId, ActiveUser>)
const activeUsers = new Map<string, Map<string, ActiveUser>>();

function updateActiveUsers(documentId: string, user: ActiveUser, isJoining: boolean) {
  if (!activeUsers.has(documentId)) {
    activeUsers.set(documentId, new Map());
  }

  const usersMap = activeUsers.get(documentId)!;

  if (isJoining) {
    usersMap.set(user.userId, user);
  } else {
    usersMap.delete(user.userId);
  }

  // Emit the updated list of active users
  const usersArray = Array.from(usersMap.values());
  console.log(`Emitting active users for document ${documentId}:`, usersArray); // Log the data being emitted
  io.to(documentId).emit("active-users", usersArray);
}



const io = new Server(PORT, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);
  let currentDocumentId: string | null = null;
  let currentUser: ActiveUser | null = null;
  let hasChanges = false;

  // Authenticate user
  socket.on("authenticate", async (token: string) => {
    try {
      const decoded = await clerk.verifyToken(token);
      const user = await clerk.users.getUser(decoded.sub);
    console.log("Fetched user details:", user);

    currentUser = {
      userId: decoded.sub,
      name: `${user.firstName} ${user.lastName}`.trim() || "Anonymous",
      imageUrl: user.imageUrl || "",
    };
      
      console.log("User authenticated:", currentUser);

      // If already joined a document, update the active users list
      if (currentDocumentId && currentUser) {
        updateActiveUsers(currentDocumentId, currentUser, true);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  });
  
  // Handle fetching all documents
  socket.on('get-all-documents', async () => {
    try {
      const allDocuments = await getAllDocuments();
      socket.emit('all-documents', allDocuments);
    } catch (error) {
      console.error('Error fetching all documents:', error);
      socket.emit('all-documents', []);
    }
  });
  
  // Handle joining a document
  socket.on("get-document", async ({ documentId, documentName }) => {
    try {
      // Save the documentId in the socket object
      socket.data.documentId = documentId;
      socket.join(documentId);
      console.log(`[get-document] Socket ${socket.id} joined document ${documentId}`);
  
      // Initialize or find the document
      const document = await findOrCreateDocument({ documentId, documentName });
      if (document) {
        socket.emit("load-document", document.data);
      }
  
      // Update active users if the user is authenticated
      if (currentUser) {
        updateActiveUsers(documentId, currentUser, true);
      }
  
      // Listen for changes and broadcast them
      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
        hasChanges=true;
      });
  
      // Listen for save-document event and update the document
      socket.on("save-document", async (data) => {
        if (currentUser) {
          await updateDocument(documentId, data);
          hasChanges=false;
        }
      });
    } catch (error) {
      console.error("Document error:", error);
    }
  });
  socket.on("get-document-versions", async () => {
    try {
      // Retrieve documentId from the socket object
      const documentId = socket.data.documentId;
      if (!documentId) {
        console.error(`[get-document-versions] Document ID not found for socket: ${socket.id}`);
        throw new Error("Document ID not found");
      }
  
      console.log(`[get-document-versions] Fetching versions for document ${documentId}`);
      const versions = await getDocumentVersions(documentId);
  
      console.log(`[get-document-versions] Sending ${versions.length} versions to socket ${socket.id}`);
      socket.emit("document-versions", versions);
    } catch (error) {
      console.error("Error fetching document versions:", error);
      socket.emit("document-versions", []);
    }
  });

  // Handle disconnection and update active users list
  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);

    const documentId = socket.data.documentId;
    if (documentId && currentUser && hasChanges) {
      console.log(`Creating a new version for document ${documentId}...`);
      await createVersionOnDisconnect(documentId, currentUser.userId);
    }

    // Update active users list
    if (documentId && currentUser) {
      updateActiveUsers(documentId, currentUser, false);
    }
  });
});
