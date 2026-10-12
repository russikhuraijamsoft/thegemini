import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import dotenv from "dotenv";
import { getAdminAuthService, getAdminFirestoreService } from "./src/core/firebase/firebaseAdmin.js";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middlewares
  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Express server is running" });
  });

  // Example API route for Android app to communicate with
  app.post("/api/data", (req, res) => {
    const data = req.body;
    console.log("Received data from client (Android):", data);
    res.json({ 
      status: "success", 
      message: "Data received successfully by Express service",
      receivedData: data
    });
  });

  // Endpoint for Android app to verify Firebase ID token and login
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ error: "No idToken provided" });
      }

      const adminAuth = getAdminAuthService();
      // Verify the token
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      
      console.log(`User logged in from Android: ${decodedToken.uid}`);
      
      // Optionally fetch user profile from Firestore
      const adminDb = getAdminFirestoreService();
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;

      res.json({
        status: "success",
        message: "Token verified successfully",
        uid: decodedToken.uid,
        user: userData
      });
    } catch (error) {
      console.error("Error verifying ID token:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  // Example API route demonstrating Firebase Admin usage
  app.get("/api/users", async (req, res) => {
    try {
      res.json({
        status: "success",
        message: "This is where you would return users using Firebase Admin",
        users: []
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development (serves the React frontend)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
