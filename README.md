# Summary
This is a reverse proxy that specifically supports emoji subdomains for [nftnft.lol](https://nftnft.lol) which is a Yat-esque service built on web3 by [Owen of 0xmons](https://twitter.com/0xmons). 

Previously, [nftnft.lol](https://nftnft.lol) was using path-based routing for redirection and required the user to have a web3 connection. Using my 🌈 record as an example, it looked like this: [nftnft.lol/#/a/🌈](http://nftnft.lol/#/a/🌈) 

By including this proxy, it [now supports](https://twitter.com/nftnftlol/status/1432935366776950791?s=20) subdomain-based routing for redirection and the web3 connectivity is offloaded to the proxy. Users can now use records like this: [🌈.nftnft.lol](http://🌈.nftnft.lol)

**TLDR** this proxy let's users do [🌈.nftnft.lol](http://🌈.nftnft.lol) instead of [nftnft.lol/#/a/🌈](http://nftnft.lol/#/a/🌈)

# Architecture

The proxy is a simple Node app that is running in Heroku with a keepalive from [Kaffine](http://kaffeine.herokuapp.com/). 

When the proxy receives a request to `nftnft.lol` with a subdomain, it asks [the contract](https://etherscan.io/address/0xee4C821ed264916d1c035515703F8980410FC149#code) if a redirect has been set and then forwards the request either to the set value or to the [nftnft.lol](https://nftnft.lol) homepage. 

<!-- # Notes

Subdomain routing is a better experience (that I wanted) and it was a great opportunity to work with web3.

Before arriving at Node/Heroku, I built a Cloudflare Worker, an AWS Lambda, and a Python app. All of which translated subdomain to path. I had been wanting to play around with Workers and Lambda, and this was perfect; however, I also wanted to work with web3 and couldn't make it happen in a way that didn't feel forced with either of these two, primarily because of dependencies. I also had this working in Python and that was great but drifted over to Node to get a feel for it because it's so insanely popular.  -->

<!-- # manual update
git push heroku main -->
