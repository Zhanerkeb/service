const db = require('../models')

exports.addFavorites = async (req, res) => {
    let userId = req.user.id
    let {restaurantId} = req.body
    let newFavorite = {userId, restaurantId};
    let restaurantExist = await db.Restaurant.findOne({
        where: {
            id: restaurantId
        }
    })
    let alreadyFav = await db.Favorites.findOne({
        where: {
            userId, restaurantId
        }
    })
    if (restaurantExist != null) {
        if (alreadyFav == null) {
            try {
                newFavorite.userName = (await db.User.findOne({
                    where: {id: userId},
                    attributes: ['name']
                })).name
                newFavorite.restaurantName = (await db.Restaurant.findOne({
                    where: {id: restaurantId},
                    attributes: ['name']
                })).name
                db.Favorites.create(newFavorite)
                res.send(newFavorite)
            } catch (err) {
                res.status(500).send({error: "Error while adding new favorite" + err});
            }
        } else {
            res.status(500).send({error: "This restaurant is already your favorite"})
        }
    } else {
        res.status(500).send({error: "There is no restaurant with this ID"})
    }
}

exports.getById = (req, res) => {
    let userId = req.user.id
    db.Favorites.findAll({
        where: {userId},
        attributes: ['id'],
        include: [{
            model: db.Restaurant,
            attributes: ['name', 'image'],
        }, {
            model: db.User,
            attributes: ['name']
        }]
    }).then(favorite => {
        res.send(favorite)
    }).catch(err => {
        res.status(500).send({error: err})
    })
}

exports.deleteFavorites = async (req, res) => {
    let userId = req.user.id
    let {restaurantId} = req.body
    let restaurantExist = await db.Restaurant.findOne({
        where: {
            id: restaurantId
        }
    })
    let alreadyFav = await db.Favorites.findOne({
        where: {
            userId, restaurantId
        }
    })
    if (restaurantExist != null) {
        if (alreadyFav != null) {
            try {
                let restaurantName = (await db.Restaurant.findOne({
                    where: {id: restaurantId},
                    attributes: ['name']
                })).name
                db.Favorites.destroy({
                    where: {userId, restaurantId}
                })
                res.send({deleted: "Now this restaurant is not your favorite", restaurantName})
            } catch (err) {
                res.status(500).send({error: "Error while deleting favorite" + err});
            }
        } else {
            res.status(500).send({error: "This restaurant is NOT your favorite"})
        }
    } else {
        res.status(500).send({error: "There is no restaurant with this ID"})
    }
}