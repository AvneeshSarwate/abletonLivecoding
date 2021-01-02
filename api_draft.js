const clips = {};



/*
state - an arbitrary object associated with that channel where you 
        can store whatever you want between outputs. Persists btw play/stop
history - the list of past outputs (populated by the out() function)
out - the function that sends the final list of notes out to be played
c - a function that executes the miniDSL for clip splicing
info - metadata about the channel - 
*/
channels("perc1").play(function(state, history, out, info, c){
    if(state.count == undefined) state.count = 0;

    //splicing numbers are beat numbers, not list indices
    //symbols are names of clips from ableton
    let root = c`stem[0:3]`;
    let fill = state.count % 2 == 0 ? c`fill1` : c`fill2`;

    //use tempates to bind clips not named in ableton into DSL evaluation
    let final2 = c`${root} ${final}`;

    //can be note on/off, or even midi CC
    out(final)
    state.count++
});



channels("perc1").setOuput(someStuff); //name of midi device (generalize to osc later);

channels("perc1").setMode("discrete/continuous");
//for continuous functions, define the output, and use a 
//template string to define the function of time that sends 
//a float value at 100hz



/*
dsl syntax ideas beyond slicing and concatenation

clipName(func arg arg)(func arg) - transformations funcs chained on a clip

clipName(tr _k) //"tr" is abbreviation for transpose
- can bind symbols to use in expressions
- symbols can be clip names or args for functions
- functions themselves could just be bound in as well 
    - can give longer "library" functions local shorthands for binding
- could bind args for slicing as well 

concatenation happens with spaces instead of "+"" (simplifies parsing)

transformation functions
 - all the counterpoint stuff (with scale-fitting)
 - time stretch/shrink
 - harmonize (with scale-fitting, randomness?)
 - sparisfy (with randomness?)


*/




/* Alternatives for clip DSL binding locally-generated clips

//binds "new" clips into the DSL execution namespace
//b() function is added to string prototype.
//object literals having same prop names as variables cleans up this syntax a lot
let final = c`root + fill`.b({root, fill});

write the clip-splicing-DSL function naively as a template string with
no template variables, using clip symbols that
are variable names defined in the play function. Then use acorn.js
to parse the body of the function on execution and use that info to 
rewrite the template strings symbols with the appropriate emplate vars

*/

/*
have VS code highlight channels that are actively playing:
look for the "channels("NAME").play(" string and highlight 
everything  up to the matched parenthesis of the play func

*/