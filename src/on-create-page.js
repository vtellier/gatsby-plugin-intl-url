//const { graphql } = require("gatsby");
const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const PathFinder = require('./PathFinder');

// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
module.exports = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions;
    const translationFile = pluginOptions.translationFile || 'src/locale.json'

    return new Promise(async resolve => {
        //translations = await getTranslations();

        const oldPage = Object.assign({}, page)

        let pf = new PathFinder(page, pluginOptions.defaultLanguage);

        const locale = pf.getLocale();
        if(locale !== pluginOptions.defaultLanguage){
            let translations = require(path.resolve(translationFile));
            if(translations[locale])
                pf.translate(translations[locale]);
            else
                console.warn(`Your translation file misses the ${locale} language: ${translationFile}`);
        }

        deletePage(oldPage);
        pf.getPages().forEach(p => createPage(p));

        resolve();
    })
}
