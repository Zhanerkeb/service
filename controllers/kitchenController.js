const db = require('../models');

exports.addKitchen = (req, res) => {
    let name = req.body.name;
    let newKitchen = {
        name: name,
    };
    db.Kitchen.create(newKitchen)
        .then(kitchen => {
            res.send(kitchen)
        }).catch(err => {
        console.log(err);
        res.status(500).send({error: "Error while adding new kitchen"});
    })
};

exports.getKitchens = (req, res) => {
    db.Kitchen.findAll({
        order: [
            ['id', 'ASC']
        ]
    }).then(kitchens => {
        res.send(kitchens)
    }).catch(err => {
        res.status(500).send({error: err})
    })
}

exports.updateKitchen = async (req, res) => {
    let kitchenId = req.params.kitchenId;
    let name = req.body.name;
    db.Kitchen.update({
        name: name
    }, {
        where: {
            id: kitchenId
        }
    }).then(isUpdated => {
        if (isUpdated == 0) {
            isUpdated = "There is no kitchen with this ID"
            res.send({updated: isUpdated, kitchenId})
        } else {
            isUpdated = "Updated successfully"
            res.send({updated: isUpdated, kitchenId, name})
        }
    }).catch(err => {
        res.status(500).send({error: "Error while updating kitchen: " + err})
    })
}

exports.deleteKitchen = async (req, res) => {
    let kitchenId = req.params.kitchenId;
    let kitchenName = (await db.Kitchen.findOne({
        where: {id: kitchenId},
        attributes: ['name']
    })).name
    db.Kitchen.destroy({
        where: {
            id: kitchenId
        }
    }).then(isDeleted => {
        if (isDeleted == 0) {
            isDeleted = "There is no kitchen with this ID"
            res.send({deleted: isDeleted, kitchenId})
        } else {
            isDeleted = "Deleted successfully"
            res.send({deleted: isDeleted, kitchenId, kitchenName})
        }
    }).catch(err => {
        res.status(500).send({error: "Error while deleting kitchen: " + err})
    })
}