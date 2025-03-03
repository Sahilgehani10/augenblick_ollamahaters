import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { getAllDocuments, findOrCreateDocument, updateDocument } from "./controllers/documentController";
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
    console.log(`User ${user.name} joined document ${documentId}. Active users count: ${usersMap.size}`);
  } else {
    usersMap.delete(user.userId);
    console.log(`User ${user.name} left document ${documentId}. Active users count: ${usersMap.size}`);
  }
  
  io.to(documentId).emit("active-users", Array.from(usersMap.values()));
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
      currentDocumentId = documentId;
      socket.join(documentId);
      console.log(`Socket ${socket.id} joined document ${documentId}`);

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
      });

      // Listen for save-document event and update the document
      socket.on("save-document", async (data) => {
        await updateDocument(documentId, { data });
      });
    } catch (error) {
      console.error("Document error:", error);
    }
  });

  // Handle disconnection and update active users list
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    if (currentDocumentId && currentUser) {
      updateActiveUsers(currentDocumentId, currentUser, false);
    }
  });
});
