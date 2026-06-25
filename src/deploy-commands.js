const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('give-points')
    .setDescription('Credit test points to a member (test phase only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(o => o.setName('user').setDescription('Member to credit').setRequired(true))
    .addIntegerOption(o => o.setName('amount').setDescription('Number of points').setRequired(true).setMinValue(1)),

  new SlashCommandBuilder()
    .setName('create-market')
    .setDescription('Create a community odds market')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('title').setDescription('Market title').setRequired(true))
    .addStringOption(o => o.setName('close_at').setDescription('Closing date/time (ISO: 2026-06-24T21:00:00)').setRequired(true))
    .addStringOption(o => o.setName('choice1').setDescription('Choice 1').setRequired(true))
    .addStringOption(o => o.setName('choice2').setDescription('Choice 2').setRequired(true))
    .addStringOption(o => o.setName('choice3').setDescription('Choice 3').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Target channel (default: current channel)').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .addStringOption(o => o.setName('image').setDescription('Image URL to display in the embed').setRequired(false)),

  new SlashCommandBuilder()
    .setName('set-market-result')
    .setDescription('Set the result of a market and credit winners')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('market_id').setDescription('Market ID (provided at creation)').setRequired(true))
    .addIntegerOption(o => o.setName('winner').setDescription('Winning choice number (1, 2 or 3)').setRequired(true)
      .addChoices(
        { name: 'Choice 1', value: 1 },
        { name: 'Choice 2', value: 2 },
        { name: 'Choice 3', value: 3 },
      )
    ),

  new SlashCommandBuilder()
    .setName('close-market')
    .setDescription('Manually close a market')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(o => o.setName('market_id').setDescription('Market ID').setRequired(true)),
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Deploying slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands deployed!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
