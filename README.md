# ⚡ GrowthBot — Discord Growth Bot

A Discord bot that automatically DMs new server members with your invite link, notifies you of joins, and comes with a password-protected admin dashboard.

---

## 🚀 Features

- Watches multiple Discord servers
- DMs new members with your custom invite link
- Notifies you (the owner) via DM when someone joins
- Web admin dashboard with login protection
- Add/remove servers without touching code
- Toggle servers on/off
- Full activity logs
- Customizable welcome messages per server

---

## 📁 Project Structure

```
discord-bot/
├── index.js              # Entry point
├── package.json
├── .env.example          # Copy this to .env and fill in values
├── src/
│   ├── bot.js            # Discord bot logic
│   ├── dashboard.js      # Express web server + API
│   └── storage.js        # Data storage (JSON file)
├── dashboard/
│   └── public/
│       ├── index.html    # Admin dashboard UI
│       └── login.html    # Login page
└── data/
    └── config.json       # Auto-created, stores your server configs + logs
```

---

## ⚙️ Setup Guide

### Step 1: Create your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **"New Application"** → give it a name
3. Click **"Bot"** in the left sidebar
4. Click **"Reset Token"** → copy the token (you'll need this)
5. Under **"Privileged Gateway Intents"**, enable:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
6. Go to **"OAuth2" → "URL Generator"**
   - Scopes: `bot`
   - Bot Permissions: `Send Messages`, `Read Messages/View Channels`
   - Copy the generated URL and open it to invite the bot to your servers

### Step 2: Get your Discord User ID

1. Open Discord settings → **Advanced** → Enable **Developer Mode**
2. Right-click your own username → **"Copy User ID"**

### Step 3: Configure environment variables

1. Copy `.env.example` to `.env`
2. Fill in all values:

```env
DISCORD_TOKEN=your_bot_token_from_step_1
OWNER_DISCORD_ID=your_user_id_from_step_2
ADMIN_PASSWORD=choose_a_strong_password
SESSION_SECRET=any_long_random_string_like_this_abc123xyz789
PORT=3000
```

### Step 4: Install dependencies

```bash
npm install
```

### Step 5: Run locally (for testing)

```bash
node index.js
```

Visit http://localhost:3000 to see the dashboard.

---

## 🚂 Deploy to Railway

1. Create a free account at https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub and push this code to a repo
4. In Railway, go to your project → **"Variables"** tab
5. Add all your `.env` variables there (DISCORD_TOKEN, OWNER_DISCORD_ID, etc.)
6. Railway will auto-deploy. Your bot URL will be something like `https://your-app.railway.app`

---

## 🖥️ Using the Dashboard

1. Open your Railway app URL (or http://localhost:3000)
2. Log in with your `ADMIN_PASSWORD`
3. Click **"Add Server"**
4. Enter:
   - **Server ID**: Right-click your Discord server → "Copy Server ID" (needs Developer Mode on)
   - **Server Name**: Just a label for you
   - **Invite Link**: The Discord invite link you want to send new members
   - **Custom Message** (optional): Personalize the DM new members receive
5. The bot will now watch that server and DM every new member!

---

## ✉️ Custom Welcome Message

You can personalize the welcome DM using these placeholders:

| Placeholder | What it shows |
|---|---|
| `{username}` | The new member's Discord username |
| `{server}` | The server they just joined |
| `{invite}` | Your invite link |

**Example:**
```
Hey {username}! Welcome to {server} 👋

We also have a main community where everyone hangs out and chats.
Come join us here: {invite}

See you there! 🚀
```

---

## ➕ Adding New Features Later

The codebase is designed to be extended easily:

- **Bot logic** → edit `src/bot.js`
- **New API endpoints** → add to `src/dashboard.js`
- **Dashboard UI** → edit `dashboard/public/index.html`
- **Data storage** → currently JSON, can be swapped for a real database (MongoDB, PostgreSQL) by updating `src/storage.js`

---

## 🔒 Security Notes

- Never commit your `.env` file to GitHub
- Use a strong `ADMIN_PASSWORD` (not "admin123")
- The `SESSION_SECRET` should be a long random string
