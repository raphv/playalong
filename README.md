# PlayAlong.js

## A basic framework for creating interactive videos

Add interactive elements to HTML videos by adding a few HTML attributes to your document

### Use

Use the HTML video element in the classic way:

```HTML
<video id="my-video" controls>
  <source src="my-film.mp4" type="video/mp4">
</video>
```

Use the **video-id** attribute to associate other HTML elements with the video

Use the **video-overlay** property to turn an HTML element into an overlay

```HTML
<div video-overlay>
  <p>This is an overlay</p>
</div>
```

Use **video-start** and **video-end** to make HTML elements appear and/or disappear at specific times in the video (these can be overlays too, or can be anywhere in the documents)

```HTML
<div video-id="my-video" video-start="00:15" video-end="07:30">
  <p>This text is visible from the 00:15 until 07:30</p>
</div>
```

Use **video-play** to create a Play button

```HTML
<button video-id="my-video" video-play>Play or Pause</button>
```

### Compatibility

Tested with Firefox 65, Chrome 72.

Compatible with Bootstrap (see Example file).

### Future improvements

More options for overlay positioning.

Automatic generation of a timeline.

More custom controls.

Use of a Video Player library for compatibility with FLV, YouTube, Vimeo, etc.

Please contact me for any suggestions!
