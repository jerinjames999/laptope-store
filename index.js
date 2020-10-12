const fs = require('fs');
const http = require('http');
const url = require('url');
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
const server = http.createServer((req,res) => {
    //console.log('someone accessed the server');
    //console.log(req.url);
    const pathname = url.parse(req.url, true).pathname;
    console.log(pathname);
    const id = url.parse(req.url, true).query.id;
    if ( pathname === '/products' || pathname === '/'){
        res.writeHead(200,{'Content-type': 'text/HTML'});
        fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8', (err,data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/template-card.html`,'utf-8',(err,data) => {
                const cardOutput = laptopData.map(el => replaceTemplate(data,el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardOutput);
                res.end(overviewOutput); 
            });
        });

    }
else if (pathname === '/laptop' && id < laptopData.length){
    res.writeHead(200,{'Content-type': 'text/HTML'});
    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
        const laptop = laptopData[id];
        const output = replaceTemplate(data,laptop);
        res.end(output);

    });
}
//regular expression to check whether the route is an image or not.
else if((/\.(jpg|jpeg|png|gif)$/i).test(pathname)){
    fs.readFile(`${__dirname}/data/img${pathname}`,(err,data) => {
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(data);
    });
}
else{
    res.writeHead(404, {'Content-type': 'text/HTML'});
    res.end('URL not found');
}
});
    
server.listen(8080,'127.0.0.1', ()=> {
    console.log("listening..");
});

function replaceTemplate(originalhtml,laptop){
    let output = originalhtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}