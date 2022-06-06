// REQUIRE
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// ENV
const dotenv = require('dotenv'); dotenv.config();
const CLIENT_ID = process.env['CLIENT_ID'];
const GUILD_ID = process.env['GUILD_ID'];
const CLIENT_SECRET = process.env['CLIENT_SECRET'];

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken(CLIENT_SECRET);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  updateRole()
})

// client.on("message", msg => {
//   console.log(msg);
//   if (msg.content === "ping2") {
//     msg.reply("pong");
//   }
// })

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  console.log(interaction.commandName);

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

async function updateRole() {
  const guild = client.guilds.cache.get(GUILD_ID)
  const member = await guild.members.fetch('789206163224264764')
      .then((m) => { console.log('member found !'); return m; })
      .catch(console.error);
  const role = member.guild.roles.cache.find(role => role.name === "Lassativo" && role.guild.id === GUILD_ID);
  // message.member.addRole(role);
  // console.log(role);
  await member.roles.add([role])
      .then(() => console.log('role updated !'))
      .catch(console.error);
  // let users = client.users;
  // for (let i = 0; i < users.length; i++) {
  //   let username = `${users[i].username}#${users[i].discriminator}`;
  //   console.log(`[${i}] ${username}`);
  // }
}

client.login(CLIENT_SECRET)
