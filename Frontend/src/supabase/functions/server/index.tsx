import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-baa97425/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all active packages (public endpoint)
app.get("/make-server-baa97425/packages", async (c) => {
  try {
    const packages = await kv.getByPrefix('package:');
    
    // Filter only active packages and sort by price
    const activePackages = packages
      .filter((pkg: any) => pkg.isActive)
      .sort((a: any, b: any) => a.price - b.price);
    
    return c.json({ packages: activePackages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return c.json({ error: 'Failed to fetch packages' }, 500);
  }
});

// Get package by ID (public endpoint)
app.get("/make-server-baa97425/packages/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const packageData = await kv.get(`package:${id}`);
    
    if (!packageData) {
      return c.json({ error: 'Package not found' }, 404);
    }
    
    return c.json({ package: packageData });
  } catch (error) {
    console.error(`Error fetching package:`, error);
    return c.json({ error: 'Failed to fetch package' }, 500);
  }
});

// Seed package (development/admin endpoint)
app.post("/make-server-baa97425/seed-package", async (c) => {
  try {
    const packageData = await c.req.json();
    
    // Validate required fields
    if (!packageData.id || !packageData.name || !packageData.price) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Store in KV store
    await kv.set(`package:${packageData.id}`, packageData);
    
    return c.json({ success: true, package: packageData });
  } catch (error) {
    console.error('Error seeding package:', error);
    return c.json({ error: 'Failed to seed package' }, 500);
  }
});

// Newsletter Subscribers endpoints

// Subscribe to newsletter (public endpoint)
app.post("/make-server-baa97425/newsletter/subscribe", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Valid email is required' }, 400);
    }
    
    // Check if email already exists
    const existingSubscribers = await kv.getByPrefix('newsletter:');
    const isDuplicate = existingSubscribers.some((sub: any) => sub.email === email);
    
    if (isDuplicate) {
      return c.json({ error: 'Email already subscribed', code: 23505 }, 409);
    }
    
    // Create new subscriber
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const subscriber = {
      id,
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };
    
    await kv.set(`newsletter:${id}`, subscriber);
    
    return c.json({ success: true, subscriber });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

// Get all newsletter subscribers (admin endpoint)
app.get("/make-server-baa97425/newsletter-subscribers", async (c) => {
  try {
    const subscribers = await kv.getByPrefix('newsletter:');
    
    // Sort by subscribedAt date (newest first)
    subscribers.sort((a: any, b: any) => {
      return new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime();
    });
    
    return c.json({ subscribers });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

// Delete newsletter subscriber (admin endpoint)
app.delete("/make-server-baa97425/newsletter-subscribers/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    // Check if subscriber exists
    const subscriber = await kv.get(`newsletter:${id}`);
    if (!subscriber) {
      return c.json({ error: 'Subscriber not found' }, 404);
    }
    
    await kv.del(`newsletter:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return c.json({ error: 'Failed to delete subscriber' }, 500);
  }
});

// Export newsletter subscribers as CSV (admin endpoint)
app.get("/make-server-baa97425/newsletter-subscribers/export", async (c) => {
  try {
    const subscribers = await kv.getByPrefix('newsletter:');
    
    // Sort by subscribedAt date
    subscribers.sort((a: any, b: any) => {
      return new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime();
    });
    
    // Generate CSV content
    const headers = 'Email,Subscribed Date,Status\n';
    const rows = subscribers.map((sub: any) => {
      const date = new Date(sub.subscribedAt).toLocaleString();
      return `${sub.email},${date},${sub.status}`;
    }).join('\n');
    
    const csv = headers + rows;
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting newsletter subscribers:', error);
    return c.json({ error: 'Failed to export subscribers' }, 500);
  }
});

Deno.serve(app.fetch);