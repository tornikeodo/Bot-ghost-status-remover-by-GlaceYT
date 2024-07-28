const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } = require('discord.js');
const noblox = require('noblox.js');
require('dotenv').config();
const express = require('express');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const token = process.env.TOKEN;
const clientId = '1261242922557247489';
const guildId = '1260910227155325010';
const robloxCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_0AC6CD4DBDEEDBF0461AACA59D4C2A14CA57144820FF4DFFB8E0B3D16CDF32FAA49EFC0274FAB00436D740F776553E3DF905E1B45F914097233D584623AD7C48CF5660171AA85142BD81328E0E02014AAA1E78E75E27572595552CDABC3B80F82B173C573FA39B1BB7E43AFB3263B7023A53951F90A3FCC1E350257F82C903A8460B6DA5B1F47069278A0645CA83292DF62A080B1A832341DE0CD3D33270DF3172781F3E0018AB73410820CF78BCA6E46C97E6C691E28CD0080CACCEBD7AC00A100B5A161C8D77EEF98BC4DA971F4EA9C0CA2C389EAA1D693A60AEAE788B21A1000E0DCB1EFFA1DF8D70393E53B3A091E21EA2A0FDF0275B59B2A1B0BE9DD2359F7D49C2DBB508D96AB7CCF4BC5F80B1FF30A45AE7081D540F087F48EBBBEADB1D1ACB22805ABC118155929EE2528D3BC1AC5E9F7C23517DC6F0C504FD31CFF2D52C3463A844D5EC75EFC7FC38D5EC956B260A2683529A8D099EC2885D5AE133F0E07E66713DF0FF208B0D9EC6287A3B6BB203A8FB8EE71D604EDD768CBA3528733DEFAD39A6C440665BDC9EA22A462301AED6DD78E0393951D0D3ACE5B8C7D40C6BEE9CFDFF5320540D2EF2FEFC19118FF72E61EC0BC3C31C9B6DF710E3DA847FBAAC0B02709BEFCB5B73452E590AF707A0E4B8676B5A93E36B157598120A854B5419054A767B310C81F74235672A9B8EA2D75BFF1AAB3AA55D68D37B6FAB6B47E03F9728CE1CBACCF400A8A418F5BF690F273B23BBFBFC2BCAC6F17B7A24D45E5F6436D471F4F92CFCC17DEA0DFB183FFFB93F393D5A437B40699B6BF3BDA0663F920F5FB424C640C8A0D730C51BF4C8A7ECCFADDD7F76932154D2949073B4D709F7D7896EBBA55CA6326E0FA19FD3F07CF7412BCC30FC22E081036953C5520D2A86627319FA45F823E9C79AF613EF62AEF0571DE0E8E19E0CF071B95F9AE14FD8E700BF240BDC8E46F4121E309C26AC5C6BBC80EF84332668D09C8D3F276F064856BF2E3767DA07AE30383E8E654AAF5DCAF08AB830E581F51163BFF71F0D411F9CA443F4989A397BAA45ACB124274D973867EA8386A16807DD49C4E30532E6307B04';
const groupId = 32304173; // PRL Professional Roblox League group ID

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot is running');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function startApp() {
  await noblox.setCookie(robloxCookie);
  console.log('Logged into Roblox!');
}

startApp();

client.once('ready', () => {
  console.log('Bot is ready!');
  client.user.setActivity('Over VRS', { type: ActivityType.Watching });
});

const commands = [
  new SlashCommandBuilder().setName('scrim')
    .setDescription('Post a scrim request')
    .addStringOption(option => option.setName('team').setDescription('Your team name').setRequired(true))
    .addStringOption(option => option.setName('details').setDescription('Scrim details').setRequired(true)),
  new SlashCommandBuilder().setName('request')
    .setDescription('Request to join the group')
    .addStringOption(option => option.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addUserOption(option => option.setName('discorduser').setDescription('Discord user').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Request description').setRequired(true))
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

  if (commandName === 'scrim') {
    const team = interaction.options.getString('Hoster');
    const details = interaction.options.getString('details');

    const embed = {
      color: 0x0099ff,
      title: 'Scrim Request',
      fields: [
        { name: 'Team', value: team },
        { name: 'Details', value: details },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Scrim Request',
      },
    };

    const channel = client.channels.cache.get('1260910228199968901'); // Replace with your channel ID
    if (channel) {
      const message = await channel.send({ embeds: [embed] });
      await message.react('✅');
      await interaction.reply({ content: 'Scrim request posted!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  } else if (commandName === 'request') {
    const robloxUser = interaction.options.getString('robloxuser');
    const discordUser = interaction.options.getUser('discorduser');
    const description = interaction.options.getString('description');

    const embed = {
      color: 0x00ff00,
      title: 'Join Request',
      fields: [
        { name: 'Roblox User', value: robloxUser },
        { name: 'Discord User', value: discordUser.tag },
        { name: 'Description', value: description },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Join Request',
      },
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('accept')
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('decline')
          .setLabel('Decline')
          .setStyle(ButtonStyle.Danger)
      );

    const channel = client.channels.cache.get('1260910227696390192'); // Replace with your channel ID
    if (channel) {
      const message = await channel.send({ embeds: [embed], components: [row] });
      await interaction.reply({ content: 'Join request sent!', ephemeral: true });

      const filter = i => i.customId === 'accept' || i.customId === 'decline';
      const collector = message.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async i => {
        if (i.customId === 'accept') {
          try {
            const users = await noblox.getJoinRequests(groupId);
            const userRequest = users.data.find(user => user.requester.username === robloxUser);

            if (userRequest) {
              await noblox.handleJoinRequest(groupId, userRequest.requester.userId, true);
              await i.update({ content: 'User has been accepted into the group!', components: [] });
              await channel.send(`User ${robloxUser} has been accepted to the group!`);
              await discordUser.send(`You have been accepted to the group!`);
            } else {
              const isMember = await noblox.getRankInGroup(groupId, robloxUser);
              if (isMember > 0) {
                await i.update({ content: 'Player has already been accepted!', components: [] });
                await channel.send(`Player ${robloxUser} has already been accepted!`);
              } else {
                await i.update({ content: 'Player cannot be found in group pendings.', components: [] });
                await channel.send(`Player ${robloxUser} cannot be found in group pendings.`);
              }
            }
          } catch (error) {
            console.error(error);
            await i.update({ content: 'An error occurred while accepting the request.', components: [] });
          }
        } else if (i.customId === 'decline') {
          await i.update({ content: 'Join request declined.', components: [] });
        }
      });

      collector.on('end', collected => {
        console.log(`Collected ${collected.size} interactions.`);
      });
    } else {
      await interaction.reply({ content: 'Failed to find the specified channel.', ephemeral: true });
    }
  }
});

client.login(token);
