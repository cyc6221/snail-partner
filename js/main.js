(function () {
  var board = document.getElementById('board');
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  // 把 {兵種} 括起來的文字轉成突出顯示
  function richName(text) {
    var span = el('span');
    text.split(/(\{[^}]*\})/).forEach(function (part) {
      if (!part) return;
      if (part.charAt(0) === '{') span.appendChild(el('b', 'unit', part.slice(1, -1)));
      else span.appendChild(document.createTextNode(part));
    });
    return span;
  }
  var MAX_TOTAL = 600; // 六圍滿(每項 100)
  var FOCUS_LEVEL = 22; // 達到此等級但未滿等 = 重點培養

  // 開發進度:已收錄 / 總數
  document.getElementById('progress').textContent = window.PARTNERS.length + '/' + TOTAL;

  // 依 LAYOUT 預先開好格子,再把小夥伴放進對應的格子
  var slots = [];
  LAYOUT.split('').forEach(function (d) {
    for (var i = 0; i < +d; i++) slots.push({ wide: d === '1' });
  });
  slots.length = Math.min(slots.length, TOTAL); // 超過總數的格子不開(最後一列右邊留空)
  window.PARTNERS.forEach(function (p) { if (slots[p.slot]) slots[p.slot].partner = p; });
  slots.forEach(function (slot, idx) {
    var p = slot.partner;
    if (!p) {
      var empty = el('article', 'card empty' + (slot.wide ? ' wide' : ''), '空格 ' + (idx + 1));
      board.appendChild(empty);
      return;
    }
    var card = el('article', 'card' + (slot.wide ? ' wide' : '') + (p.total >= MAX_TOTAL ? ' maxed' : p.level >= FOCUS_LEVEL ? ' focus' : ''));
    var head = el('div', 'card-head');
    head.appendChild(el('h2', null, p.name));
    var lv = el('span', 'lv');
    lv.appendChild(el('span', null, 'Lv.' + p.level));
    lv.appendChild(el('span', null, '六圍: ' + p.total));
    head.appendChild(lv);
    card.appendChild(head);
    var grid = el('dl', 'stats');
    p.stats.forEach(function (s) {
      var row = el('div', 'stat' + (p.main === s[0] ? ' main' : ''));
      row.appendChild(el('dt', null, s[0]));
      var dd = el('dd', null, String(s[1]));
      if (s[2]) dd.appendChild(el('span', 'bonus', '+' + s[2]));
      row.appendChild(dd);
      grid.appendChild(row);
    });
    card.appendChild(grid);
    if (p.abilities) {
      var ab = el('div', 'abilities');
      p.abilities.forEach(function (g) {
        var col = el('section', 'ab-col');
        col.appendChild(el('h3', null, g.title));
        g.items.forEach(function (a) {
          var v = Math.round(a.per * p.level * 100) / 100;
          var line = el('div', 'ability');
          line.appendChild(richName(a.name));
          line.appendChild(el('b', null, '+' + v + a.unit));
          col.appendChild(line);
        });
        ab.appendChild(col);
      });
      card.appendChild(ab);
    }
    board.appendChild(card);
  });
})();
