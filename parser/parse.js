let fs = require('fs');
let _ = require('lodash');
const filePath = 'data.txt';
let groupRegex = /^(\d\.)[^\d](.*)/;
let tagRegex = /^(\d\.\d)\.\s?(.*)/;
let typeRegex = /[\s+|.|-](инструкция по применению|инструкция|мви|письмо|методика|методические рекомендации|методические указания|руководство|технические условия|ту|анализ|санитарные нормы|санитарные требования|санитарные правила)\s+/;

let res = {
    groups: []
};
let lines = fs.readFileSync(filePath).toString().split("\r\n");
let currentGroup = 'start';
let currentTag = undefined;
let methods = [];

function getGroup(index) {
    const groups = require('../db/groups.json');
    return groups[index];
}
lines.forEach(function(line, index) {
    line = _.trim(line.toLowerCase());
    if (groupRegex.test(line)) {
        let gr = getGroup(res.groups.length);
        currentGroup = gr;
        if (currentGroup !== 'start') {
            res.groups.push(currentGroup);
        }
    } else if (tagRegex.test(line)) {
        if (!currentGroup.tags) {
            currentGroup.tags = [];
        }
        currentTag = {_id: index, text: line};
        currentGroup.tags.push(currentTag)
    } else {
        if (!currentTag.methods) {
            currentTag.methods = [];
        }
        if (line !== '') {
            let type;
            if (typeRegex.test(line)) {
                let matches = typeRegex.exec(line);
                type = matches[1];
            }

            let method = {
                description: line,
                group: currentGroup._id,
                type: type
            };
            currentTag.methods.push(method);
            methods.push(line);
        }
    }

});

fs.writeFileSync('./data.json', JSON.stringify(res, null, 2));
fs.writeFileSync('./methods.json', methods.join('\r\n'));