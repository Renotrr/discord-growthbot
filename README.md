# Discord GrowthBot (prototype)

A Node.js and Discord.js prototype for managing server onboarding configuration and tracking member-join activity.

**Status:** Prototype. The repository is public for code review, but the current implementation is not production-ready and does not yet deliver the complete welcome-DM workflow described in the original concept.

## What is implemented

- Connects a Discord bot and listens for member-join events.
- Checks whether the joining member's server has an active configuration.
- Sends a direct-message notification to the configured owner when a member joins.
- Records member-join activity in a local JSON data file.
- Provides Express routes for server configuration, activity logs, and basic statistics.
- Includes a dashboard and login flow; API routes are guarded by session authentication.

## Current limitations

The current `GuildMemberAdd` handler does **not** send the configured invite link or custom welcome message to the new member. The `inviteLink` and `welcomeMessage` fields are stored, but the member-facing DM flow is not implemented in this repository yet.

There are also security and deployment issues that must be resolved before exposing this prototype to the public internet:

- The dashboard code contains fallback values for the admin password and session secret.
- The static dashboard files are served before the route-level authentication handler, so the dashboard page itself is not fully gated.
- Session cookies do not yet have production-specific secure settings.
- The default Express session store is in-memory.
- Server configuration and activity logs are stored in a local JSON file, which needs persistent storage in a hosted environment.
- The `dev` script references `nodemon`, which is not currently declared in `package.json`.

Please treat this as an implementation snapshot, not a production deployment template.

## Stack

- Node.js
- Discord.js
- Express
- express-session
- JSON file storage

## Run locally

Use Node.js and npm. Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and replace the placeholders. Use unique, strong values for the admin password and session secret.

```env
DISCORD_TOKEN=your_discord_bot_token
OWNER_DISCORD_ID=your_discord_user_id
ADMIN_PASSWORD=use_a_strong_unique_password
SESSION_SECRET=use_a_long_random_secret
PORT=3000
```

Start the app:

```bash
node index.js
```

The dashboard is served on the configured port.

## Project structure

```text
.
├── index.js
├── src/
│   ├── bot.js
│   ├── dashboard.js
│   └── storage.js
└── dashboard/
    └── public/
        ├── index.html
        └── login.html
```

## Next engineering priorities

1. Implement and test the member-facing welcome DM flow.
2. Remove insecure fallback credentials and require validated environment configuration.
3. Gate all dashboard content behind authentication and configure secure session cookies.
4. Replace the in-memory session store and local JSON persistence for a hosted deployment.
5. Add automated tests for message formatting, event handling, and authentication behavior.
