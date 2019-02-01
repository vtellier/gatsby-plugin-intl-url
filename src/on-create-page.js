//const { graphql } = require("gatsby");
const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const PathFinder = require('./PathFinder');

// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
module.exports = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    return new Promise(async resolve => {
        //translations = await getTranslations();

        const oldPage = Object.assign({}, page)

        let pf = new PathFinder(page, pluginOptions.defaultLanguage);

        const locale = pf.getLocale();
        if(locale !== pluginOptions.defaultLanguage){
            let translations = require(path.resolve(`src/locale.${locale}.json`));
            pf.translate(translations);
        }

        deletePage(oldPage);
        pf.getPages().forEach(p => createPage(p));

        resolve();
    })
}
