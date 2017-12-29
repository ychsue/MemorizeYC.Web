# Web version of MemorizeYC
It's main web site is at <http://memorizeyc.azurewebsites.net> and its demo is at <http://memorizeyc.azurewebsites.net/Static/>.
## I. Install it on the device which can run Node.JS and it will be a web server.
1. Download this project into your device:
``` bash
$ cd [DIR]
$ git clone https://github.com/ychsue/MemorizeYC.Web.git
```
2. Install it by npm and run it through http-server
``` sh
$ cd MemorizeYC.Web/MemorizeYC.Web
$ npm install
$ npm start
```
3. Navigate to http://localhost:8080 on your web browser.
4. If you want to debug it by vscode, you need to install **Chrome** at first. Then follow [the tutorial shown in this YouTube video](https://www.youtube.com/watch?v=H1lgYojMCaQ). Remember that, 
<br/>
a. You need to run
``` sh
$ npm start
```
in MemorizeYC.Web subfolder so that it can complie the code through **tsc** and make this subfolder as a web server through **http-server**.
<br/>
b. You need to restart (refresh) the debugger once it is debugging unless you cannot pause the program at your breakpoint.
## II. Install it in Linux Apache2 server
1. First of all, you need to install an Apache2.
2. Login as a super user in order to create a subdirectory such as **Static** as I used.
3. copy **CSSs**, **GSPages**, **PlayPage**, **Samples**, **index.html**, **MYCWeb.js** and **version.json** into this subdirectory.
4. change its mode by `chmod -R 755 *`.
5. Change **GlobalVariables.rootDir** from "/" to "/Static/" and some other important settings in **index.html**.
6. Then, open a browser and key in `localhost/Static/` to test it.
7. Have fun!
## III. Install it in An ASP.NET server
1. Create a subdirectory to hold this program. In my case, I named it **Static**.
2. Copy  **CSSs**, **GSPages**, **PlayPage**, **Samples**, **index.html**, **MYCWeb.js** and **version.json** into this subdirectory.
3. Add 
    ```XML
<configuration>
  <system.webServer>
    <handlers>
      <add name="JavaScriptHandler" path="*.js" verb="*"
       preCondition="integratedMode" type="System.Web.StaticFileHandler" />
      <add name="HtmlScriptHandler" path="*.html" verb="*"
       preCondition="integratedMode" type="System.Web.StaticFileHandler" />
    </handlers>

    <staticContent>
        <mimeMap fileExtension=".level" mimeType="text/plain" />
        <mimeMap fileExtension=".box" mimeType="text/plain" />
        <mimeMap fileExtension=".json" mimeType="application/json" />
        <mimeMap fileExtension=".m4a" mimeType="audio/mp4"/>
    </staticContent>
  </system.webServer>
</configuration>
    ```
into **Web.config** file of ASP.NET.

4. Change **GlobalVariables.rootDir** from "/" to "/Static/" and some other important settings in **index.html**.
5. Then, open a browser and key in `localhost/Static/` to test it.
6. Have fun!