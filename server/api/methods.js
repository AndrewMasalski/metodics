var url = require('url');
let _ = require('lodash');
let express = require('express');

let router = express.Router();

router.route('/methods')
    .get(function(req, res) {
        let methods = db.methods.find();
        let groups = db.groups.find();
        let tags = db.tags.find();
        let skip = Number(req.query.skip || 0);
        let top = Number(req.query.top || 25);
        let query = [];
        for (let i = skip; i < top + skip; i++) {
            let method = methods[i];
            method.index = i;
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
            query.push(method);
        }
        let reqUrl = url.parse(req.baseUrl + req.route.path, true, false);
        reqUrl.query['skip'] = (top + skip).toString();
        reqUrl.query['top'] = top.toString();
        delete reqUrl['search'];
        let paylodad = {
            $count: top,
            $nexturl: url.format(reqUrl),
            results: query
        };
        res.send(paylodad);
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
