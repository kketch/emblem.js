'use strict';

var utils = require('../support/utils');
var integration_assertions = require('../support/integration-assertions');

/*global QUnit*/

QUnit.module("glimmer-components");

test("basic syntax", function () {
  var emblem = utils.w("% my-component value=foo data-hint='not-my-component%%::'");
  integration_assertions.compilesTo(emblem, "<my-component value={{foo}} data-hint=\"not-my-component%%::\"></my-component>");
});

test("names with :", function () {
  var emblem = utils.w("% inputs:my-component value=foo");
  integration_assertions.compilesTo(emblem, "<inputs:my-component value={{foo}}></inputs:my-component>");
});

// @TODO
// test("names with / turn into :")

test("Blocks", function () {
  var emblem = utils.w("% my-component value=foo", "  |Hi!");
  integration_assertions.compilesTo(emblem, "<my-component value={{foo}}>Hi!</my-component>");
});

test("Block params", function () {
  var emblem = utils.w("% my-component value=foo as |comp1 comp2|", "  = comp.name");
  integration_assertions.compilesTo(emblem, "<my-component value={{foo}} as |comp1 comp2|>{{comp.name}}</my-component>");
});

// @TODO: What should the result of this be?
// test("Block params with else");

test("brackets with string", function () {
  var emblem = utils.w("", "%my-component [", "  foo=bar", "  baz='food' ]");
  integration_assertions.compilesTo(emblem, "<my-component foo={{bar}} baz=\"food\"></my-component>");
});

// Invalid
// test('brackets with positional params')

test("bracketed nested block", function () {
  var emblem = utils.w("", "%my-component [", "  something=\"false\" ]", "  p Bracketed helper attrs!");
  integration_assertions.compilesTo(emblem, "<my-component something=\"false\"><p>Bracketed helper attrs!</p></my-component>");
});

test("bracketed nested with actions", function () {
  var emblem = utils.w("", "%my-component [", "  onclick={ action 'doSometing' foo bar }", "  change='otherAction'", "  something=\"false\" ]", "  p Bracketed helper attrs!");
  integration_assertions.compilesTo(emblem, "<my-component onclick={{action 'doSometing' foo bar}} {{action \"otherAction\" on=\"change\"}} something=\"false\"><p>Bracketed helper attrs!</p></my-component>");
});

// @TODO: should these support mustache-like syntax?  (i.e. %my-component value=(foo) )
test("Sub-expressions", function () {
  var emblem = utils.w("% my-component value={ (or (eq foo 'bar') (eq foo 'baz')) }");
  integration_assertions.compilesTo(emblem, "<my-component value={{(or (eq foo 'bar') (eq foo 'baz'))}}></my-component>");
});

test("recursive nesting part 2", function () {
  var emblem = utils.w("", "%my-comp-1", "  %my-comp-2", "    p Hello");
  integration_assertions.compilesTo(emblem, "<my-comp-1><my-comp-2><p>Hello</p></my-comp-2></my-comp-1>");
});