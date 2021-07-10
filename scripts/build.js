const fs = require('fs');
const path = require('path');
const generate = require('./generate');

const THEME_DIR = path.join(__dirname, '..', 'theme');

if (!fs.existsSync(THEME_DIR)) {
    fs.mkdirSync(THEME_DIR);
}

module.exports = async () => {
    const { cleaner, clean } = await generate();

    return Promise.all([
        fs.promises.writeFile(
            path.join(THEME_DIR, 'dracula-cleaner.json'),
            JSON.stringify(cleaner, null, 4)
        ),
        fs.promises.writeFile(
            path.join(THEME_DIR, 'dracula-clean.json'),
            JSON.stringify(clean, null, 4)
        )
    ]);
};

if (require.main === module) {
    module.exports();
}
