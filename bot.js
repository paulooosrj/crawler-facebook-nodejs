const puppeteer = require('puppeteer');
const fs = require("fs");

class Bot {

    static create(fileJson = 'data.json', seletores = {}, isDev = false){
        if(!Bot.instance){
            Bot.instance = new Bot(fileJson, seletores, isDev);
        } 
        return Bot.instance;
    }

    constructor(fileJson, seletores, isDev){
        this.fileJson = fileJson;
        this.isDev = isDev;
        this.seletores = seletores;
        return this;
    }

    language(lang = 'pt-BR'){
        this.lang = `--lang=${lang}`;
        return this;
    }

    setUserAgent(def = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'){
        this.userAgent = def;
        return this;
    }


    toQuery(str = 'facebook evento rock'){
        const query = str.replace(/\s/gim, '+');
        return `https://www.google.com/search?q=${query}&oq=${query}&ibp=htl;events&rciv=evn#htivrt=events&fpstate=tldetail`;
    }

    async makeBot(URL){
        
        const browser = await puppeteer.launch({
            args: this.isDev ? ['--proxy-server=proxy.redecorp.br:8080', this.lang ] : [ this.lang ]
        });
        
        const page = await browser.newPage();

        await page.setUserAgent(this.userAgent);

        await page.goto(URL);

        await page.waitForSelector(this.mainSelector);

        const dimensions = await page.evaluate((seletores) => new Promise((resolve, reject) => {

                const { titleSeletor, timeSeletor, localSeletor, moreSeletor, imageSeletor } = seletores;
            
                let titles = Array.from(document.querySelectorAll(titleSeletor));
                let times = Array.from(document.querySelectorAll(timeSeletor));
                let locals = Array.from(document.querySelectorAll(localSeletor));
                let images = Array.from(document.querySelectorAll(imageSeletor));
                let moreInfos = Array.from(document.querySelectorAll(moreSeletor));
            
                let links;
                
                setTimeout(() => {
            
                    links = titles.map((element, index) => {
            
                        return {
                            title: element.textContent,
                            date: times[index] ? times[index].textContent : '',
                            local: locals[index] ? locals[index].textContent : '',
                            link: moreInfos[index] ? moreInfos[index].href : '',
                            image: images[index] ? images[index].src : ''
                        };
                
                    });
            
                    resolve(links);
            
                }, 6000);

        }), this.seletores);

        fs.writeFileSync(this.fileJson, JSON.stringify(dimensions, null, 4), { encoding: 'utf8' });

        browser.close();

        return dimensions;

    }

    async run(query = '', mainSelector = ".UbEfxe.uAAqtb"){
        this.mainSelector = mainSelector;
        return await this.makeBot(this.toQuery(query));
    }   

}

module.exports = Bot;