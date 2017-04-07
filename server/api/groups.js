let express = require('express');

let router = express.Router();

router.route('/groups')
    .get(function(req, res) {
        res.send(db.groups.find());
    })

    .post(function(req, res) {
        let group = {name: req.body.name};
        console.log('adding group: ', group);
        let resp = db.groups.save(group);
        res.send(resp);
    });

router.route('/groups/:id')
    .put(function(req, res) {
        let id = req.params.id;
        let resp = db.groups.update({_id: id}, req.body);
        res.json(resp);
    })

    .get(function(req, res) {
        let id = req.params.id;
        let found = db.groups.findOne({_id: id});
        res.json(found);
    })

    .delete(function(req, res) {
        let id = req.params.id;
        db.groups.remove({_id: id});
        res.sendStatus(204);
    });

module.exports = router;
