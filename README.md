# STATIC-IP

### Table Of Contents

1. [ Description ](#description)
2. [ Prequisits ](#prequisits)
3. [ Server setup ](#server)
4. [ Client setup ](#client)
5. [ TODO ](#todo)

<a name="description"></a>

### Proxy service for dynamic-IPs
If you have a server with domain and you want to proxy requests from your local networks without static-IPs through your server's domain, then this service for you! 

Service will listen to requests from clients, save client IPs and ports to forward in memory and update nginx conf.

* You can query client's public ip by:  
GET `${domain}/${client name}`, for example: `www.example.com/myhome`
* Or Proxy requests to your network through domain like this:  
 `${server domain}/proxy/${client name}`, for example: `www.example.com/proxy/myhome`

<a name="prequisits"></a>

### Prequisits
* Have nginx installed and configured. Check out [this tool](https://www.digitalocean.com/community/tools/nginx) to effortlessly configure nginx.
* Create a `proxy` folder in nginx directory `mkdir /etc/nginx/proxy` (to store pass_proxy blocks)  
* Make sure the service has priviledge to write in nginx directory and reload conf.
* Include every client IP recource to your nginx domain conf (This is not automated for security).
Lets's say I want to proxy `myhome` IP through server with `www.example.com` domain, then my `/etc/nginx/sites-available/example.com.conf` would look like something along those lines:

```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name www.example.com;

    # ( ADD THIS NEXT LINE FOR EVERY CLIENT YOU WANT TO PROXY!!! )
    include proxy/myhome.conf;

    # reverse proxy
    location / {
        proxy_pass http://127.0.0.1:8331;
    }
}
```
<a name="server"></a>

### Server setup
1. clone repo to your server `git clone https://github.com/MarkusTarn/static-ip.git`
2. install dependencies `yarn`
3. Change port in configuration file if necessary
3. run service `yarn start`

<a name="client"></a>

### Client setup
1. Save client.js to a device on your client network
2. Fill out conf in your client.js file (line 3)
3. Start client `node client.js`

Now the client device will ping the public IP to your server after every configured interval.  
You can access your network through domain or query network's public ip address if it has changed  
NB! Make sure you have forwarded the client port in your home network!

<a name="todo"></a>

### TODO
* Code cleanup
* Sanitize payload
* Create proxy folder
* Store map in file / redis cache
* Multiple ports with one client
* Forget to write tests
* Authorisation