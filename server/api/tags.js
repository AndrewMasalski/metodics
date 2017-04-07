let express = require('express');

let router = express.Router();

router.route('/tags')
    .get(function(req, res) {
        let configs = db.tags.find();
        res.send(configs);
    })

    .post(function(req, res) {
        let tag = req.body;
        console.log('saving: ', tag);
        let resp = db.tags.save(tag);
        res.send(resp);
    });

router.route('/tags/:id')
    .put(function(req, res) {
        let id = req.params.id;
        let resp = db.tags.update({_id: id}, req.body);
        res.json(resp);
    })

    .get(function(req, res) {
        let id = req.params.id;
        let found = db.tags.findOne({_id: id});
        res.json(found);
    })

    .delete(function(req, res) {
        let id = req.params.id;
        db.tags.remove({_id: id});
        res.sendStatus(204);
    });

module.exports = router;
