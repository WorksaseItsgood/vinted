const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = async (min, max) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await sleep(delay);
};

module.exports = {
    sleep,
    randomDelay
};
