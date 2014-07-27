befunjit
========

Befunge-93 just-in-time compiler

Changelog
---------

####v0.4.0 --- 27 jul 2014
 + added support for `&~,` and `#`
 + handles edge cases (empty stack/input, writing/reading outside of the playfield)

####v0.3.0 --- 25 jul 2014
 + added support for `:\$`, `g` and strings

####v0.2.0 --- 22 jul 2014
 + funge-space is now toroidal
 + added support for `@` and `?`

####v0.1.0 --- 21 jul 2014
 + can compile code paths lazily and invalidate them on demand
 + supports `^<v>`, `0-9`, `+-*/%`, `|_`, ``!` ``, `&.` and `p`