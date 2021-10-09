const fs = require("fs").promises;
const getTheme = require("./theme");

const cleanTheme = getTheme({
  theme: "clean",
  name: "Dracula Clean",
});

const cleanerTheme = getTheme({
  theme: "cleaner",
  name: "Draculer Cleaner",
});

// Write themes

fs.mkdir("./themes", { recursive: true })
  .then(() => Promise.all([
    fs.writeFile("./themes/dracula-clean.json", JSON.stringify(cleanTheme, null, 2)),
    fs.writeFile("./themes/dracula-cleaner.json", JSON.stringify(cleanerTheme, null, 2)),
  ]))
  .catch(() => process.exit(1))
