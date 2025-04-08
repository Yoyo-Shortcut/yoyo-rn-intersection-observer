# yoyo-rn-intersection-observer

A straightforward React Native module for checking if Views are within a ScrollView.

## What is an Intersection Observer?

https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

In essence, intersection observers monitor the positions of multiple elements, allowing you to perform calculations based on these positions for features like:

- Lazy loading when an element enters the viewport
- Unmounting an element when it leaves the screen
- Creating wild animations based on an element's visible percentage

Get imaginative - there are countless ways to leverage intersection observers.

## The Challenge with React Native

Currently, React Native lacks native support for intersection observers. When you look for existing packages online, they're often underwhelming or abandoned.

I'm not sure why this feature isn't prioritized - it feels pretty essential to me.

There's talk that IntersectionObserver will eventually arrive with React Native's new architecture (https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here). But I'm not thrilled about waiting around - who knows when it'll actually land?

## A Simple, Efficient, and Flexible Fix

This repository features an Expo demo app, though it should work seamlessly in a bare React Native project. The only dependency required is:

- react-native-reanimated

### Back to Basics

To grasp this solution, let's revisit the core concept of intersection observers.

Imagine a ScrollView containing a View item. We need to determine if that View is visible within the ScrollView.

The easiest approach is to measure the ScrollView's position and the View item's position, then compare the View's top and bottom edges to the ScrollView's bounds.

React Native offers a `measure` function for this (https://reactnative.dev/docs/the-new-architecture/layout-measurements). However, on mobile, I found it painfully slow when running on the main thread - where your app's rendering happens. If multiple elements queue up for `measure`, it clogs the JS callback queue, making the UI stutter and lag.

### Fixing the Lag

To eliminate the choppiness, we need to shift those `measure` calls off the main thread to a separate one.

But how?

Enter `react-native-reanimated`. It provides a `measure` function that runs on the UI thread - distinct from the JS main thread - keeping things smooth.

### Code Breakdown

I’ve built three core components that work together:

- `IntersectionObserverProvider`: Serves as the hub, storing all measurements and broadcasting signals for elements to respond to.
- `ScrollViewObserver`: A ScrollView that sends its position data and signals to the Provider.
- `ViewObserver`: A View that listens to Provider signals and compares its own position to the ScrollView’s data.

That's the gist of it!

Dive into the code for a closer look - it's concise, I swear.

## Why a Demo Instead of a Package?

There are a few reasons. For one, I don't have the bandwidth to craft a polished package that fits everyone's needs.

Plus, intersection observer use cases vary widely. I'm focused on vertical visibility with two states: fully or partially visible. You might want visibility percentages or horizontal detection. There's also room for tons of micro-optimizations.

I'm focused on rendering just a small number of components - hundreds tops. But you might be dealing with thousands of elements simultaneously! By the way, to manage that kind of volume, I'd suggest grouping some measure calls into batches and limiting them to a few batches within a set millisecond window.

I decided it's better to share the concept and let you tailor the code to your liking.

That said, if enough folks request for an NPM package, I might whip one up and open it for contributions.

## Known issues

https://docs.swmansion.com/react-native-reanimated/docs/advanced/measure

> measure isn't available with the Remote JS Debugger. We highly recommend using Chrome DevTools (also known as chrome://inspect) for debugging React Native apps.

This implies that connecting a remote JS debugger to your React Native project will prevent `measure` from triggering, halting any calculations or data loading tied to intersection observers.
