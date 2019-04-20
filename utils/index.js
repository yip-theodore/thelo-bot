
exports.isAdmin = message => message.member.roles.some(role => ['Roi des Poulets', 'Renne des Poulets'].includes(role.name))

exports.formatNumber = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
