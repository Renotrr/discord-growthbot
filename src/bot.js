const { Client, GatewayIntentBits, Events } = require('discord.js');
const storage = require('./storage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`✅ Bot is online as ${c.user.tag}`);
  console.log(`📡 Watching ${Object.keys(storage.getServers()).length} servers`);
});

// Fires when someone joins ANY server the bot is in
client.on(Events.GuildMemberAdd, async (member) => {
  const guildId = member.guild.id;
  const serverConfig = storage.getServer(guildId);

  // If this server isn't configured or is inactive, ignore
  if (!serverConfig || !serverConfig.active) return;

  const username = member.user.tag;
  const userId = member.user.id;
  const serverName = member.guild.name;

  console.log(`👤 ${username} joined ${serverName}`);

  // 1. Send DM to the new member
  try {
    const message = buildWelcomeMessage(serverConfig, member);
    await member.user.send(message);
    console.log(`📨 DM sent to ${username}`);
  } catch (err) {
    console.warn(`⚠️ Could not DM ${username} (they may have DMs disabled)`);
  }

  // 2. Notify the bot owner
  try {
    const ownerId = process.env.OWNER_DISCORD_ID;
    if (ownerId) {
      const owner = await client.users.fetch(ownerId);
      await owner.send(
        `🔔 **New Member Alert!**\n` +
        `👤 **User:** ${username} (${userId})\n` +
        `🏠 **Joined Server:** ${serverName}\n` +
        `🔗 **Invite Sent:** ${serverConfig.inviteLink || 'No invite link set'}\n` +
        `🕐 **Time:** ${new Date().toLocaleString()}`
      );
    }
  } catch (err) {
    console.warn('⚠️ Could not notify owner:', err.message);
  }

  // 3. Log the event
  storage.addLog({
    type: 'member_joined',
    userId,
    username,
    guildId,
    guildName: serverName,
    inviteSent: !!serverConfig.inviteLink
  });
});

function buildWelcomeMessage(config, member) {
  // Use custom message if set, otherwise use default
  if (config.welcomeMessage && config.welcomeMessage.trim()) {
    return config.welcomeMessage
      .replace('{username}', member.user.username)
      .replace('{server}', member.guild.name)
      .replace('{invite}', config.inviteLink || '');
  }

  // Default message
  return (
    `👋 Hey **${member.user.username}**, welcome to **${member.guild.name}**!\n\n` +
    `We'd love to have you in our main community too where you can chat, interact, and stay updated.\n\n` +
    `🔗 **Join here:** ${config.inviteLink}\n\n` +
    `See you there! 🚀`
  );
}

async function startBot() {
  await client.login(process.env.DISCORD_TOKEN);
}

module.exports = { client, startBot };
