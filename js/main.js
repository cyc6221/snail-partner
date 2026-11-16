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
  window.PARTNERS.forEach(function (p) {
    var card = el('article', 'card' + (p.span === 2 ? ' wide' : ''));
    var head = el('div', 'card-head');
    head.appendChild(el('h2', null, p.name));
    var lv = el('span', 'lv');
    lv.appendChild(el('span', null, 'Lv.' + p.level));
    lv.appendChild(el('span', null, '六圍: ' + p.stats.reduce(function (a, s) { return a + s[1] + s[2]; }, 0)));
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
