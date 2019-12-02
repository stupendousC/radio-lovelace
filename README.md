# Radio Lovelace

## At a Glance

- Individual, [stage 1](https://github.com/Ada-Developers-Academy/pedagogy/blob/master/rule-of-three.md#stage-1) project
- To be completed before start of class **Monday, December 9**. No pull request is required.

## Learning Goals

This project is designed to exercise the following skills:

- Reading and understanding a substantial amount of existing React code
- Lifting React state from a child component to a parent component
- Event handling in React across several levels of nested components

There will be an instructor solution distributed to both classes. Take your best crack at this code, and then compare your work with our solution by looking through the source in the provided solution.

## Introduction

A local radio station, Radio Lovelace, has asked your company to build an app to manage playlists. The app should automatically load in a list of songs or "tracks", and organize them into two groups, the "morning playlist" and the "evening playlist". Tracks should not be repeated between the two playlists.

While using the application, the user should be able to:
- Mark a track as a "favorite"
- Send a track to the top of a playlist
- Switch a track between playlists (it should be sent to the top of the new playlist)

We have [our own implementation](https://adagold.github.io/radio-lovelace/) of this application deployed to GitHub Pages for you to see what this functionality looks like.

### Setup

1. Fork and clone this repository
1. run `npm install` to install dependencies
1. run `npm start` to start the dev server

## Requirements

Each of the waves includes a number of questions. Though you should write your own code, feel free to collaborate with other students as you work on these questions.

### Wave 0: Reading

We have already implemented some parts of this application:

- Code to load JSON track data in `App.js`
- 3 functional stateless components: `Track`, `Playlist` and `RadioSet`
- CSS for all components. You shouldn't need to write any CSS for this project.
  - All of our CSS uses [BEM naming](http://getbem.com/naming/)

Before you start writing code, read through what's already here and make sure you understand it by answering the following questions:

- How do the components relate to each other? Draw a diagram.
- How does data get from `App.js` to `Track.js`?
A: App + SongData.json -> Radioset() -1---2-> Playlist() -1----n-> Track()
- There are two new pieces of syntax in this application: the "spread operator" in `Playlist.js`, and "object destructuring" in `Track.js`. What do these do?
A: The spread operator ... lets you expand an iterable like a string, object or array into its elements.  Object destructuring via {} allows u to pull out each variable from props, so u can refer to things as attr1 or attr2 or whatever, instead of props.attr1 or props.attr2 or props.whatever
- `Track.js` relies on a prop called `favorite` which is not included in the JSON data. What value does this property end up taking? 
A: T/F

### Wave 1: Marking Favorites

When the user clicks the star icon on each track, the track should be marked as a favorite. Its star should be filled in.

**Questions:**
- How will you track whether or not a track is a favorite? Where will this state live? A: Track with state in App.js.  Toggle the fav with track.js, where it'll call its parentCB in Playlist.js, which calls its parentCB in Radioset(), which calls its parentCB in App.js, where it'll .setState() on favorite T/F
- Will you need to switch a functional component to a classical component? 
A: Not at this stage.  I was only going to keep App.js a class component so it can store state values for all its children functional classes to refer to.  Maybe later I'll need to switch downstream functional components to classes? idk...
- What event should you listen for?
  - Hint: it's not `onClick`. Check the warning in the console.
A: I'll use onChange in the star checkbox
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.
A: Rendering: app -> radioset -> playlist -> track
favToggle/callback: track -> playlist -> radioset -> app
then re-render once .setState called, repeat Rendering step above

### Wave 2: Send to Top

When the user clicks the 🔝 button on a track, that track should move to the top of its current playlist.

A "favorite" track that is sent to the top should continue to be a favorite.

**Questions:**
- How will you keep track of the order of songs? Where will this state live?

*** A: I will need to add some indication of order (I don't want to risk unforeseen side effects if I were to alter ID based on Order placement) in Playlist.js.  I CANNOT store this in App.js or Radioset.js b/c there are multiple playlists.  So what I'm goign to do is to store in the Playlist.state the attribute of songsInOrder, where it's an array of all the song ids.  Anytime an event triggers in Track.js to move a song up, it calls its parent which is Playlist, and from the props I know which song id will need to go to index 0, so I .setState() on this new songsInOrder, afterwards everything should re-render and show my selected song on the top of the view page ***
- Will you need to switch a functional component to a classical component?
*A: Playlist.js*
- Do you need to lift any existing state? What will happen to the code to manage this state?
*A: I will have to lift the state of whichever id# gets selected, up the chain from Track -> Playlist, and move that song in its state of trackIdsByOrder[] to index 0.*

- If you do lift state, can you convert the child component back to a functional component?
A: yes, unless that child component has other states it needs to keep track of. In this case, my child component is Track.js and it has always been a functional component.
- Is the component that maintains the state the same as the component where the event occurs? If not, how will you communicate between components?
A: Not necessarily.  If the component with the state storage is not the same as the component with the event-trigger.  Then I just need to invoke the parentCallBack fcn and pass by identifying parameters back via props.
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.
**Track.js --trigger--> Playlist.js -> .setState(songsInOrder: newOrder) --render--> Track.js**
I found out later that if I were to delete a song from a playlist, I'd do the same thing here too, except that instead of plucking a song out of its original index and inserting in index 0 in its state.trackIdsByOrder, I'd just remove it.


### Optional Enhancements

Don't even read this list until you've completed the core requirements.

#### Feature: Switch Lists

When the user clicks the ↔ button on a track, that track should move to the top of the other playlist.

A "favorite" track that switches lists should continue to be a favorite.

**Questions:** (same as for wave 2)
- How will you keep track of which song belongs in which playlist? Where will this state live?
**To do this, I will make RadioSet a class component too. Where it will have a state of the songs in each set??? there will be a .state.morningList and a .state.eveningList and for the future whatever .state.whateverList that may come up**
- Will you need to switch a functional component to a classical component?
**I'm going to make RadioSet a class component too**
- Do you need to lift any existing state? What will happen to the code to manage this state? **Yes I will need to lift the song id from the track.js, up to playlist.js, up to radioset.js, where it will pluck the selected song id from the set it belongs to and put it in the other one**
- If you do lift state, can you convert the child component back to a functional component?
**Yes, but not in this case because I want to keep the song order info in the Playlist class component, because the same song may appear in both playlists, and they cannot share the same order info in Radioset nor App.js**
- Is the component that maintains the state the same as the component where the event occurs? If not, how will you communicate between components?
**Not in this case.  The trigger lives in Track.js, whereas the state storage is in Radioset.js, so I will have to pass the song id info and the set it came from, up the chain to Radioset via props and parental callback fcns**
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.
**Tracks.js --trigger--> Playlist.js --> Radioset.js, where it .setState, then re-render back down the chain**


**Other Enhancements:**

- Instead of splitting the list of tracks down the middle, write some code that splits the list in two so that the play times are as close as possible. What is the time complexity of your code? What is `n`?
- Replace the "send to top" button with two buttons, "up" and "down", that move a track up or down one position in its playlist
- Allow the user to add another playlist, and to move tracks right and left between playlists
- Add a [managed form](https://reactjs.org/docs/forms.html) to allow the user to add their own track (we will formally cover managed forms next week)
