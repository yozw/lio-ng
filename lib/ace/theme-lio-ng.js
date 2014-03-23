ace.define('ace/theme/lio-ng', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-lio-ng";
exports.cssText = "/* CSS style content for lio-ng.\
Cursor and selection styles from textmate.css. */\
.ace-lio-ng .ace_gutter {\
background: #e8e8e8;\
color: #AAA;\
}\
.ace-lio-ng  {\
background: #fff;\
color: #000;\
}\
.ace-lio-ng .ace_keyword {\
font-weight: normal;\
color: #336c9d; \
}\
.ace-lio-ng .ace_string {\
color: #2a9d2a;\
}\
.ace-lio-ng .ace_variable.ace_class {\
color: teal;\
}\
.ace-lio-ng .ace_constant.ace_numeric {\
color: #408080;\
}\
.ace-lio-ng .ace_constant.ace_buildin {\
color: #0086B3;\
}\
.ace-lio-ng .ace_support.ace_function {\
color: #0086B3;\
}\
.ace-lio-ng .ace_comment {\
color: #998;\
font-style: italic;\
}\
.ace-lio-ng .ace_variable.ace_language  {\
color: #0086B3;\
}\
.ace-lio-ng .ace_paren {\
font-weight: bold;\
}\
.ace-lio-ng .ace_boolean {\
font-weight: bold;\
}\
.ace-lio-ng .ace_string.ace_regexp {\
color: #009926;\
font-weight: normal;\
}\
.ace-lio-ng .ace_variable.ace_instance {\
color: teal;\
}\
.ace-lio-ng .ace_constant.ace_language {\
font-weight: bold;\
}\
.ace-lio-ng .ace_cursor {\
color: black;\
}\
.ace-lio-ng .ace_marker-layer .ace_active-line {\
background: rgb(255, 255, 204);\
}\
.ace-lio-ng .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-lio-ng.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
border-radius: 2px;\
}\
/* bold keywords cause cursor issues for some fonts */\
/* this disables bold style for editor and keeps for static highlighter */\
.ace-lio-ng.ace_nobold .ace_line > span {\
font-weight: normal !important;\
}\
.ace-lio-ng .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-lio-ng .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-lio-ng .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-lio-ng .ace_gutter-active-line {\
background-color : rgba(0, 0, 0, 0.07);\
}\
.ace-lio-ng .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-lio-ng .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-lio-ng .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
