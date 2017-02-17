This will be a 2-participants experience. One participant joins the game by clicking 'Flip a coin', is paired with another participant (if there is no other participant online, an AI participant will be offered) and then a game of coin flip starts. Requirements for implementation:
- node.js server (obviously)
- each joining participant gets a unique ID and if there are no other participants, it's queued
- if there is already a queue, a random participant is popped and the two are paired.
- between the two, a random one is selected and he/she can decide on what to bet (head / tail)
- the coin flip happens (insert ugly animation here)
- winner / loser are selected, some information is displayed, and the option to flip another coin is presented.