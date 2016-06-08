# Web version of MemorizeYC
It's main web site is at <http://memorizeyc.azurewebsites.net> and its demo is at <http://memorizeyc.azurewebsites.net/Static/MYCWeb.html>.
## I. Install it in Linux Apache2 server
1. First of all, you need to install an Apache2.
2. Login as a super user in order to create a subdirectory such as **Static** as I used.
3. copy **CSSs**, **GSPages**, **PlayPage**, **Samples**, **MYCWeb.html**, **MYCWeb.js** and **version.json** into this subdirectory.
4. change its mode by `chmod -R 755 *`.
5. Change **GlobalVariables.rootDir** from "/" to "/Static/".
6. Then, open a browser and key in `localhost/Static/MYCWeb.html` to test it.
7. Have fun!