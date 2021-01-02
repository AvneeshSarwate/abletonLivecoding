const clips = {};



/*
state - an arbitrary object associated with that channel where you 
        can store whatever you want between outputs. Persists btw play/stop
history - the list of past outputs (populated by the out() function)
out - the function that sends the final list of notes out to be played
c - a function that executes the miniDSL for clip splicing
*/
channels("perc1").play(function(state, history, out, c){
    if(state.count == undefined) state.count = 0;

    //splicing numbers are beat numbers, not list indices
    let root = c`stem[0:3]`;
    let fill = state.count % 2 == 0 ? c`fill1` : c`fill2`;

    //binds "new" clips into the DSL execution namespace
    //b() functioni is added to string prototype
    let final = c`root + fill`.b({root, fill});

    
    out(final)
    state.count++
});


/*
have VS code highlight channels that are actively playing:
look for the "channels("NAME").play(" string and highlight 
everything  up to the matched parenthesis of the play func

*/