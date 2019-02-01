const languageTagRegex = require('ietf-language-tag-regex');

module.exports = class PathFinder {
    constructor(page, defaultLanguage) {
        this.page = Object.assign({},page);
        this.defaultLanguage = defaultLanguage || 'en';

        const pathItems = this.page.path.split('/');

        this.explosedSlug = pathItems.reduce((acc,curr) => {
            if(curr != '')
                acc.push(curr);
            return acc;
        }, []);
        this.fileName = this.explosedSlug.pop();
        
        const pathLocale = this.getLocaleFromPath();
        if(pathLocale !== null)
            this.fileName = this.fileName.substring(0,this.fileName.length - pathLocale.length-1);

        if(this.fileName !== 'index')
            this.explosedSlug.push(this.fileName);
    }

    // Work around https://github.com/sebinsua/ietf-language-tag-regex/issues/1
    isBcp47(tag) {
        return tag !== 'html' && languageTagRegex().test(tag);
    }

    translate(translations) {
        const tr = translations.slugs;
        if(!tr) return;

        this.translatedExplosedSlug = this.explosedSlug.map(s => {
            if(tr[s]) return tr[s];
            else      return s;
        });
    }

    getLocaleFromPath() {
        const localeMatches = this.page.path.match(/(.*)(\.(\w+(\-\w+)?))/);

        if(localeMatches && localeMatches.length >= 4) {
            const locale = localeMatches[3];
            if(this.isBcp47(locale)) {
                return locale;
            }
        }

        return null;
    }

    getLocale() {
        return this.getLocaleFromPath() || this.defaultLanguage;
    }

    getSlug() {
        if(this.translatedExplosedSlug)
            return '/' + this.translatedExplosedSlug.join('/');
        else
            return '/' + this.explosedSlug.join('/');
    }

    getCanonical() {
        let slugCopy;
        if(this.translatedExplosedSlug)
            slugCopy = this.translatedExplosedSlug.slice(0);
        else
            slugCopy = this.explosedSlug.slice(0);

        slugCopy.unshift(this.getLocale());
        return '/' + slugCopy.join('/');
    }

    getPathRegex() {
        let regex = this.explosedSlug.join('/');
        regex = regex.replace('/','\/');
        return '/' + regex + '/';
    }

    getPaths() {
        let paths = [];
        paths.push( this.getCanonical() );
        if(this.getLocale() === this.defaultLanguage && this.fileName === 'index') {
            paths.push( this.getSlug() );
        }
        return paths;
    }
    
    getPages() {

        let pages = [];

        return this.getPaths().map(p => {
            const canonical = this.getCanonical();

            let newPage = Object.assign({},this.page);
            newPage.path              = p;
            newPage.context = Object.assign({}, this.page.context);
            newPage.context.locale    = this.getLocale();
            newPage.context.canonical = canonical === p ? null : canonical;
            newPage.context.slug      = this.getSlug();
            newPage.context.pathRegex = this.getPathRegex();

            return newPage;
        });
    }

    getAll() {
        return {
            locale:    this.getLocale(),
            slug:      this.getSlug(),
            canonical: this.getCanonical(),
            paths:     this.getPaths()
        };
    }
}

