# Thruk-HostMap++

Trying to build a dynamic graph for hosts and their parent relationships as the built in one in 
Nagios and thruk both leave much to be desired:
 - They don't put hosts without a parent in an 'island' by themselves
 - The monitoring host has to be 'in the middle' (this does kind of make sense however)
 - If there are dual links/switches/routers between routes then the circular graph totally chokes
