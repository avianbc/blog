+++
date = 2026-02-28T12:00:00-04:00
title = "I Fed 17 Years of Blog Posts to an AI and It Roasted My Evolution"
categories = ['Programming']
tags = ['Career', 'AI']
+++

I've been blogging since 2009. That's 72 posts across 17 years: Java homework dumps as a college kid, strength training posts with programming metaphors as an adult. I recently pointed an LLM at the whole archive and asked it to analyze my writing voice. The results were both flattering and humbling.

## The three eras

The AI identified three distinct phases in my writing, and it nailed it.

**Era 1: The Code Dumper (2009–2013)**

My earliest posts were basically "here's my homework, enjoy." A [Java UDP client/server](./2010-11-02-simple-udp-fortune-clientserver-proof-of-concept.md) with a one-sentence intro. An [OpenGL wireframe](./2011-11-23-3d-wireframe-in-opengl-using-glut.md) with zero explanation of *why* anyone would care. The pinnacle of this era was a [13-line post](./2012-07-31-up-and-running.md) announcing my blog was "oficially" up and running. Yes, with that typo.

But even in the code dumps, the AI picked up on something I didn't notice at the time: a teaching instinct trying to escape. My [maze-solving post](./2012-08-15-maze-solving-algorithms-wall-follower.md) used the blog itself as a "rubber duck" to think through the algorithm. My [regex post](./2012-08-07-common-regular-expressions.md) opened with *"Any programmer worth their salt should have a few tricks up their sleeve."* The voice was already there. It just didn't have much to say yet beyond `public static void main`.

**Era 2: Finding a Personality (2013–2016)**

This is when I started writing posts that weren't attached to a `.java` file. [Podcast recommendations](./2015-05-06-podcasts-you-should-listen-to-right-now.md). Screenshots of [bad error messages](./2015-03-06-philosophy-as-told-through-bad-error-messages.md) with captions like *"Who debugs the debugger?"* A [book review](./2013-03-10-book-review-javascript-the-good-parts-by-douglas-crockford.md) where I praised Crockford for being opinionated. Looking back, that was basically me telling myself what kind of writer I wanted to be.

The posts got shorter but said more. I was figuring out that the interesting part wasn't the code. It was the frustration that led to the code, or the opinion I formed after writing it.

**Era 3: The Actual Voice (2017–present)**

At some point (I can't pinpoint exactly when) the writing clicked. Posts started opening with a problem, not a preamble. Solutions came with [full test suites](./handling-case-insensitive-query-parameters-in-angular.md) instead of fragments. Humor stopped being a separate category of post and just became part of how I write.

The [chicken tornado post](./chicken-tornado-pixijs.md) is peak Era 3. Four sentences of setup: *"I was bored and decided to see what PixiJS is all about. Sooo... I made a tornado of chickens."* That's it. No justification, no apology, no SEO-friendly introduction explaining what PixiJS is. Just chickens.

## The thread that never changed

Across all three eras, the AI found one constant: every post follows the same basic pattern. I hit a problem, existing solutions were inadequate, I built or found something better, and I shared it. The motivation behind the very first homework dump in 2009 is the same motivation behind the [Windows 11 setup guide in 2025](./cli-powered-windows-11-setup.md).

The delivery changed. The instinct didn't.

That pattern is also, it turns out, what makes a decent tech lead. The job is mostly hitting problems that aren't in any runbook, solving them anyway, and making sure someone else can solve them next time without needing to find you. Un-googleable problems are the whole job. The blog was practice for that last part: write it down so the next person doesn't start from zero.

## Programming metaphors are a disease

The AI flagged something I was only vaguely aware of: I use programming metaphors for *everything*. Strength training? *"A systems upgrade to throughput, stability, error rates, and uptime across the entire human stack."* [Career advice](./how-i-specialized-as-a-developer.md)? Laid out like a logical proof with bullet points leading to a conclusion. Even [choosing guitar strings](./2015-01-31-savarez-cristal-corum-high-tension-500cj-string-review.md) got a structured Good/Bad/Ugly format.

Once you see it, you can't unsee it. I apparently think in interfaces and bullet points. There are worse afflictions.

## What I learned from an AI reading my blog

The biggest surprise wasn't what the AI found. It was what it *didn't* find. No "thanks for reading" sign-offs. No calls to action. No emojis. No self-promotion. Seventeen years of writing and I never once asked someone to subscribe to anything.

I'm not sure if that's integrity or just forgetting to monetize. Probably both.

The analysis also surfaced my verbal tics. I apparently use "Basically" as a crutch, "As such" as a transition more than any human should, and em dashes like they're going out of style. They aren't. They're great.

The most useful output was seeing the gap between what I *think* my voice is and what it actually is on paper. I always thought of myself as a technical writer who happens to be funny sometimes. The AI's take: a pragmatic problem-solver who teaches by showing his work and happens to write about code. Subtle difference, but it reframed how I think about what I'm doing here.

## The meta part

Yes, I used the AI's analysis to generate a style guide so that future AI systems can write in my voice. Yes, that's recursive. Yes, this post was drafted with that style guide loaded. The chicken tornado of content creation, if you will.

The style guide is 50 lines. Seventeen years of writing, distilled into a system prompt. It covers what to do (be direct, lead with the problem, state opinions plainly) and what not to do (no filler, no hedging, no "Let's dive in!"). Whether it actually works is left as an exercise for the reader (and whatever LLM they point it at).
