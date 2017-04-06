let _ = require('lodash');
let express = require('express');

let router = express.Router();

router.route('/methods')
    .get(function(req, res) {
        let configs = db.methods.find();
        res.send(configs);
    })

    .post(function(req, res) {
        let method = req.body;
        console.log('saving: ', method);
        let resp = db.methods.save(method);
        res.send(resp);
    });

router.route('/methods/:id')
    .put(function(req, res) {
        let id = req.params.id;
        let resp = db.methods.update({_id: id}, req.body);
        res.json(resp);
    })

    .get(function(req, res) {
        let id = req.params.id;
        let found = db.methods.findOne({_id: id});
        res.json(found);
    })

    .delete(function(req, res) {
        let id = req.params.id;
        db.methods.remove({_id: id});
        res.sendStatus(204);
    });

module.exports = router;
