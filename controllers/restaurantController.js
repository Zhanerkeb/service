const db = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;
let resultsPerPage = {
    product: 5,
};

exports.addRestaurant = async (req, res) => {
    let {name, image, location, phone, averageBill, amountOfPlace, rate} = req.body;
    let kitchens = JSON.parse(req.body.kitchens || '[]') ;
    let newRestaurant = {
        name: name,
        image: image,
        location: location,
        phone: phone,
        averageBill: averageBill,
        amountOfPlace: amountOfPlace,
        rate: rate,
        kitchens: kitchens
    };
    let arr = []
    for (let kitchen of kitchens) {
        let existKitchen = await db.Kitchen.findOne({
            where: {
                id: kitchen
            }
        })
        if (existKitchen != null) {
            arr.push(existKitchen)
        }
    }
    if (kitchens.length === 0) {
        return res.status(500).send({error: "You must input kitchenIDs"})
    }
    if (arr.length == kitchens.length) {
        db.Restaurant.create(newRestaurant)
            .then(restaurant => {
                kitchens.map((kitchen) => {
                    db.ResKitList.create({kitchenId: kitchen, restaurantId: restaurant.id})
                });
                res.send(restaurant)
            }).catch(err => {
            res.status(500).send({error: "Error while adding new restaurant" + err});
        })
    } else {
        res.status(500).send({error: "You must input ALL existing kitchenIDs"})
    }
};

exports.getRestaurants = (req, res) => {
    db.Restaurant.findAll({
        include: [{
            model: db.ResKitList,
            attributes: ['id'],
            required: true,
            include: [{
                model: db.Kitchen,
                required: true,
            }]
        }],
    }).then(restaurants => {
        res.send(restaurants)
    }).catch(err => {
        res.status(500).send({error: err})
    })
}

exports.getById = async (req, res) => {
    let userId = req.user.id
    let restaurantId = req.params.restaurantId
    let userFav = await db.Favorites.findOne({
        where: {userId, restaurantId}
    })
    db.Restaurant.findByPk(req.params.restaurantId, {
        include: [{
            model: db.ResKitList,
            required: false,
            attributes: ['id'],
            include: [{
                model: db.Kitchen,
                required: false
            }]
        }, {
            model: db.Review,
            attributes: ['id', 'text'],
            required: false
        }]
    }).then(restaurant => {
        if (!restaurant) {
            res.status(404).send({error: 'There not such restaurant'});
            return;
        }
        if (userFav != null) {
            restaurant.dataValues.isFavorite = "true"
        } else {
            restaurant.dataValues.isFavorite = "false"
        }
        res.send(restaurant)
    }).catch(err => {
        res.status(500).send({error: "no restaurant" + err})
    })
}

exports.searchRestaurants = async (req, res) => {
    try {
        let query = req.query["query"] ? req.query["query"]: ""
        let kitchens = JSON.parse(req.query["kitchens"] || ['null']);
        let page = 1;
        if (kitchens != null) {
            let arr = []
            for (let kitchen of kitchens) {
                let existKitchen = await db.Kitchen.findOne({
                    where: {
                        id: kitchen
                    }
                })
                if (existKitchen != null) {
                    arr.push(existKitchen)
                }
            }
            if (arr.length != kitchens.length) {
                res.status(500).send({error: "Input exists kitchens!"})
            }
        }
        const whereForName = {}
        const whereForKitchens = {}
        if (query) {
            whereForName.name = {[Op.like]: "%" + query + "%"}
        }
        if (kitchens != null && kitchens.length != 0) {
            whereForKitchens.kitchenId = kitchens
        }
        if (parseInt(req.query['page'])) {
            if (parseInt(req.query['page']) > 0) {
                page = parseInt(req.query['page'])
            }
        }
        let restaurants = await db.Restaurant.findAll({
            where: whereForName,
            include: [{
                required: true,
                model: db.ResKitList,
                where: whereForKitchens,
                include: [{
                    model: db.Kitchen,
                    required: false,
                    attributes: ['name'],
                }]
            }],
            limit: resultsPerPage.product,
            offset: resultsPerPage.product * (page - 1)
        });
        let resCount = await db.Restaurant.count({
        where: whereForName,
        include: [{
            model: db.ResKitList,
            required: true,
              where: whereForKitchens,
            include: [{
                model: db.Kitchen,
                required: false,
            }]
        }]
        })
        res.send({
            restaurants,
            pageSize: resultsPerPage.product,
            count: resCount
        });
    } catch (err) {
        res.send(err)
    }
}

exports.updateRestaurant = async (req, res) => {
    let restaurantId = req.params.restaurantId;
    let {name, image, location, phone, averageBill, amountOfPlace, rate} = req.body;
    let updatedRestaurant = {name, image, location, phone, averageBill, amountOfPlace, rate}
    try {
        let isUpdated = await db.Restaurant.update(updatedRestaurant, {
            where: {
                id: restaurantId
            }
        })
        if (isUpdated == 0) {
            isUpdated = "There is no restaurant with this ID"
            res.send({updated: isUpdated, restaurantId})
        } else {
            isUpdated = "Updated successfully"
            res.send({updated: isUpdated, restaurantId, updatedRestaurant})
        }
    } catch (err) {
        res.status(500).send({error: "Error while updating restaurant: " + err})
    }
}

exports.deleteRestaurant = async (req, res) => {
    let restaurantId = req.params.restaurantId;
    let exist = await db.Restaurant.findOne({
        where: {
            id: restaurantId
        }
    })
    if (exist != null) {
        try {
            let restaurantName = (await db.Restaurant.findOne({
                where: {id: restaurantId},
                attributes: ['name']
            })).name
            db.Restaurant.destroy({
                where: {
                    id: restaurantId
                }
            })
            res.send({deleted: "Deleted successfully", restaurantId, restaurantName})
        } catch (err) {
            res.status(500).send({error: "Error while deleting restaurant: " + err})
        }
    } else {
        res.send({deleted: "There is no restaurant with this ID", restaurantId})
    }
}
