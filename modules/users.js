const database = require("./database");
const jwt = require('jsonwebtoken');
const secrets = require("./secrets");
const fest = require("./fest");
const bcrypt = require("bcrypt");
const qrcode = require('./qrcode');

const usertypes = [
    {name:'adm', privilege:100},
    {name:'mod', privilege:50},
    {name:'user', privilege:0},
];
const users = database.load ("users") || [];
//console.log(users);

function indexOf (username)
{
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == username)
        {
            return i;
        }  
    }
    return -1;
}

async function create (req, res)
{
    //console.log(req.ip); //::1
    const { username, password, fullname, privilege } = req.body;

    if(!req.user) 
    {
        //res.redirect('back');
        res.json({text:"Você não está logado!", color:"purple"});
    }
    else 
    {
        if(req.user.privilege <= privilege)
        {
            res.json({text:"Você não tem privilégio para cadastrar um novo usuário!", color:"red"});
        }
        else
        {
            const userid = indexOf(username);
            if(userid != -1) 
            {
                res.json({text:"Este usuário já existe!", color:"red"});
            }
            else 
            {
                try {
                    const phash = await bcrypt.hash(password || "", 12);
                    //console.log(phash);
                    const newuser = 
                    {
                        username,
                        password:phash,
                        fullname,
                        privilege
                    };
                    users.push(newuser);
                    database.save("users", users);
                    res.json({text:"Usuario salvo com sucesso!", color:"green"});
                }
                catch (error) 
                {
                    console.log(error);
                    res.json({text:error, color:"red"});
                }
            }
        }
    }
}

async function login (req, res)
{
    const { username, password } = req.body;
    //console.log(req.body);
    const userid = indexOf(username);
    //console.log(userid);
    if(userid == -1) res.json({text:"Usuario não existe!", color:"red"});
    else 
    {
        bcrypt.compare(password, users[userid].password, function(err, e) {
            if(e == true) 
            {
                res.cookie('token', `${secrets.lock(userid)}`, 
                { 
                    maxAge: 900000,
                    //path: "http://localhost/",
                    /* sameSite: "None", */
                    //secure: true,
                    httpOnly: true
                });
                res.json({text:"Usuario logado com sucesso!", color:"green"});
            } 
            else 
            {
                res.json({text:"Esta senha está errada!", color:"red"});
            }
        });
        
    }
}

async function get (token)
{
    if(!token) return undefined;
    const userid = secrets.unlock(token);
    if(!userid) return undefined;
    return users[parseInt(userid)];
}

async function verify (req, res, next)
{
    const token = req.cookies["token"];
    if(token)
    {
        req.user = await get(token); 
    } else {
        //res.redirect('../');
    }
    next();
}

async function userdata (req, res)
{
    if(req.user)
    {
        //console.log("Com token");
        const { fullname, privilege } = req.user;
        res.json({fullname, privilege});
    }
    else 
    {
        //console.log("Sem token");
        res.json({text:"Usuario não está logado!", color:"red"});
    }
}

async function newTicket (req, res)
{
    if(!req.user) 
    {
        //res.redirect('back');
        res.json({text:"Você não está logado!", color:"purple"});
    }
    else 
    {
        const user = req.user;
        const eventid = req.body["eventid"];
        console.log(eventid)
        const event = fest.events[eventid];
        if(event){
            if(!user.tickets) user.tickets = [];
            const ticket = { eventid:eventid, user:user.username};
            const ticketid = fest.addticket(ticket);
            user.tickets.push(ticketid);
            database.save("users", users);
            res.json({text:`Seu ticket foi salvo com o id:${ticketid}!`, color:"red"});
        }
        else 
        {
            res.json({text:"Este evento não existe!", color:"red"});
        }
        /* events.push(event);
        database.save("events", events); */
        
    }
}

async function tickets (req, res)
{
    if(!req.user) 
    {
        //res.redirect('back');
        res.json({text:"Você não está logado!", color:"purple"});
    }
    else 
    {
        const tickets = [];
        if(req.user.tickets) 
        {
            req.user.tickets.forEach(ticketid => 
            {
                const ticket = fest.tickets[ticketid];
                
                if(!ticket.used) tickets.push({key:ticket.key, event:fest.events[ticket.eventid].name});
            });
            
        }
        res.json({text:"Você possui estes tickets:", color:"green", tickets});
    }
}

async function ticket (req, res)
{
    res.json({ticket:qrcode.generate(`http://192.168.0.200:8000/ticket?token=${req.body["key"]}`)});
}

async function checkticket (req, res) 
{
    console.log(req.query);
    const key = req.query["token"];
    console.log(key);
    if(key)
    {
        const unlocked = secrets.unlock(key).replaceAll('"', '');
        console.log(unlocked);
        const ticketid = parseInt(unlocked);
        console.log(ticketid);
        const ticket = fest.tickets[ticketid];

        if(!ticket.used)
        {
            const {name, date, location } = fest.events[ticket.eventid];
            const event = {name, date:date.replace("T", " "), location:`${location.street}, ${location.number}. ${location.district}. ${location.city}, ${location.state}` };
            const {fullname, privilege, username, tickets} = users[indexOf(ticket.user)];
            const user = {fullname, user:`${username}(lvl:${privilege})`, tickets:`tickets:${tickets}`};
            event.people.now++;
            database.save("events", fest.events);
            ticket.used = true;
            database.save("tickets", fest.tickets);
            function orginizetxt (clss)
            {
                const values = Object.values(clss);
                return values.reduce((priv, curr) => {return priv+`<p>${curr}</p>`}, "");
            }
            console.log(ticket);
            res.send(`
            <link rel="stylesheet" href="styles/style.css">
            <h1>AplicaFest</h1>
            <div id="show">
            <div><h2>EVENTO:</h2>${orginizetxt(event)}</div>
            <div><h2>USUARIO:</h2>${orginizetxt(user)}</div>
            </div>
            `);
        }
        else 
        {
            res.send("ESTE TICKET JÁ FOI USADO!");
        }
    }
    else {
        res.send("ESTE TICKET NÃO EXISTE!!");
    }
}

async function logout (req, res)
{
    res.cookie('token', '', 
    { 
        maxAge: 0,
        //path: "http://localhost/",
        /* sameSite: "None", */
        //secure: true,
        httpOnly: true
    });
    res.redirect('back');
    //res.end();
}

module.exports = { login, create, verify, userdata, logout, get, newTicket, tickets, ticket, checkticket };