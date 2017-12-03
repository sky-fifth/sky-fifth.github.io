"use strict";function loadFirstPage(){gPageIndex=0,loadPage(gPageIndex)}function loadNextPage(){gPageIndex++,gPageIndex>=gTotalPagesCount&&(gPageIndex=0),gPageIndex<0&&(gPageIndex=gTotalPagesCount-1),loadPage(gPageIndex)}function loadPreviousPage(){gPageIndex--,gPageIndex>=gTotalPagesCount&&(gPageIndex=0),gPageIndex<0&&(gPageIndex=gTotalPagesCount-1),loadPage(gPageIndex)}function loadPage(e){var n="page"+e+".txt";gSpeech&&(gSpeech.onend=null),window.speechSynthesis.cancel(),gSpeech=null,$.ajax({url:"scripts/"+n,dataType:"text",success:function(e){$(".page").hide(),$(".page").text(e)}}),loadRandomFont()}function loadRandomFont(){if(0!=gFonts.length){gFontsIndex==gFonts.length&&(gFontsIndex=0);var e=gFonts[gFontsIndex];gFontsIndex++,WebFont.load({google:{families:[e+":400:latin,latin-ext"]},fontactive:function(e,n){displayPage(e)},inactive:function(){displayPage()}})}}function displayPage(e){var n=$(".page");e&&n.css("font-family",e),n.show();var a=n.text();speak(a)}function speak(e){var n=new SpeechSynthesisUtterance;n.text=e,n.volume=.8,n.rate=1,n.pitch=1,n.voice=gVoice,n.onend=function(e){setTimeout(loadNextPage,550)},n.onerror=function(e){},n.onpause=function(e){},n.onresume=function(e){},gSpeech=n,window.speechSynthesis.speak(n)}function shuffle(e){for(var n,a,o=e.length;0!==o;)a=Math.floor(Math.random()*o),o-=1,n=e[o],e[o]=e[a],e[a]=n;return e}function loadVoices(){var e=speechSynthesis.getVoices();if(e&&0!=e.length){var n=e.filter(function(e){return"Laura"==e.name})[0];n||(n=e[0]),gVoice=n}}function playOrPause(){var e=window.speechSynthesis;e.speaking&&(e.paused?e.resume():e.pause())}var _KEYCODE_LEFT_ARROW=37,_KEYCODE_RIGHT_ARROW=39,_KEYCODE_SPACEBAR=32,gFonts=[],gFontsIndex=0,gTotalPagesCount=5,gPageIndex=0,gVoice=null,gSpeech=null;$(document).ready(function(e){$.getJSON("scripts/fonts.json",function(e){var n=shuffle(e);gFonts=n,loadFirstPage()}),$("body").keydown(function(e){switch(e.keyCode){case _KEYCODE_LEFT_ARROW:loadPreviousPage();break;case _KEYCODE_RIGHT_ARROW:loadNextPage();break;case _KEYCODE_SPACEBAR:e.preventDefault(),playOrPause()}})}),loadVoices(),window.speechSynthesis.onvoiceschanged=function(e){loadVoices()};