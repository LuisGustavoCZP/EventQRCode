const express = require('express');
const cookieParser = require('cookie-parser');

const users = require('./modules/users');
const fest = require("./modules/fest");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/scripts", express.static("./src/scripts"));
app.use("/styles", express.static("./src/styles"));

app.get("/", users.verify, async (req, res)=>
{
    if(req.user)
    {
        //const user = await users.get(token);
        if(req.user.privilege > 50)
        {
            res.sendFile(__dirname+"/src/admin/index.html");
        }
        else 
        {
            res.sendFile(__dirname+"/src/client/index.html");
        }
        //console.log(req.user);
        //res.send(qrcode.generate("http://192.168.0.200:8000/"));
    }
    else 
    {
        res.sendFile(__dirname+"/src/user/index.html");
    }
});

app.post("/register/user", users.verify, users.create);

app.post("/register/event", users.verify, fest.create);

app.post("/event/add", users.verify, users.newTicket);

app.post("/event/ticket", users.verify, users.ticket);

app.post("/login", users.login);

app.get("/event/all", users.verify, fest.all);

app.get("/event/tickets", users.verify, users.tickets);

app.get("/userdata", users.verify, users.userdata);

app.get("/logout", users.logout);

app.get("/ticket", users.checkticket);

app.get("/:path", users.verify, async (req, res)=>
{
    const param = req.params["path"];
    if(req.user)
    {
        if(req.user.privilege > 50)
        {
            if(param == "newuser")
            {
                res.sendFile(__dirname+"/src/admin/register-user.html");
            } 
            else if(param == "newevent")
            {
                res.sendFile(__dirname+"/src/admin/register-event.html");
            } 
            else if(param == "readqr")
            {
                res.sendFile(__dirname+"/src/admin/scanqr.html");
            }
            else 
            {
                res.sendFile(__dirname+"/src/admin/index.html");
            }
        }
        else 
        {
            if(param == "events")
            {
                res.sendFile(__dirname+"/src/client/events.html");
            }
            else if(param == "tickets")
            {
                res.sendFile(__dirname+"/src/client/tickets.html");
            }/* 
            else if(param == "qrcode")
            {
                res.send(qrcode.generate(`http://192.168.0.200:8000/ticket/${req.query["ticket"]}`));
            }
             */else 
            {
                res.sendFile(__dirname+"/src/client/index.html");
            }
        }
    }
    else 
    {
        res.sendFile(__dirname+"/src/user/index.html");
    }
});

app.listen(3000, () => {console.log("Servidor iniciado!")});