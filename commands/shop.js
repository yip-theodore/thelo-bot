const db = require('../db')
const { formatNumber } = require('../utils')


module.exports = async (option, args, message, member) => {
  new Shop(message.channel, member)
}

const price = 500

class Shop {
  constructor (channel, member) {
    this.member = member
    this.channel = channel

    if (!this.member.emoji) this.render1A()
    else this.render1B()
  }

  async render1A () {
    const cosmetics = await db.member.getCosmetics()

    return this.channel.send({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: `**Cosmétique** - ${price} Boudadiz`,
          value: 'Achetez un joli cosmétique et vos messages seront encore plus jolis qu’avant! _(durée: 24h)_'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    }).then(async message => {
      this.message = message

      const reactionEvent = this.message.awaitReactions(
        (reaction, member) => cosmetics.includes(reaction.emoji.name) && member.id === this.member.id,
        { max: 1, time: 60000, error: ['time'] }
      )

      await Promise.all(cosmetics.map(cosmetic => this.message.react(cosmetic)))
      this.message.channel.send(`<@${this.member.id}>`)

      reactionEvent.then(async reactions => {
        console.log(reactions.map(({ emoji }) => emoji.name))
        if (this.member.money >= price) this.render2A(reactions.first().emoji.name)
        else this.render2B()
      }).catch(() => this.render2C())
    })
  }

  render1B () {
    return this.channel.send({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: 'Rien à voir ici…',
          value: 'Vous avez déjà acheté un cosmétique aujourd’hui.'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
  }

  async render2A (cosmetic) {
    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: `Êtes vous sûr de vouloir acheter un ${cosmetic}?`,
          value: `Il vous restera ${this.member.money - price}.`
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
    await this.message.clearReactions()

    const reactionEvent = this.message.awaitReactions(
      (reaction, member) => ['👍', '👎'].includes(reaction.emoji.name) && member.id === this.member.id,
      { max: 1, time: 60000, error: ['time'] }
    )
    await this.message.react('👍')
    await this.message.react('👎')
    
    reactionEvent.then(async reactions => {
      this.message.clearReactions()
      const reaction = reactions.first().emoji.name

      if (reaction === '👍') this.render3A(cosmetic)
      else this.render3B()
    }).catch(() => this.render2C())
  }

  render2B () {
    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: 'Malheureusement, vous n’avez pas assez de Boudadiz…',
          value: 'N’hésitez pas à revenir me voir un de ces jours!'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
  }

  render2C () {
    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: 'Après 60 secondes, la boutique doit fermer…',
          value: 'N’hésitez pas à revenir me voir un de ces jours!'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
  }

  async render3A (cosmetic) {

    const buyed = await db.member.buyCosmetic(this.member.id, cosmetic)
    if (!buyed) return this.render3C()

    await db.member.setMoney(this.member.id, this.member.money - price)

    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: `Vous venez d’acheter un ${cosmetic}!`,
          value: 'Pendant 24h, vos messages seront décorés par ce cosmétique!'
        }],
        footer: { text: `[Compte en banque: ${this.member.money - price} Boudadiz]` }
      }
    })
  }

  render3B () {
    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: 'Ok pas de problème!',
          value: 'N’hésitez pas à revenir me voir un de ces jours!'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
  }

  render3C () {
    this.message.edit({
      embed: {
        color: 0x00AE86,
        title: '🛒  LA BOUTIQUE',
        description: '............................................................',
        fields: [{
          name: 'Aya, une erreur s’est produite…',
          value: 'N’hésitez pas à revenir me voir un de ces jours!'
        }],
        footer: { text: `[Compte en banque: ${this.member.money} Boudadiz]` }
      }
    })
  }

}
