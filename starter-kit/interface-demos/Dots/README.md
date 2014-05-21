# FAMOUS-DOTS-RELEASE

>This is a famous web application built to look like the iOS [DOTS](https://itunes.apple.com/us/app/dots-a-game-about-connecting/id632285588?mt=8) game.



### What is Dots?

An annoyingly addictive iOS and Android game that is very similair to the 'connect the dots' game
we all played in elementary school when the teacher wasn't paying attention.



### Why pick Dots?

I have zero knowledge of famous but many of the applications on capptivate don't seem terribly difficult
to build with this powerful UI tool. However DOTS is a dysfunctional mess! From a UI standpoint it lacks
structure and has 'bad bones.' Nonetheless it's a popular game on iOS.

I wanted to see if I could use famous to bring order to this chaotic mess. It seems a worthy challenge
because although the actual animations are trivial, the sequencing and timings are not. Add in the
fact that screens transition in one way and out another, no two screens animate the same way, layouts are
deeply nested, individual elements often bounce or overshoot their intended position and you have a
challenging first effort to learn famous. Perfect!


### Current Project State

The project has been migrated to famous version 0.0.4. The game play screen is dropping the dots but the line drawing
canvas and algorithms for scoring functions still need to be finished. An alternative version of DOTS was built at roughly the same time that tackled the game play first (as opposed to the overall architecture and navigation) so merging these two codebases into one would yield a project that is 95% functionally complete.

As an added twist to the TIMED and MOVES games that come with dots I added a third mode called FAMOUS in which the user has 36 moves to leave as many of the famous PHI symbols on the screen as possible. Should be really challenging and promotional for famous at the same time.

It's worth noting that the DOTS team pushed a major UI change on March 26, 2014 that altered much of the UI and application flow so this application is no longer an exact match for the latest version of the game.



### My Approach

I left the game play for last because, frankly, it seemed the easiest and most fun part of the project. I prefer
to tackle the hardest stuff first so potential roadbloacks are uncovered early and often. It wasn't long before
I realized that a lot of code was going to be dedicated to creating all the surfaces, modifiers and containers
needed to corral this rubbery UI.



### The BIG Idea

Extending the view class to handle a lot of the UI generation seemed to make a lot of sense. That quickly evolved
into the idea of expressing the UI as a JS object that could be parsed to build 95% of the screens knowing any 'edge case quirkiness' could be dealt with using traditional famous methods. Although the JS object structure for the screens is defined in each view it could easily reside in a file or even pulled from a server or CDN.

Another idea that quickly bubbled to the top which was to store all the famous modifiers, surfaces, particles as property values so the actual code that operates on these entities would be much more 'conversational' and free the programmer from having to worrry about descriptive variable names.

As such, when all these famous entities get created the programmer assigns them a key value and can easily refer
to them later in a format that clearly express intent. It's not to hard to guess what this line of code does:


```
this.famous.modifier.playbutton.setOpacity(0);
```


Lastly I tried to make DOTS completely resolution idependent. I'm working toward an idea where the developer can build an application at a particular resolution and the app preserves the developers intent across all screen sizes. It looks promising.

### Problems

Although the lack of documentation was initially disconcerting it gave me the opportunity to deep dive the code from the 'outside in' meaning I probed down into famous whenever I needed to figure out how to do something. I very much want to do a code read from the 'inside out' so I can learn to appreciate famous from an archtectural as opposed to operational viewpoint. It's very evident it's a tight, optimized, well written body of work.

Dots was intially built on git.modularized, then git.develop, and finally git.0.0.4 The platform team has been rapidly improving things and each migration had breaking changes. Most notably was the physics engine which now feels like it's more integrated into the conventions the rest of the framework is predicated upon. It's all moving in a great direction.

### Final Thoughts

With zero understanding of the framework I began handling issues that aren't really issues in famous. I think that's old DOM challenges polluting my thinking. Famous is a total paradigm shift away from all the old problems a developer is used to thinking about. I know so much more about the framework and the platform team's intent that I would completely rewrite all of this syntactical sugar with the same intention: make it super easy for programmers of all levels to easily adopt this powerful way of writing applications.