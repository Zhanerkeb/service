const db = require('../models')

exports.addOrder = (req, res) => {
    let userId = req.user.id
    let {restaurantId, guest, orderdate} = req.body
    let newOrder = {userId, restaurantId, guest, orderdate}

    if (orderdate != null) {
        db.Order.create(newOrder)
            .then(order => {
                res.send(order)
            }).catch(err => {
            res.status(500).send({error: "Error while adding new order" + err});
        })
    } else {
        res.status(500).send({error: "You must input date"})
    }
};

exports.getById = (req, res) => {
    let userId = req.user.id
    db.Order.findAll({
        where: {
            userId: userId,
        },
        attributes: ['id', 'orderdate', 'guest'],
        include: [{
            model: db.Restaurant,
            attributes: ['name', 'image'],
        }]
    }).then(order => {
        res.send(order)
    }).catch(err => {
        res.status(500).send({error: err})
    })
}