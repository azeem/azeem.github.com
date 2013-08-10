---
title: N Queens Puzzle
publishTime: 2009-07-22 00:48:00
category: blog
---

I've been reading this great book, [Structure and Interpretation 
of Computer Programs](http://mitpress.mit.edu/sicp/full-text/book/book.html) for the last few days. The examples are full of really cool math, algorithms, techniques and stuff. Here is an exercise that i managed to solve in scheme, The [Eight queens puzzle](http://en.wikipedia.org/wiki/N-queens).

> The eight queens puzzle is the problem of putting eight chess queens on an 8x8 chessboard such that none of them is able to capture any other using the standard chess queen's moves.

And here is the source.

    (define (range a b)
      (if (= a b)
          null
          (cons a (range (+ a 1) b))))

    (define (accumulate op initial sequence)
      (if (null? sequence)
          initial
          (op (car sequence)
              (accumulate op initial (cdr sequence)))))

    (define (flatmap proc seq)
      (accumulate append null (map proc seq)))

    (define (enumerate sequence)
      (define (iter counter sequence)
        (if (null? sequence)
            null
            (append (list (cons counter (car sequence))) (iter (+ counter 1) (cdr sequence)))))
      (iter 0 sequence))

    (define (rook-attack-safe? possibilities)
      (accumulate (lambda (a b) (and a b))
                  true
                  (map (lambda (possibility)
                         (not (= possibility (last possibilities))))
                       (cdr (reverse possibilities)))))

    (define (bishop-attack-safe? possibilities)
      (accumulate (lambda (a b) (and a b))
                  true
                  (map (lambda (pair)
                         (not (= (abs (- (last possibilities) (cdr pair)))
                                 (abs (- (- (length possibilities) 1) (car pair))))))
                       (enumerate (reverse (cdr (reverse possibilities)))))))

    (define (safe? possibilities)
      (and (rook-attack-safe? possibilities)
           (bishop-attack-safe? possibilities)))

    (define (n-queens-puzzle k)
      (define (solve n k)
        (if (= n 0)
            '(())
            (filter safe?
                   (flatmap (lambda (last)
                              (map (lambda (item)
                                     (append item (list last)))
                                   (solve (- n 1) k)))
                            (range 0 k)))))
      (solve k k))

Please excuse the crappy code. Im a total noob schemer, infact this is probably my first real scheme program. The solution is based on the recursive method described in the book. It works like this: only one queen can be placed in any one column, the problem of placing queens in all columns without any check can be reduced, using recursion, to that of placing a queen in the last column of a board in which all the other columns already have queens in positions that do not check each other.

It took quite some time to solve an 8x8 board. Im not even sure if the results are correct. But a few random checks on paper turned out correct and i got 92 results, which according to wikipedia is the total number of solutions. However, there are only 12 unique solutions, many of the 92 solutions are repetitions since one solution can be horizontally or vertically flipped to create different solutions. Each solution here is a list whose indices correspond to the board column number and the values represent the row in which the queen is placed in the corresponding column.

    ((3 1 6 2 5 7 4 0)
     (4 1 3 6 2 7 5 0)
     (2 4 1 7 5 3 6 0)
     (2 5 3 1 7 4 6 0)
     (4 6 0 2 7 5 3 1)
     (3 5 7 2 0 6 4 1)
     (2 5 7 0 3 6 4 1)
     (4 2 7 3 6 0 5 1)
     (4 6 3 0 2 7 5 1)
     (3 0 4 7 5 2 6 1)
     (2 5 3 0 7 4 6 1)
     (3 6 4 2 0 5 7 1)
     (5 3 1 7 4 6 0 2)
     (5 3 6 0 7 1 4 2)
     (0 6 3 5 7 1 4 2)
     (5 7 1 3 0 6 4 2)
     (5 1 6 0 3 7 4 2)
     (3 6 0 7 4 1 5 2)
     (4 7 3 0 6 1 5 2)
     (3 7 0 4 6 1 5 2)
     (1 6 4 7 0 3 5 2)
     (0 6 4 7 1 3 5 2)
     (1 4 6 3 0 7 5 2)
     (3 1 6 4 0 7 5 2)
     (4 6 0 3 1 7 5 2)
     (5 3 0 4 7 1 6 2)
     (4 0 3 5 7 1 6 2)
     (4 1 5 0 6 3 7 2)
     (5 2 6 1 7 4 0 3)
     (1 6 2 5 7 4 0 3)
     (6 2 0 5 7 4 1 3)
     (4 0 7 5 2 6 1 3)
     (0 4 7 5 2 6 1 3)
     (2 5 7 0 4 6 1 3)
     (5 2 0 6 4 7 1 3)
     (6 4 2 0 5 7 1 3)
     (6 2 7 1 4 0 5 3)
     (4 2 0 6 1 7 5 3)
     (1 4 6 0 2 7 5 3)
     (2 5 1 4 7 0 6 3)
     (5 0 4 1 7 2 6 3)
     (7 2 0 5 1 4 6 3)
     (1 7 5 0 2 4 6 3)
     (4 6 1 5 2 0 7 3)
     (2 5 1 6 4 0 7 3)
     (5 1 6 0 2 4 7 3)
     (2 6 1 7 5 3 0 4)
     (5 2 6 1 3 7 0 4)
     (3 1 6 2 5 7 0 4)
     (6 0 2 7 5 3 1 4)
     (0 5 7 2 6 3 1 4)
     (2 7 3 6 0 5 1 4)
     (5 2 6 3 0 7 1 4)
     (6 3 1 7 5 0 2 4)
     (3 5 7 1 6 0 2 4)
     (1 5 0 6 3 7 2 4)
     (1 3 5 7 2 0 6 4)
     (2 5 7 1 3 0 6 4)
     (5 2 0 7 3 1 6 4)
     (7 3 0 2 5 1 6 4)
     (3 7 0 2 5 1 6 4)
     (1 5 7 2 0 3 6 4)
     (6 1 5 2 0 3 7 4)
     (2 5 1 6 0 3 7 4)
     (3 6 2 7 1 4 0 5)
     (3 7 4 2 0 6 1 5)
     (2 4 7 3 0 6 1 5)
     (3 1 7 4 6 0 2 5)
     (4 6 1 3 7 0 2 5)
     (6 3 1 4 7 0 2 5)
     (7 1 3 0 6 4 2 5)
     (6 1 3 0 7 4 2 5)
     (4 0 7 3 1 6 2 5)
     (3 0 4 7 1 6 2 5)
     (4 1 7 0 3 6 2 5)
     (2 6 1 7 4 0 3 5)
     (2 0 6 4 7 1 3 5)
     (7 1 4 2 0 6 3 5)
     (2 4 1 7 0 6 3 5)
     (2 4 6 0 3 1 7 5)
     (4 1 3 5 7 2 0 6)
     (5 2 4 7 0 3 1 6)
     (4 7 3 0 2 5 1 6)
     (3 1 4 7 5 0 2 6)
     (3 5 0 4 1 7 2 6)
     (5 2 0 7 4 1 3 6)
     (4 2 0 5 7 1 3 6)
     (3 1 7 5 0 2 4 6)
     (5 2 4 6 0 3 1 7)
     (5 3 6 0 2 4 1 7)
     (3 6 4 1 5 0 2 7)
     (4 6 1 5 2 0 3 7))

[Better solutions](http://community.schemewiki.org/?sicp-ex-2.42)
