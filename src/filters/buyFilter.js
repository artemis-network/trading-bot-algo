module.exports.checkForBuyFilter = (message) => {
  const buySetup = /(#[A-Z])\w+ [bB][uU][yY] [sS][eE][tT][uU][pP]/;
  if (message.match(buySetup)) return true;
  return false;
};
