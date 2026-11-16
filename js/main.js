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
  document.getElementById('progress').textContent = window.PARTNERS.filter(function (p) { return p.values; }).length + '/' + TOTAL;

  // 依 LAYOUT 預先開好格子,再把小夥伴放進對應的格子
  var slots = [];
  LAYOUT.split('').forEach(function (d) {
    for (var i = 0; i < +d; i++) slots.push({ wide: d === '1' });
  });
  slots.length = Math.min(slots.length, TOTAL); // 超過總數的格子不開(最後一列右邊留空)
  window.PARTNERS.forEach(function (p) { if (slots[p.slot]) slots[p.slot].partner = p; });
  slots.forEach(function (slot, idx) {
    var p = slot.partner;
    if (!p || !p.values) {
      var empty = el('article', 'card empty' + (slot.wide ? ' wide' : ''));
      empty.id = 'slot-' + (idx + 1);
      empty.appendChild(el('span', 'slot-no', String(idx + 1)));
      empty.appendChild(el('span', 'slot-name', (p && p.name) || '空格'));
      board.appendChild(empty);
      return;
    }
    var card = el('article', 'card' + (slot.wide ? ' wide' : '') + (p.total >= MAX_TOTAL ? ' maxed' : p.level >= FOCUS_LEVEL ? ' focus' : ''));
    card.id = 'slot-' + (idx + 1);
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
        var items = g.items.filter(function (a) { return a.name; });
        if (!items.length) return; // 還沒填的能力不顯示
        var col = el('section', 'ab-col');
        if (g.title) col.appendChild(el('h3', null, g.title));
        items.forEach(function (a) {
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

  // 右上角選單:小夥伴清單,點名字捲到對應的卡片
  var btn = document.getElementById('btnMenu');
  var pop = document.getElementById('menuPop');
  slots.forEach(function (slot, idx) {
    var p = slot.partner;
    var a = el('a', 'menu-item');
    a.href = '#slot-' + (idx + 1);
    a.appendChild(el('span', 'menu-no', String(idx + 1)));
    a.appendChild(el('span', 'menu-name', (p && p.name) || '空格'));
    if (p && p.values) a.appendChild(el('span', 'menu-lv', 'Lv.' + p.level));
    a.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.vbtn[data-view="board"]').click();
      var target = document.getElementById('slot-' + (idx + 1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setMenu(false);
    });
    pop.appendChild(a);
  });
  function setMenu(open) {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); setMenu(pop.hidden); });
  document.addEventListener('click', function (e) { if (!pop.hidden && !pop.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // 能力加總:把所有小夥伴的同名能力加在一起
  function buildSummary() {
    var box = document.getElementById('summary');
    var groups = {}, order = [];
    window.PARTNERS.forEach(function (p) {
      if (!p.values || !p.abilities) return;
      p.abilities.forEach(function (g) {
        g.items.forEach(function (a) {
          if (!a.name) return;
          var key = a.name + '|' + a.unit;
          if (!groups[key]) { groups[key] = { name: a.name, unit: a.unit, total: 0, who: [] }; order.push(key); }
          groups[key].total += a.per * p.level;
          groups[key].who.push(p.name);
        });
      });
    });
    // 依能力名稱分類
    var CATS = [
      { title: '蝸牛屬性', test: function (n) { return n.indexOf('蝸牛') === 0 && n !== '蝸牛領導力'; } },
      { title: '兵種', test: function (n) { return n === '蝸牛領導力' || /兵種數量$/.test(n); } },
      { title: '部隊加成', test: function (n) { return n.indexOf('每10個') === 0; } },
      { title: '研究基因', test: function (n) { return /^研究.*基因/.test(n); } },
      { title: '醫療', test: function (n) { return n.indexOf('醫療') === 0; } },
      { title: '其他', test: function () { return true; } }
    ];
    var byCat = CATS.map(function () { return []; });
    order.forEach(function (key) {
      var n = groups[key].name;
      for (var c = 0; c < CATS.length; c++) {
        if (CATS[c].test(n)) { byCat[c].push(key); break; }
      }
    });
    // 蝸牛屬性固定排序:依此順序排列,沒列到的(如領導力)排在後面
    var SNAIL_ORDER = ['蝸牛攻擊', '蝸牛防禦', '蝸牛生命', '蝸牛追擊', '蝸牛人氣', '蝸牛文化', '蝸牛信仰', '蝸牛藝術', '蝸牛科技'];
    byCat[0].sort(function (a, b) {
      var ia = SNAIL_ORDER.indexOf(groups[a].name), ib = SNAIL_ORDER.indexOf(groups[b].name);
      if (ia < 0) ia = SNAIL_ORDER.length;
      if (ib < 0) ib = SNAIL_ORDER.length;
      return ia - ib;
    });
    // 兵種:領導力最前面,接著依巨龍、惡魔、異種、喪屍、天使、機械
    var UNIT_ORDER = ['蝸牛領導力', '巨龍類兵種數量', '惡魔類兵種數量', '異種類兵種數量', '喪屍類兵種數量', '天使類兵種數量', '機械類兵種數量'];
    byCat[1].sort(function (a, b) {
      var ia = UNIT_ORDER.indexOf(groups[a].name), ib = UNIT_ORDER.indexOf(groups[b].name);
      if (ia < 0) ia = UNIT_ORDER.length;
      if (ib < 0) ib = UNIT_ORDER.length;
      return ia - ib;
    });
    // 研究基因:所有種族在最前面,接著依巨龍、惡魔、異種、喪屍、天使、機械
    var GENE_ORDER = ['研究所有基因速度', '研究巨龍類基因免費時間', '研究惡魔類基因免費時間', '研究異種類基因免費時間', '研究喪屍類基因免費時間', '研究天使類基因免費時間', '研究機械類基因免費時間'];
    byCat[3].sort(function (a, b) {
      var ia = GENE_ORDER.indexOf(groups[a].name), ib = GENE_ORDER.indexOf(groups[b].name);
      if (ia < 0) ia = GENE_ORDER.length;
      if (ib < 0) ib = GENE_ORDER.length;
      return ia - ib;
    });
    // 醫療:所有兵種在最前面,接著依巨龍、惡魔、異種、喪屍、天使、機械
    var HEAL_ORDER = ['醫療所有兵種速度', '醫療巨龍類速度', '醫療惡魔類速度', '醫療異種類速度', '醫療喪屍類速度', '醫療天使類速度', '醫療機械類速度'];
    byCat[4].sort(function (a, b) {
      var ia = HEAL_ORDER.indexOf(groups[a].name), ib = HEAL_ORDER.indexOf(groups[b].name);
      if (ia < 0) ia = HEAL_ORDER.length;
      if (ib < 0) ib = HEAL_ORDER.length;
      return ia - ib;
    });
    box.appendChild(el('p', 'sum-note', '依各小夥伴目前等級計算,共 ' + order.length + ' 項能力。'));
    var tabs = el('div', 'sum-tabs');
    tabs.setAttribute('role', 'tablist');
    box.appendChild(tabs);
    var panels = [];
    function showTab(i) {
      panels.forEach(function (pn, k) {
        pn.panel.hidden = k !== i;
        pn.tab.setAttribute('aria-selected', String(k === i));
      });
    }
    CATS.forEach(function (cat, c) {
      if (!byCat[c].length) return;
      var panel = el('div', 'sum-panel');
      var tab = el('button', 'sum-tab', cat.title + '(' + byCat[c].length + ')');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      (function (idx) { tab.addEventListener('click', function () { showTab(idx); }); })(panels.length);
      tabs.appendChild(tab);
      panels.push({ tab: tab, panel: panel });
      box.appendChild(panel);
      // 部隊加成再依「攻擊、生命…」分組;其他分類只有一組
      var subs = [{ title: '', keys: byCat[c] }];
      if (cat.title === '部隊加成') {
        subs = ['攻擊', '生命', '防禦', '追擊'].map(function (stat) {
          return { title: stat, keys: byCat[c].filter(function (k) { return groups[k].name.slice(-2) === stat; }) };
        });
        var rest = byCat[c].filter(function (k) {
          return ['攻擊', '生命', '防禦', '追擊'].indexOf(groups[k].name.slice(-2)) < 0;
        });
        if (rest.length) subs.push({ title: '其他', keys: rest });
      }
      subs.forEach(function (sub) {
        if (!sub.keys.length) return;
        if (sub.title) panel.appendChild(el('h3', 'sum-sub', sub.title + '(' + sub.keys.length + ')'));
        var table = el('table', 'sum-table');
        var head = el('tr');
        ['能力', '合計', '來源'].forEach(function (t) { head.appendChild(el('th', null, t)); });
        table.appendChild(head);
        sub.keys.forEach(function (key) {
          var g = groups[key];
          var tr = el('tr');
          var td1 = el('td'); td1.appendChild(richName(g.name)); tr.appendChild(td1);
          tr.appendChild(el('td', 'sum-val', '+' + (Math.round(g.total * 100) / 100) + g.unit));
          tr.appendChild(el('td', 'sum-who', g.who.join('、')));
          table.appendChild(tr);
        });
        panel.appendChild(table);
      });
    });
    showTab(0);
  }
  buildSummary();

  // 頁面切換:小夥伴 / 能力加總
  var views = { board: document.getElementById('board'), summary: document.getElementById('summary') };
  document.querySelectorAll('.vbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      Object.keys(views).forEach(function (k) { views[k].hidden = k !== b.dataset.view; });
      document.querySelectorAll('.vbtn').forEach(function (x) {
        x.setAttribute('aria-current', String(x === b));
      });
      window.scrollTo(0, 0);
    });
  });
})();
