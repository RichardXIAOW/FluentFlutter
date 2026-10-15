const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'src', 'data', 'components');
const slugs = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of src.matchAll(/slug:\s*'([a-z0-9-]+)'/g)) slugs.push(m[1]);
}
fs.writeFileSync(path.join(__dirname, 'slugs.json'), JSON.stringify(slugs));
console.log(slugs.length + ' slugs');
