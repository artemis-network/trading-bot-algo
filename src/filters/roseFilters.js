module.exports.RoseFilter = class RoseFilter {
  static buyFilter = (message) => {
    const buySetup = /(#[A-Z])\w+ [bB][uU][yY] [sS][eE][tT][uU][pP]/;
    if (message.match(buySetup)) return true;
    return false;
  };

  static filter = (message) => {
    const isHavingBuySignal = RoseFilter.buyFilter(message);
    // can check more fitlers heres
    if (isHavingBuySignal) return true;
    return false;
  };
};
