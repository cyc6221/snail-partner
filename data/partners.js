// LAYOUT:每個數字是一列的格子數,1 = 整列一格(橫跨兩欄),2 = 一列兩格
// 等級不用填,由六圍總和自動換算(見 js/level.js)
// slot:小夥伴放在第幾格(從 0 起算,依列由左到右);沒人的格子會顯示成空格
// TOTAL:小夥伴總數(用來顯示開發進度)
var TOTAL = 31;
var LAYOUT = '212' + '122221222122222'; // 前五位(2、1、2 列)+ 後續格子;最後一列是兩格,但只開到 TOTAL 為止,右邊留空
// main:本命種族,該格會突出顯示
// bonus:特別加成,依種族名稱填(顯示成 90+10)
// 名稱中用 {兵種} 括起來的文字會突出顯示
// abilities:能力區塊(每個區塊一欄,各有 title 與 items);數值 = 等級 × per(每級增加量),unit 為單位
// values 依序對應 RACES:喪屍 惡魔 天使 異種 機械 巨龍
var RACES = ['喪屍', '惡魔', '天使', '異種', '機械', '巨龍'];
window.PARTNERS = [
  { id: 'p1', name: '頂罐子蝸牛', slot: 0, values: [43, 32, 90, 19, 11, 25], main: '天使',
    abilities: [
      { title: '頂罐子蝸牛的料理', items: [
        { name: '蝸牛科技', per: 5, unit: '' },
        { name: '蝌蚪池黑蝌蚪產量', per: 0.3, unit: '%' }
      ] },
      { title: '指揮', items: [
        { name: '天使類兵種數量', per: 1, unit: '' },
        { name: '每10個{高麗蝸牛}部隊生命', per: 100, unit: '' }
      ] }
    ] },
  { id: 'p2', name: '朴巨姬',     slot: 1, values: [50, 90, 50, 50, 50, 50], main: '惡魔', bonus: { '惡魔': 10 },
    abilities: [
      { title: '監獄健身術', items: [
        { name: '蝸牛人氣', per: 5, unit: '' },
        { name: '蝸牛攻擊', per: 5, unit: '' }
      ] },
      { title: '指揮', items: [
        { name: '惡魔類兵種數量', per: 1, unit: '' },
        { name: '每10個{鐵球門弟子}部隊攻擊', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p3', name: '猗猗卡卡',   slot: 2, values: [36, 37, 36, 90, 36, 36], main: '異種',
    abilities: [
      { title: '猗猗卡卡的嘴', items: [
        { name: '蝸牛文化', per: 5, unit: '' },
        { name: '蝸牛攻擊', per: 5, unit: '' }
      ] },
      { title: '指揮', items: [
        { name: '異種類兵種數量', per: 1, unit: '' },
        { name: '每10個{異獸幼體}部隊攻擊', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p4', name: '王子的靈魂', slot: 3, values: [90, 70, 70, 70, 70, 70], main: '喪屍', bonus: { '喪屍': 10 },
    abilities: [
      { title: '王子的詛咒', items: [
        { name: '蝸牛信仰', per: 5, unit: '' },
        { name: '供奉靈魂速度', per: 0.6, unit: '%' }
      ] },
      { title: '指揮', items: [
        { name: '喪屍類兵種數量', per: 1, unit: '' },
        { name: '每10個{陪葬俑}部隊防禦', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p5', name: '豐田次郎',   slot: 4, values: [18, 30, 28, 34, 90, 20], main: '機械',
    abilities: [
      { title: '次郎的排水溝過彎法', items: [
        { name: '蝸牛信仰', per: 5, unit: '' },
        { name: '研究機械類基因免費時間', per: 30, unit: 's' }
      ] },
      { title: '指揮', items: [
        { name: '機械類兵種數量', per: 1, unit: '' },
        { name: '每10個{維修戰車}部隊生命', per: 100, unit: '' }
      ] }
    ] },
  { id: 'p6', name: '蔥音', slot: 5, values: [9, 25, 90, 16, 55, 25], main: '天使',
    abilities: [
      { title: '蔥音的新番', items: [
        { name: '蝸牛藝術', per: 5, unit: '' },
        { name: '研究天使類基因免費時間', per: 30, unit: 's' }
      ] },
      { title: '指揮', items: [
        { name: '天使類兵種數量', per: 1, unit: '' },
        { name: '每10個{應援團}部隊生命', per: 100, unit: '' }
      ] }
    ] },
  { id: 'p7', name: '未來貓', slot: 6, values: [100, 100, 100, 100, 100, 100], main: '天使',
    abilities: [
      { title: '未來貓的次元科技', items: [
        { name: '蝸牛科技', per: 5, unit: '' },
        { name: '研究所有基因速度', per: 1, unit: '%' }
      ] },
      { title: '指揮', items: [
        { name: '天使類兵種數量', per: 1, unit: '' },
        { name: '每10個{貓童子}部隊追擊', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p8', name: '連名字都不能提的人', slot: 11, values: [98, 98, 98, 98, 98, 100], main: '巨龍', bonus: { '巨龍': 20 },
    abilities: [
      { title: '沒有名字的黑魔法', items: [
        { name: '蝸牛信仰', per: 5, unit: '' },
        { name: '研究惡魔類基因免費時間', per: 30, unit: 's' }
      ] },
      { title: '指揮', items: [
        { name: '巨龍類兵種數量', per: 1, unit: '' },
        { name: '每10個{冰霜幼龍}部隊攻擊', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p9', name: '滄龍', slot: 20, values: [96, 96, 96, 96, 96, 100], main: '巨龍', bonus: { '巨龍': 20 },
    abilities: [
      { title: '滄龍的巨齒', items: [
        { name: '蝸牛文化', per: 5, unit: '' },
        { name: '醫療巨龍類速度', per: 0.3, unit: '%' }
      ] },
      { title: '指揮', items: [
        { name: '巨龍類兵種數量', per: 1, unit: '' },
        { name: '每10個{小恐龍}部隊防禦', per: 10, unit: '' }
      ] }
    ] },
  { id: 'p10', name: '龍女中樞', slot: 21, values: [99, 99, 99, 98, 98, 100], main: '巨龍', bonus: { '巨龍': 10 },
    abilities: [
      { title: '龍女操作系統', items: [
        { name: '蝸牛科技', per: 5, unit: '' },
        { name: '醫療所有兵種速度', per: 0.3, unit: '%' }
      ] },
      { title: '指揮', items: [
        { name: '巨龍類兵種數量', per: 1, unit: '' },
        { name: '每10個{龍神胚胎}部隊防禦', per: 10, unit: '' }
      ] }
    ] }
];
window.PARTNERS.forEach(function (p) {
  p.stats = RACES.map(function (r, i) { return [r, p.values[i], (p.bonus && p.bonus[r]) || 0]; });
  p.total = p.stats.reduce(function (a, s) { return a + s[1] + s[2]; }, 0);
  p.level = levelFromTotal(p.total);
});
