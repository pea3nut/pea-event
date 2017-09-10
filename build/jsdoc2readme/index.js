const Path =require('path');
const Fs =require('fs');

const jsdoc2md = require('jsdoc-to-markdown');

var result =jsdoc2md.renderSync({
    data :jsdoc2md.getTemplateDataSync({
        files :Path.join(__dirname,'../../src/*.js'),
        configure :Path.join(__dirname,'./jsdoc-config.json'),
    }),
});


result =result
    .replace(/peAEvent/g,'PeAEvent')
;

var readmeContent =Fs.readFileSync(Path.join(__dirname,'../../README.md')).toString();

result =readmeContent.replace(
    /<\!\-\-jsdoc\-\->[\w\W]*?<\!\-\-\/jsdoc\-\->/m,
    `<!--jsdoc-->\n\n${result}\n\n<!--/jsdoc-->`
);


Fs.writeFileSync(Path.join(__dirname,'../../README.md') ,result);

console.log('ok');
