let _ = require('lodash');
let express = require('express');

let router = express.Router();

router.route('/methods')
    .get(function(req, res) {
        let methods = db.methods.find();
        let groups = db.groups.find();
        let tags = db.tags.find();
        for (let i = 0; i < methods.length; i++) {
            let method = methods[i];
            if (!!method.group) {
                let found = _.find(groups, {_id: method.group});
                if (!!found) {
                    method.group = found;
                }
            }
            let tagIds = [];
            _.forEach(method.tags, function(tag) {
                let found = _.find(tags, {_id: tag});
                if (!!found) {
                    tagIds.push(found);
                }
            });
            method.tags = tagIds;
        }
        res.send(methods);
    })
    .post(function(req, res) {
        let method = req.body;
        if (_.isObject(method.group)) {
            method.group = method.group._id;
        }
        method.tags = _.map(method.tags, function(tag) {
            if (tag._id) {
                return tag._id;
            } else {
                let savedTag = db.tags.save(tag);
                return savedTag._id;
            }
        });
        console.log('saving: ', method);
        let resp = db.methods.save(method);
        res.send(resp);
    });

router.route('/methods/:id')
    .put(function(req, res) {
        let method = req.body;
        let id = req.params.id;
        if (_.isObject(method.group)) {
            method.group = method.group._id;
        }
        method.tags = _.map(method.tags, function(tag) {
            if (tag._id) {
                return tag._id;
            } else {
                let savedTag = db.tags.save(tag);
                return savedTag._id;
            }
        });
        let resp = db.methods.update({_id: id}, method);
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
