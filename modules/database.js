const fs = require('fs');
const fsp = require('fs/promises');

let saving = false;
const waitingSavers = [];

function load (name)
{
    const filename = `database/${name}.json`;
    if(!fs.existsSync(filename)) return undefined;
    const file = JSON.parse(fs.readFileSync(filename));
    return file;
}

async function file (path)
{
    return await new Promise(function(resolve, reject) {
        fs.exists(path, (e) => 
        {
            if(e){
                resolve();
            } else {
                fs.mkdir(path, () => {resolve();})
            }
        });
    })
}

async function save (name, data)
{
    waitingSavers.push(()=>{write(name, data)});
    if(!saving)
    {
        saving = true;
        waitingSavers.pop()();
    }
}

async function write (name, data)
{
    await file('database');
    
    const filename = `database/${name}.json`;
    await fsp.writeFile(filename, JSON.stringify(data));
      
    if(waitingSavers.length > 0)
    {
        waitingSavers.pop()();
    } else {
        saving = false;
    }
}

module.exports = { load, save }