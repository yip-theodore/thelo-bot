const db = require('../db')
const { isAdmin, formatNumber } = require('../utils')

module.exports = (option, args, message, member) => {
  switch (option) {

    case undefined: {
      return message.reply(`💰 Vous avez actuellement **${formatNumber(member.money)}** Boudadiz!`)
    }

    case 'give':
    case 'remove':
    case 'set': {
      if (!isAdmin(message)) return message.reply('️🤖 Cette commande est réservée aux admins.')
      
      const amount = +args.pop()
      if(isNaN(amount)) return message.reply(`🤖 Désolé, vous ne m’avez pas indiqué la somme.\nEssayez plutôt \`!money/${option} <@mention>[] <somme>\``)

      const members = message.mentions.users.filter(({ bot }) => !bot).map(({ id }) => id)
      const everyone = message.content.includes('@everyone') ? message.channel.members.map(({ user }) => user).filter(({ bot }) => !bot).map(({ id }) => id) : []
      const here = message.content.includes('@here') ? message.channel.members.filter(({ presence }) => presence.status === 'online').map(({ user }) => user).filter(({ bot }) => !bot).map(({ id }) => id) : []
      const roles = message.mentions.roles.map(({ members }) => members.map(({ user }) => user).filter(({ bot }) => !bot).map(({ id }) => id)).flat()

      // console.log(members, everyone, here, roles)

      const mentions = [...new Set([
        ...members, ...everyone, ...here, ...roles
      ])]
      // console.log(mentions)

      return mentions.map(async id => {

        const member = await db.member.get(id)
        if (!member) return message.reply(`🤖 Désolé, je ne trouve pas l’utilisateur <@${id}>.`)

        const money = checkout[option](member.money, amount)
        await db.member.setMoney(id, money)

        const diff = money - member.money
        message.channel.send(`💰${diff >= 0 ? '📈' : '📉'} <@${id}> vient de ${diff >= 0 ? 'recevoir' : 'perdre'} ${formatNumber(Math.abs(diff))} Boudadiz, il en a maintenant **${formatNumber(money)}!**`)
      })
    }
    
  }
}

const checkout = {
  give: (money, amount) => money + amount,
  remove: (money, amount) => Math.max(0, money - amount),
  set: (money, amount) => amount
}
