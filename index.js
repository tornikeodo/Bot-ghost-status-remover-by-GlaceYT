const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, PermissionsBitField } = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const token = process.env.TOKEN;
const clientId = '1261242922557247489';
const guildId = '1260910227155325010';
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_517108B0D386A9F154878160AAB56B8E7629AC12D943E50B2BE7BECB9168DE7D9D5604D26F37CBB76DFA6882B15D0CC52EEDE84388B0FA5C192822A8FBBD3FAF5A528093E7BA31A93102A5C597863A8E43DD217EEF28054D32448D784D0A9504FA07B45A2A747DAF99751A82AA2A9CB44D720F434DDE23FFDDAB659A6E25E525EE0EDF11146C07E6649962E83FB9DC3213D372EB5EFF3059A398781B21654F7BF2FBC3FCD8B6C41D39D70AF9F7719F2D72397E84DEAF3331CF7D85063074A211C17E39C833F7E95FC746A54A95A962C99F092CEDEE30F09B62577BB513E4F7BFE4D07D2E527443F3FCE805F333EA1E911D5D9285F5ACD93A6D593B12289F8382342E1AAC5764A7F28C4743CEA2ACF3BD850BB250A6970B26BE480066862EB1E1716AB491F2C6B7B7D79E33BB5C61C6EF36D1F2A723C32E067BB96146476C1415C4AF5FE468BBFA3D40101772034356C1AC0C7BD286DAA68E9348D54A1CD1F3B6C2B7F1695BF7CE421C87B81213BCCA688A2E14E9196BB05B78CDAF8D674930EB82DB567C778314E93B58727823DCBFF2293CCC5DCC104431067C923A8F06F416E563F9414198AA492CF25FD225B1E34BB8D9CC78A8ED32BAAC1C5F2D0067507AB465743C0A8ED72ED78A7EE5A134D8726D15759E3ADF291547CE3687BB89E269011DEA2E56006FA7D8DC5F6E4BCD1C940E5A18637800B5B6BB3B96993E3CFD06A46C0FFE87EACD8752ABAC126889F455196189E6FD26086E6379D7FA618BECF23B36C7A6D73C037350D97388089A9C927735D9B7C93C0C8447EA56D8922C60B648E4AA7DA32C5E57DB03F15BAC8A94836552B2999A6332A6B2CF3871CDFA8A413D3649EAD85B962CDCD2C38D0852E87E2F302493229EC708D3D39AE3545B2004A3486370CF1912992C00643150B55744C0C53528935EA9E9A4F382F9DCAE114CE8E374961AE0746930820B0760235D495A8BAA2C6197E2FAB439EF91C4929D7B706664758076D6FED4BBB15A804B721D68E61C119608065BE72FA7A8B843101B7130CB2CBC0B49F4157612D8E326AA2BA44B4214CE945752A66E06D5694E4F32E34AB09E'; // Use an environment variable for security
const groupId = 32304173; // PRL Professional Roblox League group ID

const usedFriendlyCommand = new Set();

const statusMessages = ["Over VRS", "Over VRS"];
let currentIndex = 0;
const port = 3000;
const app = express();

// Express server setup
app.get('/', (req, res) => {
  res.send('YaY Your Bot Status Changed✨');
});

app.listen(port, () => {
  console.log(`🔗 Listening to RTX: http://localhost:${port}`);
  console.log(`🔗 Powered By RTX`);
});

// Noblox setup
async function startApp() {
  await noblox.setCookie(robloxCookie);
  console.log('Logged into Roblox!');
}

startApp();

// Discord bot setup
client.once('ready', () => {
  console.log('Ready!');
  client.user.setActivity('Over VRS', { type: ActivityType.Watching });
  updateStatusAndSendMessages();
  setInterval(updateStatusAndSendMessages, 10000);
});

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder().setName('freeagent')
    .setDescription('Submit a free agent application.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('position').setDescription('Position you are applying for').setRequired(true))
    .addStringOption(option => option.setName('about').setDescription('About you').setRequired(true)),
  new SlashCommandBuilder().setName('sign')
    .setDescription('Sign a user to a team.')
    .addUserOption(option => option.setName('user').setDescription('The user to sign').setRequired(true))
    .addStringOption(option => option.setName('teamname').setDescription('The team name').setRequired(true)),
  new SlashCommandBuilder().setName('request')
    .setDescription('Request to join the league.')
    .addStringOption(option => option.setName('username').setDescription('Your username').setRequired(true))
    .addStringOption(option => option.setName('past_experiences').setDescription('Your past experiences').setRequired(true))
    .addStringOption(option => option.setName('how_did_you_find_the_league').setDescription('How did you find the league').setRequired(true)),
  new SlashCommandBuilder().setName('friendly')
    .setDescription('Post a friendly request.')
    .addStringOption(option => option.setName('team_name').setDescription('The team name').setRequired(true))
    .addStringOption(option => option.setName('information').setDescription('Information about the request').setRequired(true)),
  new SlashCommandBuilder().setName('scrim')
    .setDescription('Post a scrim request.')
    .addStringOption(option => option.setName('servername').setDescription('the name of the server').setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'freeagent') {
    const username = interaction.options.getString('username');
    const position = interaction.options.getString('position');
    const about = interaction.options.getString('about');

    const embed = {
      color: 0x0099ff,
      title: 'Free Agent Application',
      fields: [
        { name: 'Username', value: username },
        { name: 'Position', value: position },
        { name: 'About Me', value: about },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Free Agent Application',
      },
    };

    const channel = client.channels.cache.get('1260910228031930455');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply('Your free agent application has been submitted.');
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  } else if (commandName === 'sign') {
    const user = interaction.options.getUser('user');
    const teamName = interaction.options.getString('teamname');

    const embed = {
      color: 0x0099ff,
      title: 'New Sign',
      fields: [
        { name: 'User', value: user.tag },
        { name: 'Team Name', value: teamName },
      ],
      timestamp: new Date(),
      footer: {
        text: 'New Signing!',
      },
    };

    const channel = client.channels.cache.get('1260910228031930456');
    if (channel) {
      await channel.send({ embeds: [embed] });
      await interaction.reply(`Signed ${user.tag} to ${teamName}.`);
    } else {
      await interaction.reply('Failed to find the channel.');
    }
  } else if (commandName === 'request') {
        const username = interaction.options.getString('username');
        const pastExperiences = interaction.options.getString('past_experiences');
        const howDidYouFindTheLeague = interaction.options.getString('how_did_you_find_the_league');

        await interaction.deferReply({ ephemeral: true });

        const embed = {
            color: 0x0000ff,
            title: 'League Request',
            fields: [
                { name: 'Username', value: username },
                { name: 'Past Experiences', value: pastExperiences },
                { name: 'How did you find the league?', value: howDidYouFindTheLeague },
            ],
            timestamp: new Date(),
            footer: {
                text: 'League Request',
            },
        };

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('✅')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('reject')
                    .setLabel('❌')
                    .setStyle(ButtonStyle.Danger)
            );

        const channel = client.channels.cache.get('1260910227696390192');
        if (channel) {
            const message = await channel.send({ embeds: [embed], components: [row] });
            await interaction.editReply({ content: 'Request sent!', ephemeral: true });

            const filter = i => i.customId === 'accept' || i.customId === 'reject';
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'accept') {
                    try {
                        const users = await noblox.getJoinRequests(groupId);
                        const userRequest = users.data.find(user => user.requester.username === username);
                        if (userRequest) {
                            await noblox.handleJoinRequest(groupId, userRequest.requester.userId, true);
                            await i.deferUpdate();
                            await interaction.user.send('You have been accepted to the group!');
                        } else {
                            await i.update({ content: 'User not found in join requests.', ephemeral: true });
                        }
                    } catch (error) {
                        console.error(error);
                        await i.update({ content: 'An error occurred while accepting the request.', ephemeral: true });
                    }
                } else if (i.customId === 'reject') {
                    await i.deferUpdate();
                    await interaction.user.send('You have been rejected from the group!');
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } else {
            await interaction.editReply({ content: 'Failed to find the specified channel.', ephemeral: true });
        }
      } else if (commandName === 'friendly') {
        const teamName = interaction.options.getString('team_name');
        const information = interaction.options.getString('information');
    
        if (usedFriendlyCommand.has(interaction.user.id)) {
          await interaction.reply('You can only use this command once per 1 hour.');
        } else {
          usedFriendlyCommand.add(interaction.user.id);
          setTimeout(() => usedFriendlyCommand.delete(interaction.user.id), 1 * 60 * 60 * 1000);
    
          const roleId = '1260910227184943238'; // Replace with the actual role ID
          const roleMention = `<@&${roleId}>`;
    
          const embed = {
            color: 0x0099ff,
            title: 'Friendly Request',
            fields: [
              { name: 'Team Name', value: teamName },
              { name: 'Information', value: information },
            ],
            timestamp: new Date(),
            footer: {
              text: 'Friendly Request',
            },
          };
    
          const channel = client.channels.cache.get('1260910228031930458');
          if (channel) {
            await channel.send({ content: roleMention, embeds: [embed] });
            await interaction.reply('Your friendly request has been submitted.');
          } else {
            await interaction.reply('Failed to find the channel.');
          }
        }
    
  } else if (commandName === 'scrim') {
    const servername = interaction.options.getString('servername');
    const details = interaction.options.getString('details');

    const specificRole = '1262465654317908060'; // Replace with the role ID
    const pingRole = '1260910227155325018'; // Replace with the role ID

    if (!interaction.member.roles.cache.has(specificRole)) {
      await interaction.reply({ content: 'You do not have the required role to use this command.', ephemeral: true });
      return;
    }

    const embed = {
      color: 0x0099ff,
      title: 'Scrim Request',
      fields: [
        { name: 'Server Name', value: servername },
       
      ],
      timestamp: new Date(),
      footer: {
        text: 'Scrim Request',
      },
    };

    const channel = client.channels.cache.get('1260910228199968901'); // Replace with your specific channel ID
    if (channel) {
      const message = await channel.send({ content: `<@&${pingRole}>`, embeds: [embed] });
      await interaction.reply('Your scrim request has been submitted.');

      await message.react('✅');
      await message.react('❌');

      const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;

      const collector = message.createReactionCollector({ filter, time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '✅') {
          await channel.send(`Scrim request accepted by ${user.tag}`);
        } else if (reaction.emoji.name === '❌') {
          await channel.send(`Scrim request rejected by ${user.tag}`);
        }
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} reactions.`);
      });
  
      // Send a message with the link in the same channel
      const link = 'https://www.roblox.com/games/14824351179/VRS-Hub'; // Replace with your actual link
      await channel.send(`Match Pitch: ${link}`);

    } else {
      await interaction.reply('Failed to find the channel.');
    }
  }
});



function updateStatusAndSendMessages() {
  client.user.setActivity(statusMessages[currentIndex], { type: ActivityType.Watching });
  console.log(`Bot status changed to: ${statusMessages[currentIndex]}`);
  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.login(token);
