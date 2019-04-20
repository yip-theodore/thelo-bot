const { isAdmin } = require('../utils')

module.exports = (option, args, message, member) => {
  switch (option) {

    case undefined: {
      return message.channel.send({
        embed: {
          color: 0x00AE86,
          title: '🤖  LES COMMANDES (!help)',
          description: '............................................................',
          fields: [
            { name: '💰 !money', value: 'Voir mon compte en banque' },
            { name: '🛒 !shop', value: 'Visiter la boutique' },
            { name: '🏆 !leaderboard', value: 'Voir le classement' },
          ]
        }
      })
    }

    case 'admin': {
      if (!isAdmin(message)) return message.reply('️🤖 Cette commande est réservée aux admins.')
      
      return message.channel.send({
        embed: {
          color: 0x00AE86,
          title: '🤖  LES COMMANDES ADMIN (!help/admin)',
          description: '............................................................',
          fields: [
            { name: '💰 !money', value: 'Voir mon compte en banque' },
            { name: '💰 !money/give <@mention>[] <somme> _ADMIN_', value: 'Donner de l’argent à un ou plusieurs joueurs' },
            { name: '💰 !money/remove <@mention>[] <somme> _ADMIN_', value: 'Retirer de l’argent à un ou plusieurs joueurs' },
            { name: '💰 !money/set <@mention>[] <somme> _ADMIN_', value: 'Fixer un montant précis à un ou plusieurs joueurs' },
            { name: '🛒 !shop', value: 'Visiter la boutique' },
            { name: '🏆 !leaderboard', value: 'Voir le classement' },
          ]
        }
      })
    }
    
  }
}
