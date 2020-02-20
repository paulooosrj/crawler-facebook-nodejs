const Bot = require('./bot');

(async () => {  

    const seletores = {
      titleSeletor: "div.fzHfmf > div.YOGjf",
      timeSeletor: ".cZQMwd", 
      localSeletor: ".ov85De",
      moreSeletor: "a.uaYYHd",
      imageSeletor: ".odIJnf img"
    };

    const bot = Bot.create('data.json', seletores, true)
      .language('pt-BR')
      .setUserAgent();


    const response = await bot.run('facebook evento metal');

    console.log(response);

})();