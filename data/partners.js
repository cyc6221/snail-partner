// span: 1 = 佔單欄,2 = 橫跨兩欄
// main:本命種族,該格會突出顯示
// bonus:特別加成,依種族名稱填(顯示成 90+10)
// 名稱中用 {兵種} 括起來的文字會突出顯示
// abilities:能力區塊(每個區塊一欄,各有 title 與 items);數值 = 等級 × per(每級增加量),unit 為單位
// values 依序對應 RACES:喪屍 惡魔 天使 異種 機械 巨龍
var RACES = ['喪屍', '惡魔', '天使', '異種', '機械', '巨龍'];
window.PARTNERS = [
  { id: 'p1', name: '頂罐子蝸牛', level: 6, span: 1, values: [43, 32, 90, 19, 11, 25], main: '天使',
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
  { id: 'p2', name: '朴巨姬',     level: 16, span: 1, values: [50, 90, 50, 50, 50, 50], main: '惡魔', bonus: { '惡魔': 10 },
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
  { id: 'p3', name: '猗猗卡卡',   level: 11, span: 2, values: [36, 37, 36, 90, 36, 36], main: '異種',
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
  { id: 'p4', name: '王子的靈魂', level: 22, span: 1, values: [90, 70, 70, 70, 70, 70], main: '喪屍', bonus: { '喪屍': 10 },
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
  { id: 'p5', name: '豐田次郎',   level: 6, span: 1, values: [18, 30, 28, 34, 90, 20], main: '機械',
    abilities: [
      { title: '次郎的排水溝過彎法', items: [
        { name: '蝸牛信仰', per: 5, unit: '' },
        { name: '研究機械類基因免費時間', per: 30, unit: 's' }
      ] },
      { title: '指揮', items: [
        { name: '機械類兵種數量', per: 1, unit: '' },
        { name: '每10個{維修戰車}部隊生命', per: 100, unit: '' }
      ] }
    ] }
];
window.PARTNERS.forEach(function (p) {
  p.stats = RACES.map(function (r, i) { return [r, p.values[i], (p.bonus && p.bonus[r]) || 0]; });
});
