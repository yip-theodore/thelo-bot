require('dotenv').config()
const Discord = require("discord.js");
const client = new Discord.Client();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./the-au-lait.sqlite');
 
client.on("ready", () => {
  console.log('Up and running!')
  // Check if the table "points" exists.
  // const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'user';").get();
  // if (!table['count(*)']) {
  //   // If the table isn't there, create it and setup the database correctly.
  //   sql.prepare("CREATE TABLE user (id TEXT PRIMARY KEY, money INTEGER);").run();
  //   // Ensure that the "id" row is always unique and indexed.
  //   sql.prepare("CREATE UNIQUE INDEX idx_user_id ON user (id);").run();
  //   sql.pragma("synchronous = 1");
  //   sql.pragma("journal_mode = wal");
  // }
  // And then we have two prepared statements to get and set the score data.
  client.getUser = sql.prepare("SELECT * FROM user WHERE id = ?");
  client.setUser = sql.prepare("INSERT OR REPLACE INTO user (id, money) VALUES (@id, @money);");
});
 
client.on("message", message => {
  if (message.author.bot) return
  if (!message.guild) return

  const user = client.getUser.get(message.author.id) || { id: message.author.id, money: 1000 }
  client.setUser.run({ ...user, money: user.money + 1 })

  
  //
  if (message.content.indexOf('!') !== 0) return;
  const args = message.content.slice(1).trim().split(/ +/g);
  const [ command, subcommand ] = args.shift().toLowerCase().split('/')
 
  // Command-specific code here!
  switch (command) {

    case 'help': {
      switch (subcommand) {
        case 'admin': {
          if (!isAdmin(message)) return message.reply('️🤖 Cette commande n’est utilisable seulement que par les Administrateurs.')
          return message.channel.send({ embed: new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setTitle('🤖  LES COMMANDES ADMIN (!help/admin)')
            .setDescription('- - - - - - - - - - - - - - - - - - - -')
            .addField('💰 !money', 'Voir mon argent')
            .addField('💰 !money/give <@mention>[] <somme> (ADMIN)', 'Donner de l’argent à un joueur')
            .addField('💰 !money/remove <@mention>[] <somme> (ADMIN)', 'Enlever de l’argent à un joueur')
            .addField('💰 !money/set <@mention>[] <somme> (ADMIN)', 'Mettre un montant précis à un joueur')
            .addField('🏆 !leaderboard', 'Voir le classement')
          })
        }
        default: {
          return message.channel.send({ embed: new Discord.RichEmbed()
            .setColor(0x00AE86)
            .setTitle('🤖  LES COMMANDES (!help)')
            .setDescription('- - - - - - - - - - - - - - - - - - - -')
            .addField('💰 !money', 'Voir mon argent')
            .addField('🏆 !leaderboard', 'Voir le classement')
          })
        }
      }
    }

    case 'money': {

      if (!subcommand) {
        return message.reply(`💰 Vous avez ${formatNumber(user.money)} Boudadiz!`)
      }

      if (!['give', 'remove', 'set'].includes(subcommand)) return message.reply('️🤖 Désolé, je ne connais pas cette commande.\nEssayez plutôt `!money/<give|remove|set> <@mention>[] <somme>`')
      if (!isAdmin(message)) return message.reply('️🤖 Cette commande n’est utilisable seulement que par les Administrateurs.')

      const amount = +args[args.length-1]
      if(isNaN(amount)) return message.reply(`🤖 Désolé, vous ne m’avez pas dis combien je devais donner.\nEssayez plutôt \`!money/${subcommand} <@mention>[] <somme>\``)

      return message.mentions.users.map(mention => {
        const user = client.getUser.get(mention.id)
        if(!user) return message.reply(`🤖 Désolé, je ne trouve pas l’utilisateur <@${mention.id}>.`)

        let money
        switch (subcommand) {
          case 'give': money = user.money + amount; break
          case 'remove': money = Math.max(0, user.money - amount); break
          case 'set': money = amount
        }
        client.setUser.run({ ...user, money })
        
        const diff = money - user.money
        message.channel.send(`💰${diff >= 0 ? '📈' : '📉'} <@${user.id}> vient de ${diff >= 0 ? 'recevoir' : 'perdre'} ${formatNumber(Math.abs(diff))} Boudadiz, il en a maintenant ${formatNumber(money)}!`);
      })
    }

    case 'leaderboard': {
      const embed = new Discord.RichEmbed()
        .setColor(0x00AE86)
        .setTitle('🏆  LE CLASSEMENT')
        .setDescription('- - - - - - - - - - - - - - - - - - - -')

      const users = sql.prepare("SELECT * FROM user ORDER BY money DESC;").all()
      const medals = ['🥇', '🥈', '🥉']
  
      users.forEach((user, i) => {
        embed.addField(`${medals[i] || i+1 + ' -'} ${client.users.get(user.id).tag}`, `avec ${formatNumber(user.money)} Boudadiz!`)
      })
      return message.channel.send({ embed })
    }

    default: return
  }
})

// utils
const isAdmin = message => message.member.roles.some(role => ['Roi des Poulets', 'Renne des Poulets'].includes(role.name))
const formatNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

 
client.login()