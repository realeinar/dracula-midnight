const { readFile } = require('fs').promises;
const { join } = require('path');
const { Type, Schema, load } = require('js-yaml');
const tinycolor = require('tinycolor2');

/**
 * @typedef {Object} TokenColor - Textmate token color.
 * @prop {string} [name] - Optional name.
 * @prop {string[]} scope - Array of scopes.
 * @prop {Record<'foreground'|'background'|'fontStyle',string|undefined>} settings - Textmate token settings.
 *       Note: fontStyle is a space-separated list of any of `italic`, `bold`, `underline`.
 */

/**
 * @typedef {Object} Theme - Parsed theme object.
 * @prop {Record<'base'|'ansi'|'brightOther'|'other', string[]>} dracula - Dracula color variables.
 * @prop {Record<string, string|null|undefined>} colors - VSCode color mapping.
 * @prop {TokenColor[]} tokenColors - Textmate token colors.
 */

/**
 * @typedef {(yamlObj: Theme) => Theme} ThemeTransform
 */

const withAlphaType = new Type('!alpha', {
    kind: 'sequence',
    construct: ([hexRGB, alpha]) => hexRGB + alpha,
    represent: ([hexRGB, alpha]) => hexRGB + alpha,
});

const schema = Schema.create([withAlphaType]);

module.exports = async () => {
    const yamlFileDraculaCleaner = await readFile(
        join(__dirname, '..', 'src', 'dracula-cleaner.yml'),
        'utf-8'
    );

    const yamlFileDraculaClean = await readFile(
        join(__dirname, '..', 'src', 'dracula-clean.yml'),
        'utf-8'
    );

    /** @type {Theme} */
    const cleaner = load(yamlFileDraculaCleaner, { schema });
    const clean = load(yamlFileDraculaClean, { schema });

    // Remove nulls and other falsey values from colors
    for (const key of Object.keys(cleaner.colors)) {
        if (!cleaner.colors[key]) {
            delete cleaner.colors[key];
        }
    }

    for (const key of Object.keys(clean.colors)) {
        if (!clean.colors[key]) {
            delete clean.colors[key];
        }
    }

    return {
        cleaner,
        clean
    };
};
