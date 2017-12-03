"use strict";

var _KEYCODE_LEFT_ARROW = 37;
var _KEYCODE_RIGHT_ARROW = 39;
var _KEYCODE_SPACEBAR = 32;

var gFonts = [];
var gFontsIndex = 0;

var gTotalPagesCount = 5;
var gPageIndex = 0;

var gVoice = null;
var gSpeech = null;

$(document).ready(function (e) {
  $.getJSON('scripts/fonts.json', function (fonts) {
    var shuffledFonts = shuffle(fonts);
    gFonts = shuffledFonts;

    loadFirstPage();
    //loadRandomFont();
  });

  $("body").keydown(function (e) {
    switch (e.keyCode) {
      case _KEYCODE_LEFT_ARROW:
        loadPreviousPage();
        //loadRandomFont();
        break;

      case _KEYCODE_RIGHT_ARROW:
        loadNextPage();
        //loadRandomFont();
        break;

      case _KEYCODE_SPACEBAR:
        e.preventDefault();
        playOrPause();
        break;
    }
  });
});

loadVoices();
window.speechSynthesis.onvoiceschanged = function (e) {
  loadVoices();
};

function loadFirstPage() {
  gPageIndex = 0;
  loadPage(gPageIndex);
}

function loadNextPage() {
  gPageIndex++;

  if (gPageIndex >= gTotalPagesCount) {
    gPageIndex = 0;
  }
  if (gPageIndex < 0) {
    gPageIndex = gTotalPagesCount - 1;
  }

  loadPage(gPageIndex);
}

function loadPreviousPage() {
  gPageIndex--;

  if (gPageIndex >= gTotalPagesCount) {
    gPageIndex = 0;
  }
  if (gPageIndex < 0) {
    gPageIndex = gTotalPagesCount - 1;
  }

  loadPage(gPageIndex);
}

function loadPage(pageIndex) {
  var pageName = "page" + pageIndex + ".txt";

  // disable existing onend event
  // and cancel speaking
  if (gSpeech) {
    gSpeech.onend = null;
  }
  window.speechSynthesis.cancel();
  gSpeech = null;
  $.ajax({
    url: "scripts/" + pageName,
    cache: false,
    dataType: "text",
    success: function success(data) {
      console.log("Loaded %s", pageName);
      var p = $(".page");
      p.hide();
      p.text(data);
    }
  });
  loadRandomFont();
}

function loadRandomFont() {
  if (gFonts.length == 0) {
    return;
  }
  if (gFontsIndex == gFonts.length) {
    gFontsIndex = 0;
  }

  var f = gFonts[gFontsIndex];
  gFontsIndex++;

  WebFont.load({
    google: {
      families: [f + ":400:latin,latin-ext"]
    },
    fontactive: function fontactive(familyName, fvd) {
      console.log("Loaded font %s", familyName);

      displayPage(familyName);
    },
    inactive: function inactive() {
      // fallback
      // failed to load fonts, just display the message
      displayPage();
    }
  });
}

function displayPage(fontFamily) {
  var p = $(".page");
  if (fontFamily) {
    p.css("font-family", fontFamily);
  }
  p.show();

  var text = p.text();
  console.log(text);
  speak(text);
}

function speak(text) {
  var speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.volume = 0.8;
  speech.rate = 1;
  speech.pitch = 1;

  speech.voice = gVoice;

  // speech.onboundary = function(event) {
  //   console.log(event.name + ' boundary reached after ' + event.elapsedTime + 'ms.');
  // }
  speech.onend = function (event) {
    console.log('Finished speaking.');
    //console.log('Utterance has finished being spoken after ' + event.elapsedTime + 'ms.');
    //loadNextPage();
    setTimeout(loadNextPage, 550);
  };
  speech.onerror = function (event) {
    console.log('Error speaking: %s', event.error);
  };
  speech.onpause = function (event) {
    console.log('Speech paused.');
  };
  speech.onresume = function (event) {
    console.log('Speech resumed.');
  };

  gSpeech = speech;
  window.speechSynthesis.speak(speech);
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function loadVoices() {
  // Fetch the available voices.
  var voices = speechSynthesis.getVoices();
  if (!voices || voices.length == 0) {
    return;
  }

  var voice = voices.filter(function (voice) {
    // macOS languages:
    // sk-SK: Laura
    // cs-CZ: Zuzana

    return voice.name == 'Laura';
  })[0];

  if (!voice) {
    voice = voices[0];
  }

  gVoice = voice;
  console.log('We will use "%s" voice.', voice.name);
}

function playOrPause() {
  var synth = window.speechSynthesis;
  if (synth.speaking) {
    if (synth.paused) {
      synth.resume();
    } else {
      synth.pause();
    }
  }
}