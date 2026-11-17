// 產生 程式地圖.md：列出 index.html 的各區塊、房間、函式與行號（點連結可在 VS Code 跳到那一行）。
// 用法：在 C:\tunnel-game 執行  npm run map
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const lines = fs.readFileSync(path.join(root, 'index.html'), 'utf8').split(/\r?\n/);
const L = n => `[${n}](index.html#L${n})`;
const ver = (lines.join('\n').match(/const GAME_VERSION='([^']+)'/) || [])[1] || '?';
const sections = [], rooms = [], funcs = [], consts = [];
let cur = null;
lines.forEach((s, i) => {
  const n = i + 1;
  let m;
  if ((m = s.match(/^\/\/ -{3,}\s*(.+?)\s*-{3,}\s*$/))) { cur = { name: m[1], line: n, funcs: [] }; sections.push(cur); return; }
  if ((m = s.match(/^\s{2}([A-Z]{1,2}\d*[A-Z]?\d*):\{mpos:\[[^\]]*\],name:'([^']+)'/))) rooms.push({ id: m[1], name: m[2], line: n });
  if ((m = s.match(/^function\s+([\w$]+)\s*\(/))) { const f = { name: m[1], line: n }; funcs.push(f); if (cur) cur.funcs.push(f); }
  if ((m = s.match(/^(?:const|let)\s+([A-Z][A-Z0-9_]{2,})\s*=/))) consts.push({ name: m[1], line: n });
});
let out = `# 程式地圖（index.html，版本 ${ver}）\n\n`;
out += `> 這份是自動產生的，行號會隨更新改變。拿到新版後在終端機打 \`npm run map\` 重新產生。\n> 在 VS Code 裡按住 Ctrl 點行號就會跳過去；在 index.html 裡按 Ctrl+G 輸入行號也可以。\n\n`;
out += `## 區塊\n\n| 區塊 | 行 | 主要函式 |\n|---|---|---|\n`;
for (const s of sections) out += `| ${s.name} | ${L(s.line)} | ${s.funcs.slice(0, 8).map(f => '`' + f.name + '`').join(' ')}${s.funcs.length > 8 ? ' …共 ' + s.funcs.length + ' 個' : ''} |\n`;
out += `\n## 房間（ROOMS）\n\n| 代號 | 名稱 | 行 |\n|---|---|---|\n`;
for (const r of rooms) out += `| ${r.id} | ${r.name} | ${L(r.line)} |\n`;
out += `\n## 常數與資料表\n\n` + consts.map(c => `- \`${c.name}\` ${L(c.line)}`).join('\n') + '\n';
out += `\n## 全部函式（依字母）\n\n` + funcs.slice().sort((a, b) => a.name.localeCompare(b.name)).map(f => `\`${f.name}\` ${L(f.line)}`).join('　') + '\n';
fs.writeFileSync(path.join(root, '程式地圖.md'), out);
console.log(`已產生 程式地圖.md：${sections.length} 個區塊、${rooms.length} 個房間、${funcs.length} 個函式（版本 ${ver}）`);
