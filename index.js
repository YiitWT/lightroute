
const net = require("net");
const fs = require("fs"); 
const path = require("path");
const glob = require("glob");
const errdata = {
err1:fs.readFileSync(path.join(__dirname,"cdn/err1.html"),'utf8'),
err2:fs.readFileSync(path.join(__dirname,"cdn/err2.html"),'utf8'),
}
const packversion = require("./package.json").version

senderrweb = function(x,err,data){
  return x.html(errdata.err1+err+`</code></pre></div><p style="color: gray; margin-left: 10px; font-family: sans-serif;">`+data+errdata.err2)
}
statuscd = function (data){
  if(data.code == 404 || data.code == 500){
    data.req.status(data.code)
    senderrweb(
      data.res,
      "Lightroute crashed "+data.status+"\nStatus code:"+data.code+"\n\n"+(data.erorr || ""),
      "Node version: "+process.version+"<br>Lightroute version: v"+packversion
      )
  }
}
class lightroute {
  constructor() {
    this.pages = []
    this.allfunction = undefined
    this.server = net.createServer((socket) => {      
      socket.on("data", (data) => {
           data = data.toString("utf8")
           var res = {}
           var req = {}
           var tempdata = this.pages.filter(z=>{
            if(z.paramsbool){
              req.params = {}
              const paramMatches = z.name.match(/:\w+/g); 
              const valueMatches = data.split("HTTP")[0].match(new RegExp(z.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/:\w+/g, '(\\w+)'))); 
              const paramsAndValues = {};
              if (paramMatches !== null && valueMatches !== null) {
                paramMatches.forEach((param, index) => {
                  paramsAndValues[param.substring(1)] = valueMatches[index + 1];
                });
                req.params = paramsAndValues
                return true;
              }else{
                return false
              }
            }else{
              if(z.name == data.split("HTTP")[0]) return true
            }
           })
           
           req.sendtextcookie = ""
           req.mobile = data.split("sec-ch-ua-mobile")
           req.platform = data.split("sec-ch-ua-platform: ")
           req.useragent = data.split("User-Agent: ")
           req.languages = data.split("Accept-Language: ")
           req.language = "en"
           req.referer = data.split("Referer: ")
           req.cookie = data.split("Cookie: ")
           req.ip = socket.remoteAddress.replace("::ffff:","").replace("::","")
           req.ipv6 = socket.remoteAddress
           if(tempdata.length && tempdata[0].body){
            req.body = data.split("\r\n\r\n").pop().split('&').reduce((acc, current) => {
              const [name, value] = current.split('=');
              acc[name] = value;
              return acc;
             }, {});
           }
           if(req.platform.length > 1) req.platform = req.platform[1].split("\r\n")[0]; else req.platform = ""
           if(req.useragent.length > 1) req.useragent = req.useragent[1].split("\r\n")[0]; else req.useragent = ""
           if(req.languages.length > 1) req.languages = req.languages[1].split("\r\n")[0],req.language = req.languages.split(",")[0]; else req.languages = ""
           if(req.referer.length > 1) req.referer = req.referer[1].split("\r\n")[0]; else req.referer = ""
           if(req.cookie.length > 1) {
            req.cookie = req.cookie[1].split("\r\n")[0].split('; ').reduce((acc, current) => {
                  const [name, value] = current.split('=');
                  acc[name] = value;
                  return acc;
              }, {});
           }else req.cookie = {}
           if(req.mobile.length > 1) req.mobile = req.mobile[1].split("\r\n")[0] == ": ?1" ? true : false
           req.path = data.split("HTTP")[0]
           req.datastatus = 200
           res.type = "text/html"
           res.content = ""
           req.status = function(x){
            return req.datastatus = x
           }
           res.json = function(data){
            res.type = "application/json"
            try{res.content = JSON.stringify(data,null,2)
            }catch{res.content = {}}
            return sendit()
           }
           res.text = function(data){
            res.type = "text/plain"
            res.content = data
            return sendit()
           }
           res.html = function(data){
            res.type = "text/html"
            res.content = data
            return sendit()
           }
           res.settype = function(data){
            return res.type = data
           }
           req.writehttp = function(data){
            try{socket.write(data); return socket.end();}catch{}
           }    
           function sendit(){
            try{if (!socket.destroyed && !socket.writableEnded) {socket.write(`HTTP/1.1 ${req.datastatus}\r\nContent-Type: ${res.type}${req.sendtextcookie}\r\n\r\n${res.content}`)
            return socket.end();}}catch{}
           }    
           res.redirect = function(url){
            try{socket.write("HTTP/1.1 302 Found\r\nLocation: " + url + "\r\n\r\n");
            return socket.end();}catch{}
           }
           res.end = function(){
            try{return socket.end();}catch{}
           }
           req.setcookie = function(name, value,time){
            if(typeof time == "number"){
              if(time < Date.now()){ time = "Expires="+new Date(Date.now() + time).toUTCString();
              }else time = "Expires="+new Date(Date.now()).toUTCString();
            }
            return req.sendtextcookie +="\r\nSet-Cookie: "+name+"="+value+"; "+ time
           }
           req.removecookie = function(name){
            return req.sendtextcookie +="\r\nSet-Cookie: "+name+"=deleted; Expires=Thu, 01 Jan 1970 00:00:00 GMT;"
           }
           req.delcookie = req.removecookie
           res.goto = res.redirect
           res.send = function(name,exdata){
            if(!res.content){
              if(name.match("html")) res.type = "text/html"
              else if(name.match("json")) res.type = "application/json"
              else if(name.match("xml")) res.type = "application/xml"
              else if(name.match("css")) res.type = "text/css"
              else if(name.match("javascript")) res.type = "text/javascript"
              else if(name.match("js")) res.type = "text/javascript"
              else if(name.match("png")) res.type = "image/png"
              else if(name.match("gif")) res.type = "image/gif"
              else if(name.match("jpeg")) res.type = "image/jpeg"
              else if(name.match("jpg")) res.type = "image/jpeg"
              else if(name.match("svg")) res.type = "image/svg+xml"
              else if(name.match("mpeg")) res.type = "video/mpeg"
              else if(name.match("mov")) res.type = "video/quicktime"
              else if(name.match("mkv")) res.type = "video/x-matroska"
              else if(name.match("mp4")) res.type = "video/mp4"
              else if(name.match("zip")) res.type = "application/zip"
              else if(name.match("txt")) res.type = "text/plain"
              else if(name.match("rdf")) res.type = "application/rdf+xml"
              else if(name.match("atom")) res.type = "application/atom+xml"
              else if(name.match("rss")) res.type = "application/rss+xml"
              else if(name.match("pdf")) res.type = "application/pdf"
              else res.type = "application/octet-stream"
            }
            try{
              res.content = fs.readFileSync(name, 'utf8')
              if(exdata) try{ Object.keys(exdata).forEach((name) => {
                res.content = res.content.replaceAll("{= "+name+" =}",exdata[name])
              })}catch{}
              return sendit()
            }catch(e){
              return statuscd({
                code:404,
                erorr:e,
                status:data.split("HTTP")[0],
                req:req,
                res,res
              })
            }
           }
           res.download = function(file,filename){
            try{
              if(!filename) filename = file
              const fsfile = fs.createReadStream(file);
              try{if (!socket.destroyed && !socket.writableEnded) {
                socket.write(`HTTP/1.1 200 OK\r\nContent-Disposition: attachment; filename=${filename}\r\n\r\n`)
                }}catch{}

                fsfile.on('data', (chunk) => {
                socket.write(chunk);
              });
          
              fsfile.on('end', () => {
               try{return socket.end();}catch{}
              });
          
              fsfile.on('error', (error) => {
                return statuscd({
                  code:500,
                  erorr:error,
                  status:data.split("HTTP")[0],
                  req:req,
                  res,res
                })
              });
            }catch(e){
              return statuscd({
                code:500,
                erorr:e,
                status:data.split("HTTP")[0],
                req:req,
                res,res
              })
            }
           }
           if(this.allfunction) this.allfunction(req,res,{next:sendout})
           else sendout()
           function sendout(){
           if(!tempdata.length) return statuscd({
            code:404,
            status:data.split("HTTP")[0],
            erorr:"Page not found",
            req:req,
            res,res
          })

         try { return tempdata[0].func(req,res)}catch(e){
          return statuscd({
            code:500,
            status:data.split("HTTP")[0],
            erorr:e,
            req:req,
            res,res
          })
         }
        }
      });
    });
  }
  get(str,fnc){
    this.pages.push({
      name:"GET "+str+" ",
      func:fnc,
      paramsbool:str.split("/:").length > 1 ? true : false
    })
  }
  delete(str,fnc){
    this.pages.push({
      name:"DELETE "+str+" ",
      func:fnc,
      paramsbool:str.split("/:").length > 1 ? true : false
    })
  }

  post(str,fnc){
    this.pages.push({
      name:"POST "+str+" ",
      func:fnc,
      paramsbool:false,
      body:true
    })
  }

  put(str,fnc){
    this.pages.push({
      name:"PUT "+str+" ",
      func:fnc,
      paramsbool:str.split("/:").length > 1 ? true : false,
      body:true
    })
  }

  async static(data,ignore) {
    const files = await glob.globSync(data.replaceAll(".","**"), { ignore: ignore || 'node_modules/**' })
    files.map((x)=>{
      x = x.replaceAll("\\","/")
      const tempx = x.replace(".","").startsWith("/") ? x : "/"+x
      this.pages.push({
        name:"GET "+ tempx +" ",
        func:function(req,res){
          res.send(x)
        },
        paramsbool:false
      })
    })
  }
  
  all(fnc){
    this.allfunction = fnc
  }

  status(fnc){
    this.statuscd = fnc
  }

  listen(port,callback) {
    this.server.listen(port);
    if(callback) callback();
  }
}
module.exports = lightroute;