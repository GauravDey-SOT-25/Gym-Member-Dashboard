// server.js - Gym SaaS Dashboard API Backend Server (Native Node.js, Zero-Dependencies)
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'server_db.json');

// MIME types for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// ──────────────────────────────────────────────────────────────────────────
// INITIALIZE MOCK DATA DATABASE
// ──────────────────────────────────────────────────────────────────────────
const DEFAULT_USERS = {
  "MBR-001": { id: "MBR-001", name: "Arjun Verma",    email: "arjun@email.com",   phone: "+91 98765 43210", plan: "Premium", status: "active",        daysRemaining: 80,  sessions: 48, streak: 6,  calories: 18400, points: 1200, tier: "Gold"     },
  "MBR-002": { id: "MBR-002", name: "Priya Sharma",   email: "priya@email.com",   phone: "+91 98765 43211", plan: "Basic",   status: "expiring_soon", daysRemaining: 4,   sessions: 22, streak: 2,  calories: 8200,  points: 400,  tier: "Silver"   },
  "MBR-003": { id: "MBR-003", name: "Rohan Mehta",    email: "rohan@email.com",   phone: "+91 98765 43212", plan: "Elite",   status: "active",        daysRemaining: 180, sessions: 91, streak: 14, calories: 34200, points: 3100, tier: "Platinum" },
  "MBR-004": { id: "MBR-004", name: "Sneha Iyer",     email: "sneha@email.com",   phone: "+91 98765 43213", plan: "Basic",   status: "expired",        daysRemaining: 0,   sessions: 10, streak: 0,  calories: 3100,  points: 100,  tier: "Bronze"   },
  "MBR-005": { id: "MBR-005", name: "Karan Singh",    email: "karan@email.com",   phone: "+91 98765 43214", plan: "Premium", status: "active",        daysRemaining: 45,  sessions: 60, streak: 9,  calories: 22000, points: 1800, tier: "Gold"     },
  "MBR-006": { id: "MBR-006", name: "Anita Joshi",    email: "anita@email.com",   phone: "+91 98765 43215", plan: "Elite",   status: "active",        daysRemaining: 200, sessions: 110,streak: 21, calories: 41000, points: 4200, tier: "Platinum" },
  "MBR-007": { id: "MBR-007", name: "Vikram Nair",    email: "vikram@email.com",  phone: "+91 98765 43216", plan: "Basic",   status: "active",        daysRemaining: 20,  sessions: 15, streak: 3,  calories: 5400,  points: 250,  tier: "Bronze"   },
  "MBR-008": { id: "MBR-008", name: "Meera Pillai",   email: "meera@email.com",   phone: "+91 98765 43217", plan: "Premium", status: "active",        daysRemaining: 90,  sessions: 55, streak: 11, calories: 20100, points: 1600, tier: "Gold"     },
  "MBR-009": { id: "MBR-009", name: "Aditya Rao",     email: "aditya@email.com",  phone: "+91 98765 43218", plan: "Basic",   status: "expiring_soon", daysRemaining: 6,   sessions: 8,  streak: 1,  calories: 2800,  points: 80,   tier: "Bronze"   },
  "MBR-010": { id: "MBR-010", name: "Divya Menon",    email: "divya@email.com",   phone: "+91 98765 43219", plan: "Elite",   status: "active",        daysRemaining: 150, sessions: 78, streak: 18, calories: 29300, points: 2900, tier: "Platinum" }
};

const DEFAULT_SESSIONS = {};
Object.keys(DEFAULT_USERS).forEach(memberId => {
  DEFAULT_SESSIONS[memberId] = {
    bookings: [
      { id: "BK-001", class: "Zumba Power", trainer: "Priya Sharma", date: "Tomorrow", time: "07:00 AM", status: "confirmed" },
      { id: "BK-002", class: "Weight Shred", trainer: "Rohan Mehta", date: "May 28, 2026", time: "06:30 AM", status: "confirmed" }
    ],
    notifications: [
      { id: 1, type: "reminder", message: "Zumba class tomorrow at 7:00 AM", read: false, timestamp: new Date().toISOString() },
      { id: 2, type: "offer", message: "Renew now and get 1 month free!", read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, type: "milestone", message: "Streak level reached! 🔥", read: true, timestamp: new Date(Date.now() - 7200000).toISOString() }
    ],
    pointsHistory: [
      { date: "2026-05-24", action: "Session Check-in", points: 10 },
      { date: "2026-05-23", action: "Referral Bonus", points: 100 }
    ]
  };
});

let db = {
  users: DEFAULT_USERS,
  sessions: DEFAULT_SESSIONS,
  realtimeState: {
    liveVisitors: 34,
    maxCapacity: 80
  },
  membershipDistribution: {
    premium: 165,
    standard: 135,
    basic: 95,
    trial: 45
  }
};

// Load existing database file if it exists
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    console.log('✅ Local server database loaded successfully.');
  } catch (err) {
    console.warn('⚠️ Error reading DB file, resetting database:', err.message);
  }
} else {
  saveDatabase();
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Database save error:', err);
  }
}

// Helper to read post request bodies
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

// Helper to send json responses
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ──────────────────────────────────────────────────────────────────────────
// SSE CLIENT STORAGE
// ──────────────────────────────────────────────────────────────────────────
let sseClients = [];

function broadcastSSE(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.write(payload);
    } catch (err) {
      // client connection already closed, let req.on('close') handle it
    }
  });
}

// ──────────────────────────────────────────────────────────────────────────
// MAIN HTTP SERVER REQUEST HANDLER
// ──────────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`[HTTP] ${method} ${pathname}`);

  // ────────────────────────────────────────────────────────────────────────
  // SSE REAL-TIME DATA STREAM ENDPOINT
  // ────────────────────────────────────────────────────────────────────────
  if (pathname === '/api/realtime' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send initial status immediately
    const initialFrame = {
      type: 'realtime_update',
      realtimeState: db.realtimeState,
      membershipDistribution: db.membershipDistribution
    };
    res.write(`data: ${JSON.stringify(initialFrame)}\n\n`);

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
      console.log(`🔌 SSE Client disconnected. Active clients: ${sseClients.length}`);
    });

    console.log(`🔌 SSE Client connected. Active clients: ${sseClients.length}`);
    return;
  }

  // ────────────────────────────────────────────────────────────────────────
  // REST API ROUTING
  // ────────────────────────────────────────────────────────────────────────
  
  // Regex mapping
  const usersMatch = pathname.match(/^\/api\/users$/);
  const distributionMatch = pathname.match(/^\/api\/membership\/distribution$/);
  const userMatch = pathname.match(/^\/api\/user\/([^/]+)$/);
  const profileMatch = pathname.match(/^\/api\/user\/([^/]+)\/profile$/);
  const syncMatch = pathname.match(/^\/api\/user\/([^/]+)\/sync$/);
  const bookingMatch = pathname.match(/^\/api\/user\/([^/]+)\/booking$/);
  const bookingDeleteMatch = pathname.match(/^\/api\/user\/([^/]+)\/booking\/([^/]+)$/);
  const pointsMatch = pathname.match(/^\/api\/user\/([^/]+)\/points$/);
  const notifReadMatch = pathname.match(/^\/api\/user\/([^/]+)\/notifications\/read$/);
  const notifClearMatch = pathname.match(/^\/api\/user\/([^/]+)\/notifications\/clear$/);

  try {
    // 1. Get all users
    if (usersMatch && method === 'GET') {
      return sendJSON(res, 200, { success: true, users: Object.values(db.users) });
    }

    // 2. Get single user details
    if (userMatch && method === 'GET') {
      const userId = userMatch[1];
      const userProfile = db.users[userId];
      const userSession = db.sessions[userId];

      if (!userProfile) {
        return sendJSON(res, 404, { success: false, message: `Member ${userId} not found` });
      }

      if (!userSession) {
        db.sessions[userId] = { bookings: [], notifications: [], pointsHistory: [] };
        saveDatabase();
      }

      return sendJSON(res, 200, {
        success: true,
        profile: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone || "+91 99999 88888",
          joinedDate: "2025-03-15"
        },
        membership: {
          plan: userProfile.plan,
          status: userProfile.status,
          expiryDate: "2026-08-01",
          daysRemaining: userProfile.daysRemaining,
          price: userProfile.plan === "Elite" ? 4999 : (userProfile.plan === "Premium" ? 2999 : 1499),
          autoRenew: true
        },
        stats: {
          totalSessions: userProfile.sessions,
          sessionsThisMonth: Math.floor(userProfile.sessions / 4) + 1,
          currentStreak: userProfile.streak,
          longestStreak: Math.max(userProfile.streak + 8, 12),
          avgSessionDuration: 52,
          caloriesBurned: userProfile.calories,
          lastVisit: "Yesterday"
        },
        points: {
          current: userProfile.points,
          lifetime: userProfile.points + 500,
          tier: userProfile.tier,
          nextTierAt: userProfile.points > 3000 ? 5000 : (userProfile.points > 1500 ? 3000 : 1500),
          history: db.sessions[userId]?.pointsHistory || []
        },
        bookings: db.sessions[userId]?.bookings || [],
        notifications: db.sessions[userId]?.notifications || []
      });
    }

    // 3. Update user profile
    if (profileMatch && method === 'POST') {
      const userId = profileMatch[1];
      const user = db.users[userId];
      if (!user) return sendJSON(res, 404, { success: false, message: 'User not found' });

      const body = await readBody(req);
      const { firstName, lastName, email, phone } = body;
      user.name = `${firstName} ${lastName}`;
      user.email = email;
      user.phone = phone;

      saveDatabase();
      return sendJSON(res, 200, { success: true, message: 'Profile details updated.' });
    }

    // 4. Update member details fully (Decay syncs)
    if (syncMatch && method === 'POST') {
      const userId = syncMatch[1];
      const user = db.users[userId];
      if (!user) return sendJSON(res, 404, { success: false, message: 'User not found' });

      const body = await readBody(req);
      const { daysRemaining, status, sessions, calories, points, tier } = body;
      if (daysRemaining !== undefined) user.daysRemaining = daysRemaining;
      if (status !== undefined) user.status = status;
      if (sessions !== undefined) user.sessions = sessions;
      if (calories !== undefined) user.calories = calories;
      if (points !== undefined) user.points = points;
      if (tier !== undefined) user.tier = tier;

      saveDatabase();
      return sendJSON(res, 200, { success: true });
    }

    // 5. Add class booking
    if (bookingMatch && method === 'POST') {
      const userId = bookingMatch[1];
      const session = db.sessions[userId];
      if (!session) return sendJSON(res, 404, { success: false, message: 'User session not found' });

      const body = await readBody(req);
      const { className, trainer, date, time } = body;
      const newBooking = {
        id: "BK-" + Math.floor(Math.random() * 900 + 100),
        class: className,
        trainer: trainer,
        date: date,
        time: time,
        status: "confirmed"
      };

      session.bookings.unshift(newBooking);

      // Add booking notification
      session.notifications.unshift({
        id: Date.now(),
        type: "reminder",
        message: `Booked: ${className} with ${trainer} for ${date} at ${time}`,
        read: false,
        timestamp: new Date().toISOString()
      });

      saveDatabase();
      return sendJSON(res, 200, { success: true, booking: newBooking });
    }

    // 6. Cancel booking
    if (bookingDeleteMatch && method === 'DELETE') {
      const userId = bookingDeleteMatch[1];
      const bookingId = bookingDeleteMatch[2];
      const session = db.sessions[userId];
      if (!session) return sendJSON(res, 404, { success: false, message: 'User session not found' });

      const index = session.bookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        const removed = session.bookings.splice(index, 1)[0];

        // Push cancellation notification
        session.notifications.unshift({
          id: Date.now(),
          type: "reminder",
          message: `Cancelled: ${removed.class} with ${removed.trainer}`,
          read: false,
          timestamp: new Date().toISOString()
        });

        saveDatabase();
        return sendJSON(res, 200, { success: true });
      }

      return sendJSON(res, 404, { success: false, message: 'Booking not found' });
    }

    // 7. Adjust points
    if (pointsMatch && method === 'POST') {
      const userId = pointsMatch[1];
      const user = db.users[userId];
      const session = db.sessions[userId];
      if (!user || !session) return sendJSON(res, 404, { success: false, message: 'User not found' });

      const body = await readBody(req);
      const { amount, action } = body;

      if (amount < 0 && user.points < Math.abs(amount)) {
        return sendJSON(res, 400, { success: false, message: 'Insufficient reward points.' });
      }

      user.points += amount;

      // Calculate tier
      if (user.points >= 3000) user.tier = "Platinum";
      else if (user.points >= 1200) user.tier = "Gold";
      else if (user.points >= 400) user.tier = "Silver";
      else user.tier = "Bronze";

      session.pointsHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        action: action,
        points: amount
      });

      saveDatabase();
      return sendJSON(res, 200, { success: true, points: user.points, tier: user.tier });
    }

    // 8. Notifications read / clear
    if (notifReadMatch && method === 'POST') {
      const userId = notifReadMatch[1];
      const session = db.sessions[userId];
      if (!session) return sendJSON(res, 404, { success: false });

      const body = await readBody(req);
      const { notifId } = body;
      const n = session.notifications.find(item => item.id === notifId);
      if (n) {
        n.read = true;
        saveDatabase();
      }
      return sendJSON(res, 200, { success: true });
    }

    if (notifClearMatch && method === 'POST') {
      const userId = notifClearMatch[1];
      const session = db.sessions[userId];
      if (!session) return sendJSON(res, 404, { success: false });

      session.notifications = [];
      saveDatabase();
      return sendJSON(res, 200, { success: true });
    }

    // 9. Membership distribution
    if (distributionMatch && method === 'GET') {
      return sendJSON(res, 200, {
        success: true,
        type: 'membership',
        view: 'distribution',
        timestamp: new Date().toISOString(),
        data: {
          labels: ['Premium', 'Standard', 'Basic', 'Trial'],
          values: [
            db.membershipDistribution.premium,
            db.membershipDistribution.standard,
            db.membershipDistribution.basic,
            db.membershipDistribution.trial
          ],
          colors: ['#FFD700', '#FFA500', '#e67e00', '#b35900']
        }
      });
    }

    // If request starts with /api/ but doesn't match endpoints, return 404 JSON
    if (pathname.startsWith('/api/')) {
      return sendJSON(res, 404, { success: false, message: `Endpoint ${method} ${pathname} not found.` });
    }

    // ────────────────────────────────────────────────────────────────────────
    // STATIC FILES SERVING WITH SPA ROUTING FALLBACK
    // ────────────────────────────────────────────────────────────────────────
    let filePath = path.join(__dirname, decodeURIComponent(pathname));
    
    // If path is a directory, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback: serve index.html for virtual routes
      const indexPath = path.join(__dirname, 'index.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(indexPath).pipe(res);
    }
  } catch (error) {
    console.error('❌ Request processing error:', error);
    sendJSON(res, 500, { success: false, error: error.message });
  }
});

// ──────────────────────────────────────────────────────────────────────────
// REAL-TIME SIMULATION LOOP (SSE EVENTS BROADCASTS)
// ──────────────────────────────────────────────────────────────────────────
setInterval(() => {
  // 1. Gym Capacity Fluctuations
  const capacityShift = Math.floor(Math.random() * 5) - 2; // -2 to +2
  db.realtimeState.liveVisitors = Math.max(0, Math.min(80, db.realtimeState.liveVisitors + capacityShift));

  // 2. Membership Distribution Shifts
  const distributionShift = () => Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
  db.membershipDistribution.premium = Math.max(10, db.membershipDistribution.premium + distributionShift());
  db.membershipDistribution.standard = Math.max(10, db.membershipDistribution.standard + distributionShift());
  db.membershipDistribution.basic = Math.max(10, db.membershipDistribution.basic + distributionShift());
  db.membershipDistribution.trial = Math.max(5, db.membershipDistribution.trial + distributionShift());

  // Broadcast to all active EventSource clients
  broadcastSSE({
    type: 'realtime_update',
    realtimeState: db.realtimeState,
    membershipDistribution: db.membershipDistribution
  });

  // Save current database state
  saveDatabase();
}, 5000);

// Start native server
server.listen(PORT, () => {
  console.log(`🚀 Zero-Dependency FitMatrix Gym SaaS Server running on http://localhost:${PORT}`);
});
