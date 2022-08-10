const db = require('../models');

exports.updateReskit = async (req, res) => {
    let restaurantId = req.params.restaurantId
    let kitchens = JSON.parse(req.body.kitchens);
    if (kitchens.length == 0) {
        res.status(500).send({error: "You must input kitchenIDs"})
    }
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
    if (arr.length == kitchens.length) {
        try {
            db.ResKitList.destroy({
                where: {restaurantId}
            })
            for (let i = 0; i < kitchens.length; i++) {
                db.ResKitList.create({kitchenId: kitchens[i], restaurantId})
            }
            res.send({updated: "Successfully", restaurantId, kitchens})
        } catch (err) {
            res.status(500).send({error: "Error while updating kitchens list: " + err})
        }
    } else {
        res.status(500).send({error: "You must input existing kitchenID"})
    }
}