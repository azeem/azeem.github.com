---
title: Spray Longpolling
publishTime: 2013-08-03 17:06:00
published: false
category: blog
---

I have been experimenting with [spray][1] toolkit lately. Quite low-level in comparison to other web application frameworks, spray provides many powerful actor based abstractions and an advanced request routing DSL, making it really easy to implement most things. Here is my shot at implementing a long-polling scheme for server push using Spray.

Long Polling
------------

> Long polling is a variation of the traditional polling technique and
> allows emulation of an information push from a server to a client. With
> long polling, the client requests information from the server in a similar
> way to a normal poll. However, if the server does not have any information
> available for the client, instead of sending an empty response, the server
> holds the request and waits for some information to be available.

spray

[1]: http://spray.io/
[2]: http://akka.io
