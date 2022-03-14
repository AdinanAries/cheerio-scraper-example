const cheerio = require("cheerio");
const fetch = require("node-fetch");

//keep scrape function dynamic by adding url and query parameter
const scrape = async (url, query) => {
    //First we fetch from our url
    const website = await fetch(url).then(res => res.text());

    //Next we load the website with cheerio
    const $ = cheerio.load(website);

    //Then we can grab our a tags
    let queryRes = $(query).toArray();

    return queryRes;
}

// parse wiki page
const parsePresidents = async () => {
    const query = 'a';
    const url = "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States"; 

    //Grab our collection of a tags returned by scrape
    let aTags = await scrape(url, query);

    //Finaly we can filter our a tags
    aTags = aTags.filter(
        a => a.attribs.href?.match(/Presidenc[a-z]*_of/)
    );

    let presidents = aTags.map(
        a =>
        //Some of the presidents have middle initials
        a.attribs.href // 'Presidency_of_James_K.Polk'
        .splite("_") // ['Presidency', 'of', 'James', 'K.', 'Polk']
        .slice(2) // ['James', 'K.', 'Polk']
        .join(' ') // 'James K. Polk
    );

    presidents = presidents.filter(
        (ele, i, array) =>
        array.indexOf(ele) === 1
    )

    return presidents;
}


