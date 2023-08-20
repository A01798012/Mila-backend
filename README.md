<div align=center>

# Mila game
Back-end and Front-end of a videogame to teach children the fundamentals of programming. 
</div>

This is a school project where we worked with [Crack the code](https://www.crackthecode.la/). A company focused on teaching young children how to code.
Particularly, our mission was to create a videogame that would teach the children how to code and show that coiding is really fun.

### Contents
- [Videogame](#Videogame)
- [API](#API)
- [Database](#Database)
- [Web Page](#WebPage)

# Videogame
The videogame was programmed in Unity(C#) and then converted into JavaScript with the help of Unity. 
The videogame was about a dog that had to defend herself from aliens. Throught the game, the player colletcts items dropped by the
aliens and in some level we teach the children what [Caesar cipher](https://en.wikipedia.org/wiki/Caesar_cipher) is.
Also, we start to teach what binary search is.
# API
We designed a RESTful API, it was coded in JS with /express/ and /mssql/.
The API was used in both the game and the web page.
Game:
- Send scores to the database.
- Record game progress.
- Validate sessions.
Web Page:
- Register new users.
- Update gamertag.
- Update password.
- Retrieve data from the database, to show meaningful statistics.
# Database
It was a SQL Server DB, with stored procedures, triggers, etc...
# WebPage
The WebPage was made with JS and HTML, it connected to the API. 

# Where was everything hosted?
The web page, videogame, API and database where deployed in AWS.
