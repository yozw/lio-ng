ace.define('ace/mode/gmpl',
    ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text',
      'ace/tokenizer', 'ace/mode/gmpl_highlight_rules', 'ace/range'],
    function (require, exports, module) {
      "use strict";

      var oop = require("../lib/oop");
      var TextMode = require("./text").Mode;
      var Tokenizer = require("../tokenizer").Tokenizer;
      var GmplHighlightRules = require("./gmpl_highlight_rules").GmplHighlightRules;
      var Range = require("../range").Range;

      var Mode = function () {
        this.HighlightRules = GmplHighlightRules;
      };
      oop.inherits(Mode, TextMode);

      (function () {
        this.lineCommentStart = "#";
        this.blockComment = {start: "/*", end: "*/"};
        this.$id = "ace/mode/gmpl";
      }).call(Mode.prototype);

      exports.Mode = Mode;

    });

ace.define(
    'ace/mode/gmpl_highlight_rules',
    ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
    function (require, exports, module) {
      "use strict";

      var oop = require("../lib/oop");
      var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

      var GmplHighlightRules = function () {
        var keywords = "and|by|cross|default|diff|div|dimen|else|if|in|inter|less|mod|not|or|symdiff|then|union|within";
        var statements = "set|param|integer|binary|symbolic|var|subject to|minimize|maximize|solve|check|display|"
            + "printf|for|data|end";

        var builtinConstants = (
            "true|false|null"
            );

        var builtinFunctions = (
            "count|abs|atan|card|ceil|cos|exp|floor|gmtime|length|log|log10|min|max|"
            + "round|sin|sqrt|str2time|trunc|Irand224|Uniform01|Uniform|Normal01|Normal|sum"
            );

        var keywordMapper = this.createKeywordMapper({
          "support.function": builtinFunctions,
          "keyword": keywords + "|" + statements,
          "constant.language": builtinConstants
        }, "identifier", true);

        this.$rules = {
          "start": [
            {
              token: "comment",
              regex: "#.*$"
            },
            {
              token : "comment", // multi line comment
              regex : /\/\*/,
              next : "comment"
            },
            {
              token: "keyword",
              regex: "subject to"
            },
            {
              token: "keyword",
              regex: "s\\.t\\."
            },
            {
              token: "string",           // " string
              regex: '".*?"'
            },
            {
              token: "string",           // ' string
              regex: "'.*?'"
            },
            {
              token: "constant.numeric", // float
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            },
            {
              token: keywordMapper,
              regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            },
            {
              token: "keyword.operator",
              regex: "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
            },
            {
              token: "paren.lparen",
              regex: "[\\(]"
            },
            {
              token: "paren.rparen",
              regex: "[\\)]"
            },
            {
              token: "text",
              regex: "\\s+"
            }
          ],
          "comment" : [
            {
              token : "comment", // closing comment
              regex : ".*?\\*\\/",
              next : "start"
            }, {
              token : "comment", // comment spanning whole line
              regex : ".+"
            }
          ]
        };
      };

      oop.inherits(GmplHighlightRules, TextHighlightRules);

      exports.GmplHighlightRules = GmplHighlightRules;
    });