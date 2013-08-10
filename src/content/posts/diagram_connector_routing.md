---
title: Diagram connector routing
publishTime: 2012-01-10 06:45:00
category: blog
---

I have been trying to find some interesting coding stuff to work on, something to get off of the
line of work that i do at my day job, relive the college days :P. This is an interesting
problem that came up when i tried to dust off one of my old javascript projects. In simple words, the
problem goes something like this: given a flow chart, how do you automatically render orthogonal
flow lines without intersections or collisions.

[Yahoo pipes][1] was sort of like a reference design for my project. But i wanted clean
orthogonal connecting lines that avoided each other, unlike the curvy pipes that would go
behind components. Interestingly, i could find some nice javascript libraries: [WireIt][2],
[jsPlumb][3], [joinjs][11] etc. that takes care of computing/rendering the connectors etc.
Regardless, in the DIY spirit, (or rather, the Reinvent The Wheel Yourself spirit :P) i started
to prototype.

The underlying problem is path search. A 2D canvas can be treated as a [Graph][4], where each
pixel is represented by a node (lets say we represent a pixel (x,y) with node [x,y]). Obviously, pixels
that collide with chart components or other flowlines will have no corresponding nodes. Since
we are interested only in orthogonal paths, we create edges from each node to its four
orthogonal neighbours (ie. [x,y-1], [x-1,y], [x,y+1], [x+1,y]). The problem of finding
orthogonal flow line from point (x,y) to (x',y') can now be treated as the problem of finding
a path from node [x,y] to [x',y'], which can be easily solved by [Graph Search Algorithms][5].

Dijkstra's Algorithm
--------------------

We would also like the flowlines to look aesthetically pleasing. Although its slightly difficult
to define, mathematically, what could be aesthetically pleasing, i reason that the
following two parameters can create good flowlines.

1. *Minimize Path Length* : Obviously, shorter lines connecting chart components are easier to
   read.
2. *Minimize Bends*  : Connecting lines which have too many bends are hard to follow. The
   problem with orthogonal paths is that the shortest distance between any two points is
   given by [manhattan distance][6]. This means that there could be several paths with
   shortest length. In the absence of obstacles, any of the shortest path can have atmost
   about min(abs(x'-x), abs(y'-y)) bends (blind guess formula no proofs :P), therefore
   minimizing bends is important.

For a given path, if we define path cost function g(n) as the sum of distance to node n from
starting point along the given path and the number of bends along the path from starting point
to n, then we would like our algorithm the choose the path with least path cost function for
the end point. We use the [dijkstra's algorithm][7] with path cost = g(n) = distance + #of bends
to do this.

The problem with this approach is that, standard Dijkstra algorithm works by extending optimal
partial paths. In simple graph search, when there are several optimal partial paths of the same
cost, the choice between one of these for extension doesnt affect the optimality of the final
path. But however, in our case, this is not true (again, due to the [Taxicab Geometry][6]).
Consider the following:

    A----(B)
    |     |
    |     |
    |     |
    D-----C
    |
    |
    |
    (E)

We are trying to connect B to E. At point D, there are two optimal partial paths
BAD and BCD of the same cost (cost=length+bends=2+1). If the algorithm
chooses path BCD for extension the final path BCDE(cost=length+bends=3+2) is suboptimal since
there is path BADE(cost=length+bends=3+1) with fewer bends. Thus we need to teach our algorithm
to make the choice in such a way that the extended path is also optimal.

In Dijkstra, we extend a path to a node only if the optimal partial path (if one has aleady
been computed) at that point, from the start, has greater cost than the new path that
would be generated after extension. If we introduce an estimate of the minimum number of bends
required to reach the target also in the above condition ie. we extend only if the sum of cost
of optimal partial path and estimate of min bends to target is greater than that for the new
path that would be generated, then we can avoid the previously mentioned problem. Thus, in the
previous example, if path BAD has already been computed and BC is being considered, then we do
not extend BC to BCD since atleast 1 more bend is required to reach E along BCD wheras BAD 
requires no more bends to reach E. Conversely, if BCD has already been computed and BA is being
considered, then we detach D from BCD and extend BA to BAD since it has lower bends estimate.

The minimum bends-to-target estimate can be easily computed by checking the direction of the partial
path at the end point and the relative position of the target eg: if target is along same direction
and in front of the end point then min-bends-to-target is 0, there are three other such cases.

Making it Faster
----------------

Dijkstra's algorithm is sort of like hitting the pinata, it'd go about searching all over the
canvas to find the end point. If we have some more information about how warm or cold each point
is, with respect to the target, we can avoid searching in directions that we know to be less
likely to lead us to the endpoint. We do this by implementing an [A* Search][8], which is a generalization
of Dijkstra. We use a heuristic function h(n) = manhattan-distance(n,target)+min-bends(n,target),
so that the search would try find paths within or close to a rectangle with the start and end points
at opposite corners and are likely to have fewer bends.

Implementation
--------------

![Dijkstra implementation screenshot][9]

<script src="https://gist.github.com/azeem/1521549.js"></script>

[This][10] is a hacky little demo with animation. Hit the play button to run the animation.
Red dots are nodes which have been considered and Yellow dots are the nodes in the queue. 
Uncomment `n.heuristic = 0;` line in dijkstra function to switch to simple dijkstra without
A*.

The Wheel 
---------

A very interesting optimization to this is to reduce the search to the orthogonal
visibility Graph (a graph containing points of interest, such as vertices, with arcs drawn
between nodes that can see each other). This and a more formal approach to this problem is
detailed in this paper: [Orthogonal Connector Routing][12]. The Authors of the paper have
a C++ implementation of their technique in [libavoid][13] libaray.

I dot not have proofs for the correctness, optimality etc. for anything, though it seems to
work in the simple prototype. Any comments are welcome.

[1]: http://pipes.yahoo.com/pipes/
[2]: http://neyric.github.com/wireit/
[3]: http://jsplumb.org/jquery/demo.html 
[4]: http://en.wikipedia.org/wiki/Graph_(mathematics)
[5]: http://en.wikipedia.org/wiki/Graph_search_algorithm
[6]: http://en.wikipedia.org/wiki/Manhattan_distance
[7]: http://en.wikipedia.org/wiki/Dijkstra's_algorithm
[8]: http://en.wikipedia.org/wiki/A-star_algorithm
[9]: /images/dijkstra_demo.png
[10]: https://gist.github.com/1521549
[11]: http://www.jointjs.com/
[12]: http://ww2.cs.mu.oz.au/~pjs/papers/gd09.pdf
[13]: http://adaptagrams.sourceforge.net/libavoid/
