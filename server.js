const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const fs = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 4000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(ROOT_DIR));

async function ensureStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(POSTS_FILE);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(POSTS_FILE, "[]", "utf-8");
    } else {
      throw err;
    }
  }
}

async function readPosts() {
  await ensureStorage();
  const data = await fs.readFile(POSTS_FILE, "utf-8");
  return JSON.parse(data);
}

async function writePosts(posts) {
  await ensureStorage();
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

app.get("/api/posts", async (req, res) => {
  try {
    // Prevent caching to ensure fresh data across devices
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const posts = await readPosts();
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(posts);
  } catch (err) {
    console.error("Failed to read posts", err);
    res.status(500).json({ message: "Unable to load posts right now." });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      foodName, // For backward compatibility
      foods, // New: array of foods
      qty,
      expire,
      location,
      imageData, // For backward compatibility
      additionalImages // New: array of additional images
    } = req.body || {};

    // Support both old format (foodName) and new format (foods array)
    let foodsArray = [];
    if (foods && Array.isArray(foods) && foods.length > 0) {
      foodsArray = foods;
    } else if (foodName) {
      // Backward compatibility: convert single foodName to foods array
      foodsArray = [{
        name: foodName,
        image: imageData || null
      }];
    }

    if (!donorName || !donorEmail || foodsArray.length === 0 || !qty || !expire || !location) {
      return res.status(400).json({ message: "All fields are required, including at least one food." });
    }

    const newPost = {
      id: uuid(),
      donorName,
      donorEmail,
      foods: foodsArray, // Always store as array
      foodName: foodsArray[0].name, // Keep for backward compatibility with receiver view
      qty,
      expire,
      location,
      imageData: foodsArray[0].image || imageData || null, // Keep for backward compatibility
      additionalImages: additionalImages || [],
      status: "pending",
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      createdAt: new Date().toISOString()
    };

    const posts = await readPosts();
    posts.push(newPost);
    await writePosts(posts);

    // Prevent caching
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Failed to create post", err);
    res.status(500).json({ message: "Unable to save post right now." });
  }
});

app.patch("/api/posts/:id", async (req, res) => {
  try {
    // Prevent caching
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const posts = await readPosts();
    const index = posts.findIndex((post) => post.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Post not found." });
    }

    const post = posts[index];
    const { status, receiverName, otpCode } = req.body || {};

    if (status === "accepted") {
      if (!receiverName || !otpCode) {
        return res.status(400).json({ message: "Receiver name and OTP are required." });
      }

      if (otpCode !== post.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      post.status = "accepted";
      post.receiverName = receiverName;
      post.acceptedAt = new Date().toISOString();
    } else if (status === "declined") {
      post.status = "declined";
      post.receiverName = receiverName || null;
      post.declinedAt = new Date().toISOString();
    } else {
      return res.status(400).json({ message: "Unknown status update." });
    }

    posts[index] = post;
    await writePosts(posts);

    res.json(post);
  } catch (err) {
    console.error("Failed to update post", err);
    res.status(500).json({ message: "Unable to update post right now." });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const posts = await readPosts();
    const updated = posts.filter((post) => post.id !== req.params.id);

    if (posts.length === updated.length) {
      return res.status(404).json({ message: "Post not found." });
    }

    await writePosts(updated);
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete post", err);
    res.status(500).json({ message: "Unable to delete post right now." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`FoodBridge API running on http://localhost:${PORT}`);
});

