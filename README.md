# Smart Exhibits

This Framework for building interactive smart exhibits for exhibitions, that can interact with visitors' smartphones.

It was developed as part of a Workshop at the [Imaginary Conference 2016](http://ic16.imaginary.org) in Berlin.


## Run the Server

To run this application, you need to have `npm`, `node` and `grunt` installed on your machine. First, install all dependencies using

```
npm install
```

Now start the server by running

```
npm start
```

The default port is `:8081`, and can be changed by setting the `PORT` environment variable.

The exhibits now run on `/exhibit-name/display` and visitors can interact by visiting `exhibit-name`.


## Create new exhibits

Every exhibit corresponds to a sub folder in `/exhibit`. They each consist of a Jade template, a Less stylesheet and a JS file both for the exhibit and the visitor screens.

[TODO More details on JS API]


## Imaginary Workshop Overview

#### Abstract

While mobile devices are ubiquitous in everyday life, they are rarely utilised in museums and exhibitions, except as guide or to show additional descriptions. In this workshop we want to design exhibits that link with visitors‘ smartphones on a deeper level: utilising their collective computing power, using them to visualise graphs and networks, or to simulate probability experiments.

Combining the expertise of mathematicians, teachers and software developers, we will try to create more interactive, immersive and personal museum experiences.

#### Participants

Philipp Legner (leader), Eric Londaits (mediator), Margaret Brown, Joshua Chen, Cindy Lawrence, Katie McCallum, Victor Pessers, Stephanie Schiemann, Huaming Wu, Tian Xu

