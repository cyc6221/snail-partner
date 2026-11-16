// 由六圍總和換算等級
// 每升一級需要的六圍點數:Lv.1~10 每級 10、Lv.11~20 每級 15、Lv.21~30 每級 20(每 10 級 +5)
// Lv.1 的起點(170)是由 Lv.7 = 230 往回推的,低於 Lv.7 的部分尚未驗證
function levelFromTotal(total) {
  var level = 1, need = 170;
  for (;;) {
    var cost = 10 + 5 * Math.floor((level - 1) / 10);
    if (total < need + cost) return level;
    need += cost;
    level++;
  }
}
