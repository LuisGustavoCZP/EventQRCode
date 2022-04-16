const database = require("./database");
const secrets = require("./secrets");
const users = require("./users");

const events = database.load ("events") || [];
const tickets = database.load ("tickets") || [];

async function create (req, res)
{
    if(!req.user) 
    {
        //res.redirect('back');
        res.json({text:"Você não está logado!", color:"purple"});
    }
    else 
    {
        const event = req.body;
        event.people = {total:0, now:0};
        events.push(event);
        database.save("events", events);
        res.json({text:"Evento salvo com sucesso!", color:"green"});
    }
}

async function all (req, res)
{
    res.json(events);
}

function addticket (ticket)
{
    const ticketid = tickets.length;
    ticket.key = secrets.lock(`${ticketid}`);
    ticket.used = false;
    const event = events[ticket.eventid];
    event.people.total++;
    database.save("events", events);
    tickets.push(ticket);
    database.save("tickets", tickets);
    return ticketid;
}

module.exports = { create, all, addticket, events, tickets };