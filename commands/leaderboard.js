const db = require('../db')
const { formatNumber } = require('../utils')

module.exports = async (option, args, message, member) => {
  switch (option) {

    case undefined: {

      const members = await db.member.getTop10()

      const medals = ['🥇', '🥈', '🥉']

      const fields = members.map(({ id, money }, i) => ({
        name: `${medals[i] || (i+1 + ' -')} ${message.guild.members.get(id).displayName}`,
        value: `avec ${formatNumber(money)} Boudadiz!`
      }))

      return message.channel.send({
        embed: {
          color: 0x00AE86,
          title: '🏆  LE CLASSEMENT',
          description: '............................................................',
          fields
        }
      })
    }
    
  }
}
