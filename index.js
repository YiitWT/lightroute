const net = require("net");
const fs = require("fs"); 
const path = require("path");
const glob = require("glob");
const errdata = {
err1:fs.readFileSync(path.join(__dirname,"cdn/err1.html"),'utf8'),
err2:fs.readFileSync(path.join(__dirname,"cdn/err2.html"),'utf8'),
}
const packversion = require("./package.json").version
statuscd = function (data){
  if(data.code == 404 || data.code == 500){
    data.res.status(data.code)
    return data.res.html(errdata.err1+ "Lightroute crashed "+data.status+"\nStatus code:"+data.code+"\n\n"+(data.error || "")+
    `</code></pre></div><p style="color: gray; margin-left: 10px; font-family: sans-serif;">`+"Node version: "+process.version+"<br>Lightroute version: v"+packversion+errdata.err2)
   }
}
function swrite(socket,data){
  data = data.toString("utf8")
  var res = {}
  var req = {}
  var tempdata = pages.filter(z=>{
    if(z.name == data.split("HTTP")[0]) return true;
if(z.paramsbool){
var ee = data.split("HTTP")[0].split("/").slice(1)
var ccc = false;

  Object.keys(z.paramsbool).forEach((x,c) => {
    if(z.paramsbool[x][0] || ee[c] == z.paramsbool[x][1]) return;
    else ccc = true
  })
if(ccc) return;
req.params = {}
ee.map((x, c) => {
  if(!z.paramsbool[c][0]) return;
  req.params[z.paramsbool[c][1].slice(1)] = x.slice(0,-1);
});

return Object.keys(req.params).length > 0;
}
  return false;
})  

  req.sendtextcookie = ""
  req.headers = {}
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
    req.body = data.split("\r\n\r\n").pop()
    try{req.body = JSON.parse(req.body)}catch{
     req.body.split('&').reduce((acc, current) => {
      const [name, value] = current.split('=');
      acc[name] = value;
      return acc;
     }, {});}
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
  res.datastatus = 200
  res.type = "text/html"
  res.content = ""
  res.status = function(x){
   return res.datastatus = x
  }
  res.json = function(data){
   res.type = "application/json"
   try{res.content = JSON.stringify(data,null,2)
   }catch{res.content = {}}
   return sendit()
  }
  res.image = function(data,type){
    res.type = type || "image/png"
    res.content = data
    return sendit()
  }
  res.text = function(data){
   res.type = "text/plain"
   res.content = data
   return sendit()
  }
  res.txt = res.text
  res.html = function(data){
   res.type = "text/html"
   res.content = data
   return sendit()
  }
  res.writeHead = function(x,y){
   var data = x
   if(y) res.datastatus = x,data = y;
   if(data["Content-Type"]) res.type = data["Content-Type"]
   Object.keys(data).forEach((name) => {
     if(name == "Content-Type") return;
     req.headers[name] = data[name]
   })
  }
  res.settype = function(data){
   return res.type = data
  }
  req.writehttp = function(data){
   try{socket.write(data); return socket.end();}catch{}
  }   
  function sendit(){
   try{
     var headertext = ""
     Object.keys(req.headers).forEach((name) => {
       headertext+="\r\n"+name+": "+req.headers[name]
     })
   if (!socket.destroyed && !socket.writableEnded) {
    socket.write(`HTTP/1.1 ${res.datastatus}\r\nContent-Type: ${res.type}${headertext}${req.sendtextcookie}\r\n\r\n`)
    socket.write(res.content)
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
  req.deletecookie = req.removecookie
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
     res.content = fs.readFileSync(name)
     if(exdata) try{  res.content= res.content.toString("utf8")
      Object.keys(exdata).forEach((name) => {
       res.content = res.content.replaceAll("{= "+name+" =}",exdata[name])
     })}catch{}
     return sendit()
   }catch(e){
     return statuscd({
       code:404,
       error:e,
       socket:socket,
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
         error:error,
         socket:socket,
         status:data.split("HTTP")[0],
         req:req,
         res,res
       })
     });
   }catch(e){
     return statuscd({
       code:500,
       error:e,
       socket:socket,
       status:data.split("HTTP")[0],
       req:req,
       res,res
     })
   }
  }
  if(allfunctions.length) {
    let i = 0;
    const next = () => {
      if(i < allfunctions.length) {
        allfunctions[i++](req, res, next);
      } else sendout();
    }
    next();
  } else sendout();
  function sendout(){
  if(!tempdata.length) return statuscd({
   code:404,
   status:data.split("HTTP")[0],
   error:"Page not found",
   socket:socket,
   req:req,
   res,res
 })

try { return tempdata[0].func(req,res)}catch(e){
 return statuscd({
   code:500,
   socket:socket,
   status:data.split("HTTP")[0],
   error:e,
   req:req,
   res,res
 })
}
}
}
function analizeparams(y){
if(!y.includes(":")) return undefined
return y.split("/").slice(1).reduce((acc, x, c) => {
    acc[c] = [x.startsWith(":"), x];
    return acc;
}, {});
}

//////////////////////////////////////////////////////////////////////////////////////////
pages = []
allfunctions = []
class lightroute {
  constructor(options = {}) {
    this.server = null;
    this.options = {
      timeout: options.timeout || 120000, // 2 dakika varsayılan bağlantı zaman aşımı
      maxConnections: options.maxConnections || 1000, // maksimum bağlantı sayısı
      ...options
    };
  }
  
  get(str,fnc){
    pages.push({
      name:"GET "+str+" ",
      func:fnc,
      paramsbool:analizeparams(str),
    })
  }
  delete(str,fnc){
    pages.push({
      name:"DELETE "+str+" ",
      func:fnc,
      paramsbool:analizeparams(str),
    })
  }

  post(str,fnc){
    pages.push({
      name:"POST "+str+" ",
      func:fnc,
      paramsbool:false,
      body:true
    })
  }

  put(str,fnc){
    pages.push({
      name:"PUT "+str+" ",
      func:fnc,
      paramsbool:analizeparams(str),
      body:true
    })
  }
  use(...x){
    allfunctions.push(...x)
  }

  async static(data,ignore) {
    const files = await glob.globSync(data.replaceAll(".","**"), { ignore: ignore || 'node_modules/**' })
    files.map((x)=>{
      x = x.replaceAll("\\","/")
      const tempx = x.replace(".","").startsWith("/") ? x : "/"+x
      pages.push({
        name:"GET "+ tempx +" ",
        func:function(req,res){
          res.send(x)
        },
        paramsbool:false
      })
    })
  }
  
  all(fnc){
    allfunctions.push(fnc)
  }

  status(fnc){
    statuscd = fnc
  }
  http(req,res){
    let body = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`
    req.rawHeaders.forEach((x, index) => body += x + (index % 2 === 0 ? ": " : "\r\n"));
    swrite(res.socket,body)
  }

  listen(port, callback) {
    this.server = net.createServer((socket) => {
      // Bağlantı zaman aşımı ekleyelim
      socket.setTimeout(this.options.timeout);
      socket.on('timeout', () => {
        socket.end();
      });
      
      socket.on("data", swrite.bind(this, socket));
    });
    
    // Maksimum bağlantı limitini ayarlayalım
    if (this.options.maxConnections) {
      this.server.maxConnections = this.options.maxConnections;
    }
    
    this.server.listen(port);
    if(callback) callback();
    return this.server;
  }

  close(callback) {
    if (!this.server) {
      if (callback) callback(new Error('Server not running'));
      return;
    }
    
    const server = this.server;
    this.server = null;
    
    server.close((err) => {
      if (callback) callback(err);
    });
    
    return this; // Method chaining desteği için this döndürüyoruz
  }

  // Aktif bağlantıları bekleyerek daha nazik bir kapatma işlemi
  gracefulClose(timeout = 10000, callback) {
    if (!this.server) {
      if (callback) callback(new Error('Server not running'));
      return this;
    }
    
    const server = this.server;
    this.server = null;
    
    // Yeni bağlantıları reddet ama mevcut bağlantıları tamamla
    server.close((err) => {
      if (callback) callback(err);
    });
    
    // Timeout sonrasında yine de kapat
    if (timeout) {
      setTimeout(() => {
        // Hala açık olan bağlantıları zorla kapat
        if (server._connections > 0) {
          console.warn(`Forcing close of ${server._connections} connections after timeout`);
        }
      }, timeout);
    }
    
    return this;
  }
}

module.exports = lightroute