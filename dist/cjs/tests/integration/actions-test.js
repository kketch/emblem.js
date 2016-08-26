'use strict';

var utils = require('../support/utils');
var integration_assertions = require('../support/integration-assertions');
var Emblem = require('../../emblem');

/* global QUnit*/

QUnit.module("actions");

test("basic (click)", function () {
  var emblem = "button click=\"submitComment\" Submit Comment";
  integration_assertions.compilesTo(emblem, "<button {{action \"submitComment\" on=\"click\"}}>Submit Comment</button>");
});

test("basic (click) preceded by action keyword", function () {
  var emblem = "button click=\"action submitComment\" Submit Comment";
  integration_assertions.compilesTo(emblem, "<button {{action submitComment on=\"click\"}}>Submit Comment</button>");
});

test("action has action in its name", function () {
  var emblem = "button click=\"submitTransaction\" Submit Comment";
  integration_assertions.compilesTo(emblem, "<button {{action \"submitTransaction\" on=\"click\"}}>Submit Comment</button>");
});

test("basic (click) followed by attr", function () {
  var emblem = "button click=\"submitComment\" class=\"foo\" Submit Comment";
  integration_assertions.compilesTo(emblem, "<button {{action \"submitComment\" on=\"click\"}} class=\"foo\">Submit Comment</button>");

  emblem = "button click=\"submitComment 'omg'\" class=\"foo\" Submit Comment";
  integration_assertions.compilesTo(emblem, "<button {{action submitComment 'omg' on=\"click\"}} class=\"foo\">Submit Comment</button>");
});

test("nested (mouseEnter)", function () {
  var emblem = utils.w("a mouseEnter='submitComment target=view'", "  | Submit Comment");
  integration_assertions.compilesTo(emblem, "<a {{action submitComment target=view on=\"mouseEnter\"}}>Submit Comment</a>");
});

test("explicitly single-quoted action name stays quoted", function () {
  var emblem = "a mouseEnter=\"'hello' target=controller\"";
  integration_assertions.compilesTo(emblem, "<a {{action 'hello' target=controller on=\"mouseEnter\"}}></a>");
});

test("explicitly dobule-quoted action name stays quoted", function () {
  var emblem = "a mouseEnter='\"hello\" target=controller'";
  integration_assertions.compilesTo(emblem, "<a {{action \"hello\" target=controller on=\"mouseEnter\"}}></a>");
});

test("nested (mouseEnter, singlequoted)", function () {
  var emblem = utils.w("a mouseEnter='submitComment target=\"view\"'", "  | Submit Comment");
  integration_assertions.compilesTo(emblem, "<a {{action submitComment target=\"view\" on=\"mouseEnter\"}}>Submit Comment</a>");
});

test("nested (mouseEnter, doublequoted)", function () {
  var emblem = utils.w("a mouseEnter=\"submitComment target='view'\"", "  | Submit Comment");
  integration_assertions.compilesTo(emblem, "<a {{action submitComment target='view' on=\"mouseEnter\"}}>Submit Comment</a>");
});

test("manual", function () {
  var emblem = "a{action someBoundAction target=view} Submit Comment";
  integration_assertions.compilesTo(emblem, "<a {{action someBoundAction target=view}}>Submit Comment</a>");
});

test("manual nested", function () {
  var emblem = utils.w("a{action 'submitComment' target=view}", "  p Submit Comment");
  integration_assertions.compilesTo(emblem, "<a {{action 'submitComment' target=view}}><p>Submit Comment</p></a>");
});

test("single quote test", function () {
  var emblem;
  emblem = "button click='p' Frank";
  integration_assertions.compilesTo(emblem, "<button {{action \"p\" on=\"click\"}}>Frank</button>");
});

test("double quote test", function () {
  var emblem;
  emblem = "button click=\"p\" Frank";
  integration_assertions.compilesTo(emblem, "<button {{action \"p\" on=\"click\"}}>Frank</button>");
});

test("no quote remains unquoted in output", function () {
  var emblem;
  emblem = "button click=p Frank";
  integration_assertions.compilesTo(emblem, "<button {{action p on=\"click\"}}>Frank</button>");
});

test("more advanced subexpressions work", function () {
  var emblem;
  emblem = "select change={ action (mut vehicle) value=\"target.value\" }";
  integration_assertions.compilesTo(emblem, "<select {{action (mut vehicle) value=\"target.value\"  on=\"change\"}}></select>");
});

test("actions with HTML events and mustache content", function () {
  var emblem;
  emblem = "select onchange={ action (mut vehicle) value=\"target.value\" }";
  integration_assertions.compilesTo(emblem, "<select onchange={{action (mut vehicle) value=\"target.value\"}}></select>");
});

test("actions with HTML events and mixing mustache actions and bound attrs", function () {
  var emblem;
  emblem = "button.small onclick={ action this.attrs.completeTask model } disabled=isEditing";
  integration_assertions.compilesTo(emblem, "<button onclick={{action this.attrs.completeTask model}} disabled={{isEditing}} class=\"small\"></button>");
});