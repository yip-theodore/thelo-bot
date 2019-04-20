require('dotenv').config()
const Discord = require("discord.js")
const client = new Discord.Client()
// const cron = require('node-cron')

const db = require('./db')
const commands = require('./commands')

// cron.schedule('0 0 0 * *', () => {
//   const now = new Date().toLocaleTimeString('fr-FR')
//   console.log(now)
//   client.guilds.get(process.env.GUILD_ID).channels.find(({ type }) => type === 'text').send(now)
// })

client.on("ready", async () => {
  console.log('\x1b[33m%s\x1b[0m', 'Up and running!')

  const count = await db.member.count()
  if (!count) {
    const members = client.guilds.get(process.env.GUILD_ID).members.map(({ user }) => user).filter(({ bot }) => !bot).map(({ id, username }) => ({ id, username }))
    await db.member.insertAll(members)
  }
})


client.on("message", async message => {
  if (message.author.bot) return
  if (!message.guild || message.guild.id !== process.env.GUILD_ID) return
  
  
  const memberId = message.author.id
  const member = await db.member.get(memberId)

  await db.member.setMoney(memberId, member.money + 1)
  if (member.emoji) message.react(member.emoji)
  

  // commands
  if (!message.content.startsWith('!')) return
  const args = message.content.slice(1).trim().split(/ +/g);
  const [ command, option ] = args.shift().toLowerCase().split('/')
  
  switch (command) {
    case 'help':
      return commands.help(option, args, message, member)
    case 'money':
      return commands.money(option, args, message, member)
    case 'leaderboard':
      return commands.leaderboard(option, args, message, member)
    case 'shop':
      return commands.shop(option, args, message, member)
  }
})


client.on('guildMemberAdd', async member => {
  const newMember = await db.member.insert(member.id, member.user.username)
  console.log(newMember)
})

 
client.login()