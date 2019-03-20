$(function() {


    /* Helper functions to switch betwen seconds and HH:mm:ss.xx format */

    function secs2tc(totalseconds) {
        if (totalseconds < 0 || isNaN(Number(totalseconds))) {
            throw "Invalid format"
        }
        var seconds = totalseconds % 60;
        var tc = seconds.toFixed(2);
        if (tc.length < 5) {
            tc = '0' + tc;
        }
        var totalminutes = Math.floor(totalseconds / 60);
        var minutes = totalminutes % 60;
        tc = minutes.toString() + ':' + tc;
        if (tc.length < 8) {
            tc = '0' + tc;
        }
        var hours = Math.floor(totalminutes / 60);
        tc = hours.toString() + ':' + tc;
        return tc;
    }

    function tc2secs(tc) {
        if (isNaN(Number(tc))) {
            var parts = tc.split(':');
            var l = parts.length;
            var secs = Number(parts[l-1]);
            if (l >= 2) {
                secs += 60 * Number(parts[l-2]);
                if (l >= 3) {
                    secs += 60 * 60 * Number(parts[l-3]);
                }
            }
            if (isNaN(secs)) {
                throw "Invalid format";
            }
            return secs;
        } else {
            return Number(tc);
        }
    }

    var $allMedia = $("audio,video");
    
    $allMedia.each(function(i) {
        var mediaElement = this;
        var $media = $(mediaElement);

        /* First, create a container for positioning overlays */

        var $mediaContainer = $("<div>");
        var $overlayContainer = $("<div>");
        $mediaContainer.css({
            "position": "relative",
            "display": "inline-block"
        });
        $overlayContainer.css({
            "position": "absolute",
            "left": 0,
            "top": 0,
            "width": "100%",
            "height": "100%",
            "pointer-events": "none"
        });
        $media.replaceWith($mediaContainer);
        $mediaContainer.append($media).append($overlayContainer);

        var id = $media.attr('id');
        if (!id) {
            id = 'video_' + (Math.floor(0x1000000*Math.random())).toString(16);

        }
        if (!i) {
            /* Elements with no video-id are associated with the first video in the DOM by default */
            $("[video-start],[video-end],[video-overlay],[video-play]:not([video-id])").attr("video-id", id);
        }

        /* Selecting HTML elements associated with the video */

        var $relatedContainers = $("[video-id='" + id + "'");

        /* Processing overlays */
        $relatedContainers.filter("[video-overlay]").css({
            "pointer-events": "auto"
        }).appendTo(
            $overlayContainer
        );

        /* Processing Play Buttons */
        $relatedContainers.filter("[video-play]").click(function() {
            if (mediaElement.paused) {
                mediaElement.play();
            } else {
                mediaElement.pause();
            }
        });

        /* Processing timecode-switched elements */
        var timeEvents = [];

        $relatedContainers.filter("[video-start],[video-end]").each(function() {
            var $relatedElement = $(this);

            $relatedElement.hide();
            var timeEventElement = {
                "$": $relatedElement,
                "visible": false
            };
            var start = $relatedElement.attr('video-start');
            var end = $relatedElement.attr('video-end');
            if (start) {
                timeEventElement.start = tc2secs(start);
            }
            if (end) {
                timeEventElement.end = tc2secs(end);
            }
            if (start && end && tc2secs(start) > tc2secs(end)) {
                throw "End time code should be higher than start time code";
            }
            timeEvents.push(timeEventElement);
        });

        function updateContainers() {
            var currentTime = mediaElement.currentTime || 0;
            timeEvents.forEach(function(timeEventElement) {
                var shouldBeHidden = (
                    (timeEventElement.hasOwnProperty('start') && (currentTime < timeEventElement.start))
                    || (timeEventElement.hasOwnProperty('end') && (currentTime > timeEventElement.end))
                );
                if (timeEventElement.visible && shouldBeHidden) {
                    timeEventElement.visible = false;
                    timeEventElement.$.fadeOut(500);
                } else {
                    if (!timeEventElement.visible && !shouldBeHidden) {
                        timeEventElement.visible = true;
                        timeEventElement.$.fadeIn(500);
                    }
                }
            });
        }

        $media.on("durationchange timeupdate", updateContainers);

    });

    /* End of $mediaElements.each() loop */

});

/* End of jQuery() */
