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
- There are two new pieces of syntax in this application: the "spread operator" in `Playlist.js`, and "object destructuring" in `Track.js`. What do these do?
- `Track.js` relies on a prop called `favorite` which is not included in the JSON data. What value does this property end up taking?

### Wave 1: Marking Favorites

When the user clicks the star icon on each track, the track should be marked as a favorite. Its star should be filled in.

**Questions:**
- How will you track whether or not a track is a favorite? Where will this state live?
- Will you need to switch a functional component to a classical component?
- What event should you listen for?
  - Hint: it's not `onClick`. Check the warning in the console.
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.

### Wave 2: Send to Top

When the user clicks the 🔝 button on a track, that track should move to the top of its current playlist.

A "favorite" track that is sent to the top should continue to be a favorite.

**Questions:**
- How will you keep track of the order of songs? Where will this state live?
- Will you need to switch a functional component to a classical component?
- Do you need to lift any existing state? What will happen to the code to manage this state?
- If you do lift state, can you convert the child component back to a functional component?
- Is the component that maintains the state the same as the component where the event occurs? If not, how will you communicate between components?
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.


### Optional Enhancements

Don't even read this list until you've completed the core requirements.

#### Feature: Switch Lists

When the user clicks the ↔ button on a track, that track should move to the top of the other playlist.

A "favorite" track that switches lists should continue to be a favorite.

**Questions:** (same as for wave 2)
- How will you keep track of which song belongs in which playlist? Where will this state live?
- Will you need to switch a functional component to a classical component?
- Do you need to lift any existing state? What will happen to the code to manage this state?
- If you do lift state, can you convert the child component back to a functional component?
- Is the component that maintains the state the same as the component where the event occurs? If not, how will you communicate between components?
- Draw a diagram of the flow of rendering and callbacks in your app so far, similar to the one we drew in class.

**Other Enhancements:**

- Instead of splitting the list of tracks down the middle, write some code that splits the list in two so that the play times are as close as possible. What is the time complexity of your code? What is `n`?
- Replace the "send to top" button with two buttons, "up" and "down", that move a track up or down one position in its playlist
- Allow the user to add another playlist, and to move tracks right and left between playlists
- Add a [managed form](https://reactjs.org/docs/forms.html) to allow the user to add their own track (we will formally cover managed forms next week)
