module.exports = (client) => {
  client.checkValidDamage = (infraction) => {
    const now = Date.now();
    let timeToCheck = 604800000;
    switch (infraction.damage) {
      case 0:
        timeToCheck = 0;
        break;
      case 0.25:
        timeToCheck *= 1;
        break;
      case 0.5:
        timeToCheck *= 2;
        break;
      case 1:
        timeToCheck *= 4;
        break;
      case 3:
        timeToCheck *= 12;
        break;
      default:
        console.error("Something's fucked.");
        break;
    }

    if (timeToCheck + infraction.date > now) {
      return true;
    }

    return false;
  };
};
