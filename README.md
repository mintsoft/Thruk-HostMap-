# Thruk-HostMap++

Trying to build a dynamic graph for hosts and their parent relationships as the built in one in 
Nagios and thruk both leave much to be desired:
 - They don't put hosts without a parent in an 'island' by themselves
 - The monitoring host has to be 'in the middle' (this does kind of make sense however)
 - If there are dual links/switches/routers between routes then the circular graph totally chokes
 - Is .. interesting when using livestatus and multiple sites

## Populate a file (until I get this against Thruk with CORS) 
Create a file with the host relationships and shove it next to `index.html`
```
curl 'https://omd1/site1/thruk/cgi-bin/status.cgi?style=hostdetail&view_mode=json&columns=host_name,perf_data,parents,state,address,alias,check_command,peer_name' > data.json
```
Shove into wwwroot
...
View
