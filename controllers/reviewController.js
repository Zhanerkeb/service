const db = require('../models')

exports.addReview = async (req, res) => {
    let userId = req.user.id
    let {restaurantId, text} = req.body;
    let newReview = {userId, restaurantId, text};
    let isExist = await db.Restaurant.findOne({
        where: {
            id: restaurantId
        }
    })
    if (isExist != null) {
        db.Review.create(newReview)
            .then(review => {
                res.send(review)
            }).catch(err => {
            res.status(500).send({error: "Error while adding new review" + err});
        })
    } else {
        res.status(500).send({error: "There is no restaurant with this ID", restaurantId})
    }
};

exports.getReviews = (req, res) => {
    db.Review.findAll()
        .then(review => {
            res.send(review)
        }).catch(err => {
        res.status(500).send({error: err})
    })
}

exports.deleteReview = async (req, res) => {
    let {reviewId} = req.params;
    let exist = await db.Review.findOne({
        where: {
            id: reviewId
        }
    })
    if (exist != null) {
        let reviewText = (await db.Review.findOne({
            where: {
                id: reviewId
            },
            attributes: ['text']
        })).text
        db.Review.destroy({
            where: {
                id: reviewId
            }
        }).then(isDeleted => {
            isDeleted = "Deleted successfully"
            res.send({deleted: isDeleted, reviewId, reviewText})
        }).catch(err => {
            res.status(500).send({error: "Error while deleting review: " + err})
        })
    } else {
        res.send({deleted: "There is no review with this ID", reviewId})
    }
}
