import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Initializing database...");
const db = new Database("foodappi.db");
db.pragma('foreign_keys = ON');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    status TEXT DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS kitchens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    branch_id INTEGER,
    status TEXT DEFAULT 'Active',
    FOREIGN KEY (branch_id) REFERENCES branches(id)
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    tax REAL DEFAULT 0,
    image TEXT,
    item_type TEXT DEFAULT 'Veg', -- 'Veg', 'Non Veg'
    is_featured BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'Active', -- 'Active', 'Inactive'
    caution TEXT,
    options TEXT, -- JSON string for variations, extras, addons
    kitchen_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (kitchen_id) REFERENCES kitchens(id)
  );

  CREATE TABLE IF NOT EXISTS branches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    address TEXT,
    latitude REAL,
    longitude REAL,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_uid TEXT,
    branch_id INTEGER,
    total_amount REAL,
    subtotal REAL,
    discount REAL DEFAULT 0,
    vat REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    order_type TEXT, -- 'delivery', 'takeaway', 'pos'
    payment_method TEXT,
    received_amount REAL,
    change_amount REAL,
    transaction_id TEXT,
    address TEXT,
    token_no TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    item_id INTEGER,
    quantity INTEGER,
    price REAL,
    variations TEXT, -- JSON string for selected options
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (item_id) REFERENCES items(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT UNIQUE,
    name TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    whatsapp TEXT,
    wallet_balance REAL DEFAULT 0,
    profile_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    label TEXT, -- 'Home', 'Work', etc.
    address TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    is_default BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
  );

  CREATE TABLE IF NOT EXISTS dining_tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch_id INTEGER,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Active', -- 'Active', 'Inactive'
    is_occupied BOOLEAN DEFAULT 0,
    qr_code TEXT,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
  );
`);

console.log("Database initialized.");

// Add missing columns to existing tables
const migrations = [
  "ALTER TABLE branches ADD COLUMN email TEXT UNIQUE",
  "ALTER TABLE branches ADD COLUMN password TEXT",
  "ALTER TABLE branches ADD COLUMN latitude REAL",
  "ALTER TABLE branches ADD COLUMN longitude REAL",
  "ALTER TABLE addresses ADD COLUMN latitude REAL",
  "ALTER TABLE addresses ADD COLUMN longitude REAL",
  "ALTER TABLE orders ADD COLUMN table_id INTEGER REFERENCES dining_tables(id)",
  "ALTER TABLE users ADD COLUMN email TEXT UNIQUE",
  "ALTER TABLE users ADD COLUMN phone TEXT UNIQUE",
  "ALTER TABLE users ADD COLUMN whatsapp TEXT",
  "ALTER TABLE users ADD COLUMN wallet_balance REAL DEFAULT 0",
  "ALTER TABLE users ADD COLUMN profile_image TEXT",
  "ALTER TABLE users ADD COLUMN first_name TEXT",
  "ALTER TABLE users ADD COLUMN last_name TEXT",
  "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'",
  "ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1",
  "ALTER TABLE items ADD COLUMN kitchen_id INTEGER REFERENCES kitchens(id)"
];

for (const migration of migrations) {
  try {
    db.exec(migration);
  } catch (e) {
    // Column already exists or other error
  }
}

console.log("Seeding data...");
// Seed admin user if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get("amytzee@gmail.com");
if (!adminExists) {
  db.prepare("INSERT INTO users (name, email, phone, whatsapp) VALUES (?, ?, ?, ?)")
    .run("Admin", "amytzee@gmail.com", "0687225353", "0687225353");
}

// Seed data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  db.prepare("INSERT INTO categories (name, image) VALUES (?, ?)").run("Burgers", "https://picsum.photos/seed/burger/200/200");
  db.prepare("INSERT INTO categories (name, image) VALUES (?, ?)").run("Pizza", "https://picsum.photos/seed/pizza/200/200");
  db.prepare("INSERT INTO categories (name, image) VALUES (?, ?)").run("Drinks", "https://picsum.photos/seed/drink/200/200");
  
  db.prepare("INSERT INTO items (category_id, name, description, price, image, item_type, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(1, "Classic Beef Burger", "Juicy beef patty with lettuce and tomato", 8.50, "https://picsum.photos/seed/beefburger/400/300", "Non Veg", 1);
  db.prepare("INSERT INTO items (category_id, name, description, price, image, item_type, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(1, "Veggie Delight", "Plant-based patty with avocado", 9.00, "https://picsum.photos/seed/vegburger/400/300", "Veg", 1);
  db.prepare("INSERT INTO items (category_id, name, description, price, image, item_type, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(2, "Margherita Pizza", "Fresh mozzarella and basil", 12.00, "https://picsum.photos/seed/margherita/400/300", "Veg", 0);
    
  db.prepare("INSERT INTO branches (name, address) VALUES (?, ?)").run("Main Branch", "123 Food St, Dar es Salaam");
  db.prepare("INSERT INTO branches (name, address) VALUES (?, ?)").run("City Center", "456 Market Rd, Arusha");
}

console.log("Starting server...");
async function startServer() {
  const app = express();
  app.use(express.json());
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'cart_update') {
          broadcast({ type: 'cart_update', cart: data.cart, subtotal: data.subtotal, total: data.total, discount: data.discount });
        }
      } catch (e) {}
    });
  });

  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  app.locals.broadcast = broadcast;

  // Dining Tables API
  app.get("/api/admin/dining-tables", (req, res) => {
    const branchId = req.query.branchId;
    const where = branchId ? "WHERE branch_id = ?" : "";
    const params = branchId ? [branchId] : [];
    const tables = db.prepare(`
      SELECT t.*, b.name as branch_name 
      FROM dining_tables t 
      LEFT JOIN branches b ON t.branch_id = b.id
      ${where}
    `).all(...params);
    res.json(tables);
  });

  app.get("/api/dining-tables/branch/:branchId", (req, res) => {
    const tables = db.prepare("SELECT * FROM dining_tables WHERE branch_id = ? AND status = 'Active'").all(req.params.branchId);
    res.json(tables);
  });

  app.post("/api/admin/dining-tables", express.json(), (req, res) => {
    const { branch_id, name, capacity, status, qr_code } = req.body;
    
    // Check if branch exists
    const branch = db.prepare("SELECT id FROM branches WHERE id = ?").get(branch_id);
    if (!branch) {
      return res.status(400).json({ error: "Invalid branch selected" });
    }

    const result = db.prepare("INSERT INTO dining_tables (branch_id, name, capacity, status, qr_code) VALUES (?, ?, ?, ?, ?)")
      .run(branch_id, name, capacity, status, qr_code);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/admin/dining-tables/:id", express.json(), (req, res) => {
    const { branch_id, name, capacity, status, qr_code, is_occupied } = req.body;

    // Check if branch exists
    const branch = db.prepare("SELECT id FROM branches WHERE id = ?").get(branch_id);
    if (!branch) {
      return res.status(400).json({ error: "Invalid branch selected" });
    }

    db.prepare("UPDATE dining_tables SET branch_id = ?, name = ?, capacity = ?, status = ?, qr_code = ?, is_occupied = ? WHERE id = ?")
      .run(branch_id, name, capacity, status, qr_code, is_occupied ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/dining-tables/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM dining_tables WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(400).json({ error: "Cannot delete table because it has associated orders. Please deactivate it instead." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Update table occupancy status
  app.patch("/api/admin/dining-tables/:id/occupancy", express.json(), (req, res) => {
    const { is_occupied } = req.body;
    db.prepare("UPDATE dining_tables SET is_occupied = ? WHERE id = ?").run(is_occupied ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  const PORT = 3000;

  // API Routes
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/items", (req, res) => {
    const { categoryId, featured } = req.query;
    let query = "SELECT * FROM items";
    const params = [];
    
    if (categoryId || featured) {
      query += " WHERE";
      if (categoryId) {
        query += " category_id = ?";
        params.push(categoryId);
      }
      if (featured) {
        if (categoryId) query += " AND";
        query += " is_featured = 1";
      }
    }
    
    const items = db.prepare(query).all(...params);
    res.json(items);
  });

  app.get("/api/branches", (req, res) => {
    const branches = db.prepare("SELECT * FROM branches WHERE is_active = 1").all();
    res.json(branches);
  });

  // User Auth Mapping
  app.post("/api/auth/register-metadata", (req, res) => {
    const { uid, name, email, phone, whatsapp } = req.body;
    try {
      db.prepare("INSERT INTO users (uid, name, email, phone, whatsapp) VALUES (?, ?, ?, ?, ?)")
        .run(uid, name, email, phone, whatsapp);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/lookup", (req, res) => {
    const { identifier } = req.body;
    // Lookup by email, phone, or name
    const user = db.prepare("SELECT email FROM users WHERE email = ? OR phone = ? OR name = ?")
      .get(identifier, identifier, identifier) as { email: string } | undefined;
    
    if (user) {
      res.json({ email: user.email });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.get("/api/user/profile/:uid", (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE uid = ?").get(req.params.uid);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.patch("/api/user/profile/:uid/image", (req, res) => {
    const { profile_image } = req.body;
    db.prepare("UPDATE users SET profile_image = ? WHERE uid = ?").run(profile_image, req.params.uid);
    res.json({ success: true });
  });

  app.put("/api/user/profile/:uid", (req, res) => {
    const { first_name, last_name, phone } = req.body;
    db.prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, name = ? WHERE uid = ?")
      .run(first_name, last_name, phone, `${first_name} ${last_name}`, req.params.uid);
    res.json({ success: true });
  });

  // Addresses API
  app.get("/api/user/addresses/:uid", (req, res) => {
    const addresses = db.prepare("SELECT * FROM addresses WHERE uid = ? ORDER BY created_at DESC").all(req.params.uid);
    res.json(addresses);
  });

  app.post("/api/user/addresses/:uid", (req, res) => {
    const { label, address, is_default } = req.body;
    
    // Check if user exists
    const user = db.prepare("SELECT id FROM users WHERE uid = ?").get(req.params.uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (is_default) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE uid = ?").run(req.params.uid);
    }
    const result = db.prepare("INSERT INTO addresses (uid, label, address, is_default) VALUES (?, ?, ?, ?)")
      .run(req.params.uid, label, address, is_default ? 1 : 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/user/addresses/:id", (req, res) => {
    db.prepare("DELETE FROM addresses WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/user/orders/:uid", (req, res) => {
    const orders = db.prepare(`
      SELECT o.*, u.name as customer_name, u.phone as customer_phone 
      FROM orders o 
      JOIN users u ON o.customer_uid = u.uid 
      WHERE o.customer_uid = ? 
      ORDER BY o.created_at DESC
    `).all(req.params.uid);
    res.json(orders);
  });

  app.post("/api/orders", (req, res) => {
    let { 
      customer_name, 
      customer_phone, 
      customer_uid,
      branch_id, 
      total_amount, 
      subtotal,
      discount,
      vat,
      order_type, 
      payment_method,
      received_amount,
      change_amount,
      transaction_id,
      address,
      table_id,
      items 
    } = req.body;
    
    // Ensure branch_id is a valid integer. If not provided or empty, use the first branch.
    if (!branch_id || branch_id === '') {
      const firstBranch = db.prepare("SELECT id FROM branches LIMIT 1").get() as { id: number } | undefined;
      branch_id = firstBranch?.id;
    }

    if (!branch_id) {
      return res.status(400).json({ error: "No branch available to fulfill order" });
    }

    // Check if table exists if provided
    if (table_id) {
      const table = db.prepare("SELECT id FROM dining_tables WHERE id = ?").get(table_id);
      if (!table) {
        table_id = null; // Reset if invalid
      }
    }

    const token_no = Math.floor(100 + Math.random() * 900).toString();
    
    try {
      const info = db.prepare(`
        INSERT INTO orders (
          customer_name, customer_phone, customer_uid, branch_id, total_amount, 
          subtotal, discount, vat, order_type, payment_method, 
          received_amount, change_amount, transaction_id, address, token_no, table_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        customer_name, customer_phone, customer_uid, branch_id, total_amount,
        subtotal || total_amount, discount || 0, vat || 0, order_type, payment_method || 'cash',
        received_amount || 0, change_amount || 0, transaction_id || null, address || null, token_no, table_id || null
      );
      
      const orderId = info.lastInsertRowid;
      
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, item_id, quantity, price, variations)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const item of items) {
        // Double check item exists to avoid FK error
        const itemExists = db.prepare("SELECT id FROM items WHERE id = ?").get(item.id);
        if (itemExists) {
          insertItem.run(orderId, item.id, item.quantity, item.price, JSON.stringify(item.selectedOptions || item.variations || {}));
        } else {
          console.warn(`Item ID ${item.id} not found, skipping from order.`);
        }
      }
      
      res.json({ success: true, orderId, token_no });
    } catch (error: any) {
      console.error("Order placement error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/stats", (req, res) => {
    const branchId = req.query.branchId;
    const where = branchId ? "WHERE branch_id = ?" : "";
    const params = branchId ? [branchId] : [];

    const totalSales = db.prepare(`SELECT SUM(total_amount) as total FROM orders ${where}`).get(...params) as { total: number };
    const totalOrders = db.prepare(`SELECT COUNT(*) as count FROM orders ${where}`).get(...params) as { count: number };
    const totalCustomers = db.prepare(`SELECT COUNT(DISTINCT customer_phone) as count FROM orders ${where}`).get(...params) as { count: number };
    const totalItems = db.prepare("SELECT COUNT(*) as count FROM items").get() as { count: number };
    const totalBranches = db.prepare("SELECT COUNT(*) as count FROM branches").get() as { count: number };
    const totalKitchens = db.prepare("SELECT COUNT(*) as count FROM kitchens").get() as { count: number };
    
    const statusStats = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      ${where}
      GROUP BY status
    `).all(...params) as { status: string, count: number }[];

    const salesSummary = db.prepare(`
      SELECT strftime('%Y-%m-%d', created_at) as date, SUM(total_amount) as total
      FROM orders
      WHERE created_at >= date('now', '-30 days') ${branchId ? "AND branch_id = ?" : ""}
      GROUP BY date
      ORDER BY date ASC
    `).all(...params);

    const hourlyStats = db.prepare(`
      SELECT strftime('%H:00', created_at) as hour, COUNT(*) as count
      FROM orders
      WHERE created_at >= date('now', '-1 day') ${branchId ? "AND branch_id = ?" : ""}
      GROUP BY hour
      ORDER BY hour ASC
    `).all(...params);

    const topCustomers = db.prepare(`
      SELECT customer_name, customer_phone, COUNT(*) as order_count
      FROM orders
      ${where}
      GROUP BY customer_phone
      ORDER BY order_count DESC
      LIMIT 5
    `).all(...params);

    const popularItems = db.prepare(`
      SELECT i.name, i.price, c.name as category, COUNT(oi.id) as order_count, i.image
      FROM items i
      JOIN order_items oi ON i.id = oi.item_id
      JOIN categories c ON i.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      ${branchId ? "WHERE o.branch_id = ?" : ""}
      GROUP BY i.id
      ORDER BY order_count DESC
      LIMIT 6
    `).all(...params);

    const featuredItems = db.prepare("SELECT * FROM items WHERE is_featured = 1 LIMIT 8").all();
    
    res.json({
      overview: {
        totalSales: totalSales.total || 0,
        totalOrders: totalOrders.count,
        totalCustomers: totalCustomers.count,
        totalItems: totalItems.count,
        totalBranches: totalBranches.count,
        totalKitchens: totalKitchens.count
      },
      statusStats,
      salesSummary,
      hourlyStats,
      topCustomers,
      popularItems,
      featuredItems,
      recentOrders: db.prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT 5`).all(...params)
    });
  });

  // Admin Orders
  app.get("/api/admin/orders", (req, res) => {
    const branchId = req.query.branchId;
    const type = req.query.type;
    let where = [];
    let params = [];
    
    if (branchId) {
      where.push("o.branch_id = ?");
      params.push(branchId);
    }
    if (type) {
      where.push("o.order_type = ?");
      params.push(type);
    }
    
    const whereClause = where.length > 0 ? "WHERE " + where.join(" AND ") : "";
    
    const orders = db.prepare(`
      SELECT o.*, b.name as branch_name 
      FROM orders o 
      LEFT JOIN branches b ON o.branch_id = b.id 
      ${whereClause}
      ORDER BY o.created_at DESC
    `).all(...params);
    res.json(orders);
  });

  app.get("/api/admin/orders/:id", (req, res) => {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    const items = db.prepare(`
      SELECT oi.*, i.name as item_name, i.image as item_image 
      FROM order_items oi 
      JOIN items i ON oi.item_id = i.id 
      WHERE oi.order_id = ?
    `).all(req.params.id);
    
    res.json({ ...order, items });
  });

  app.patch("/api/admin/orders/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    
    // Broadcast status update for OSS
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get() as any;
    req.app.locals.broadcast({ type: 'order_status_update', orderId: req.params.id, status, token_no: order?.token_no });
    
    res.json({ success: true });
  });

  // Admin Items
  app.get("/api/admin/items", (req, res) => {
    const items = db.prepare(`
      SELECT i.*, c.name as category_name 
      FROM items i 
      LEFT JOIN categories c ON i.category_id = c.id
    `).all();
    res.json(items);
  });

  app.post("/api/admin/items", (req, res) => {
    const { name, description, price, tax, image, category_id, item_type, is_featured, status, caution, options } = req.body;
    
    // Check if category exists
    const category = db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id);
    if (!category) {
      return res.status(400).json({ error: "Invalid category selected" });
    }

    const info = db.prepare(`
      INSERT INTO items (name, description, price, tax, image, category_id, item_type, is_featured, status, caution, options)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, price, tax || 0, image, category_id, item_type || 'Veg', is_featured ? 1 : 0, status || 'Active', caution, JSON.stringify(options || {}));
    res.json({ success: true, id: info.lastInsertRowid });
  });

  app.put("/api/admin/items/:id", (req, res) => {
    const { name, description, price, tax, image, category_id, item_type, is_featured, status, caution, options } = req.body;

    // Check if category exists
    const category = db.prepare("SELECT id FROM categories WHERE id = ?").get(category_id);
    if (!category) {
      return res.status(400).json({ error: "Invalid category selected" });
    }

    db.prepare(`
      UPDATE items 
      SET name = ?, description = ?, price = ?, tax = ?, image = ?, category_id = ?, item_type = ?, is_featured = ?, status = ?, caution = ?, options = ?
      WHERE id = ?
    `).run(name, description, price, tax || 0, image, category_id, item_type || 'Veg', is_featured ? 1 : 0, status || 'Active', caution, JSON.stringify(options || {}), req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/items/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(400).json({ error: "Cannot delete item because it is part of existing orders. You should deactivate it instead." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/auth/branch-login", (req, res) => {
    const { email, password } = req.body;
    const branch = db.prepare("SELECT * FROM branches WHERE email = ? AND password = ?").get(email, password);
    if (branch) {
      res.json({ success: true, branch });
    } else {
      res.status(401).json({ success: false, message: "Invalid branch credentials" });
    }
  });

  // Admin Categories
  app.get("/api/admin/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.post("/api/admin/categories", (req, res) => {
    const { name, image, status } = req.body;
    const info = db.prepare("INSERT INTO categories (name, image, status) VALUES (?, ?, ?)").run(name, image, status || 'Active');
    res.json({ success: true, id: info.lastInsertRowid });
  });

  app.put("/api/admin/categories/:id", (req, res) => {
    const { name, image, status } = req.body;
    db.prepare("UPDATE categories SET name = ?, image = ?, status = ? WHERE id = ?").run(name, image, status || 'Active', req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/categories/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(400).json({ error: "Cannot delete category because it has associated items. Please delete the items first." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Admin Branches
  app.get("/api/admin/branches", (req, res) => {
    const branches = db.prepare("SELECT * FROM branches").all();
    res.json(branches);
  });

  app.post("/api/admin/branches", (req, res) => {
    const { name, address, email, password, latitude, longitude, is_active } = req.body;
    const info = db.prepare("INSERT INTO branches (name, address, email, password, latitude, longitude, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)").run(name, address, email, password, latitude, longitude, is_active ? 1 : 0);
    res.json({ success: true, id: info.lastInsertRowid });
  });

  app.put("/api/admin/branches/:id", (req, res) => {
    const { name, address, email, password, latitude, longitude, is_active } = req.body;
    db.prepare("UPDATE branches SET name = ?, address = ?, email = ?, password = ?, latitude = ?, longitude = ?, is_active = ? WHERE id = ?").run(name, address, email, password, latitude, longitude, is_active ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/branches/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM branches WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(400).json({ error: "Cannot delete branch because it has associated orders or dining tables. Please delete them first or deactivate the branch instead." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  // Admin Users
app.get("/api/admin/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  res.json(users);
});

app.put("/api/admin/users/:uid", (req, res) => {
  const { role, is_active, wallet_balance } = req.body;
  db.prepare("UPDATE users SET role = ?, is_active = ?, wallet_balance = ? WHERE uid = ?")
    .run(role || 'customer', is_active ? 1 : 0, wallet_balance || 0, req.params.uid);
  res.json({ success: true });
});

app.delete("/api/admin/users/:uid", (req, res) => {
  db.prepare("DELETE FROM users WHERE uid = ?").run(req.params.uid);
  res.json({ success: true });
});

// Admin Kitchens
app.get("/api/admin/kitchens", (req, res) => {
  const kitchens = db.prepare(`
    SELECT k.*, b.name as branch_name 
    FROM kitchens k 
    LEFT JOIN branches b ON k.branch_id = b.id
  `).all();
  res.json(kitchens);
});

app.post("/api/admin/kitchens", (req, res) => {
  const { name, branch_id, status } = req.body;
  const info = db.prepare("INSERT INTO kitchens (name, branch_id, status) VALUES (?, ?, ?)")
    .run(name, branch_id, status || 'Active');
  res.json({ success: true, id: info.lastInsertRowid });
});

app.put("/api/admin/kitchens/:id", (req, res) => {
  const { name, branch_id, status } = req.body;
  db.prepare("UPDATE kitchens SET name = ?, branch_id = ?, status = ? WHERE id = ?")
    .run(name, branch_id, status || 'Active', req.params.id);
  res.json({ success: true });
});

app.delete("/api/admin/kitchens/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM kitchens WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      res.status(400).json({ error: "Cannot delete kitchen because it has associated items. Please reassign items first." });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
