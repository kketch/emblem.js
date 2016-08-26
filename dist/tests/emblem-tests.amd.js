define('integration/actions-test', ['support/utils', 'support/integration-assertions', 'emblem'], function (utils, integration_assertions, Emblem) {

  'use strict';

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

});
define('integration/attributes-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("attributes: shorthand");

  test("id shorthand", function () {
    integration_assertions.compilesTo("#woot", "<div id=\"woot\"></div>");
    return integration_assertions.compilesTo("span#woot", "<span id=\"woot\"></span>");
  });

  test("class shorthand", function () {
    integration_assertions.compilesTo(".woot", "<div class=\"woot\"></div>");
    integration_assertions.compilesTo("span.woot", "<span class=\"woot\"></span>");
    return integration_assertions.compilesTo("span.woot.loot", "<span class=\"woot loot\"></span>");
  });

  test("class can come first", function () {
    integration_assertions.compilesTo(".woot#hello", "<div id=\"hello\" class=\"woot\"></div>");
    integration_assertions.compilesTo("span.woot#hello", "<span id=\"hello\" class=\"woot\"></span>");
    integration_assertions.compilesTo("span.woot.loot#hello", "<span id=\"hello\" class=\"woot loot\"></span>");
    return integration_assertions.compilesTo("span.woot.loot#hello.boot", "<span id=\"hello\" class=\"woot loot boot\"></span>");
  });

  QUnit.module("attributes: full attributes - tags with content");

  test("class only", function () {
    return integration_assertions.compilesTo("p class=\"yes\" Blork", "<p class=\"yes\">Blork</p>");
  });

  test("id only", function () {
    return integration_assertions.compilesTo("p id=\"yes\" Hyeah", "<p id=\"yes\">Hyeah</p>");
  });

  test("class and id", function () {
    return integration_assertions.compilesTo("p id=\"yes\" class=\"no\" Blork", "<p id=\"yes\" class=\"no\">Blork</p>");
  });

  test("class and id and embedded html one-liner", function () {
    return integration_assertions.compilesTo("p id=\"yes\" class=\"no\" One <b>asd</b>!", "<p id=\"yes\" class=\"no\">One <b>asd</b>!</p>");
  });

  test("bracketed attributes", function () {
    var emblem;
    emblem = "p [\n  id=\"yes\"\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
    return integration_assertions.compilesTo(emblem, "<p id=\"yes\" class=\"no\">Bracketed Attributes FTW!</p>");
  });

  test("bracketed mustache attributes", function () {
    var emblem;
    emblem = "p [\n  onclick={ action 'foo' }\n  class=\"no\" ]\n  | Bracketed Attributes FTW!";
    return integration_assertions.compilesTo(emblem, "<p onclick={{action 'foo'}} class=\"no\">Bracketed Attributes FTW!</p>");
  });

  test("bracketed text", function () {
    var emblem;
    emblem = "p [ Bracketed text is cool ]";
    return integration_assertions.compilesTo(emblem, "<p>[ Bracketed text is cool ]</p>");
  });

  test("bracketed text indented", function () {
    var emblem;
    emblem = "p\n  | [ Bracketed text is cool ]";
    return integration_assertions.compilesTo(emblem, "<p>[ Bracketed text is cool ]</p>");
  });

  test("nesting", function () {
    var emblem;
    emblem = "p class=\"hello\" data-foo=\"gnarly\"\n  span Yes";
    return integration_assertions.compilesTo(emblem, "<p data-foo=\"gnarly\" class=\"hello\"><span>Yes</span></p>");
  });


  QUnit.module("attributes: full attributes - mixed quotes");

  test("single empty", function () {
    return integration_assertions.compilesTo("p class=''", "<p class=\"\"></p>");
  });

  test("single full", function () {
    return integration_assertions.compilesTo("p class='woot yeah'", "<p class=\"woot yeah\"></p>");
  });

  test("mixed", function () {
    return integration_assertions.compilesTo("p class='woot \"oof\" yeah'", "<p class=\"woot \\\"oof\\\" yeah\"></p>");
  });

  QUnit.module("attributes: full attributes - tags without content");

  test("empty", function () {
    return integration_assertions.compilesTo("p class=\"\"", "<p class=\"\"></p>");
  });

  test("class only", function () {
    return integration_assertions.compilesTo("p class=\"yes\"", "<p class=\"yes\"></p>");
  });

  test("id only", function () {
    return integration_assertions.compilesTo("p id=\"yes\"", "<p id=\"yes\"></p>");
  });

  test("class and id", function () {
    return integration_assertions.compilesTo("p id=\"yes\" class=\"no\"", "<p id=\"yes\" class=\"no\"></p>");
  });

  QUnit.module("attributes: full attributes w/ mustaches");

  test("with mustache", function () {
    var emblem;
    integration_assertions.compilesTo("p class=\"foo {{yes}}\"", "<p class=\"foo {{yes}}\"></p>");
    integration_assertions.compilesTo("p class=\"foo {{yes}}\" Hello", "<p class=\"foo {{yes}}\">Hello</p>");
    emblem = "p class=\"foo {{yes}}\"\n  | Hello";
    return integration_assertions.compilesTo(emblem, "<p class=\"foo {{yes}}\">Hello</p>");
  });

  test("with mustache calling helper", function () {
    var emblem;

    integration_assertions.compilesTo("p class=\"foo {{{echo \"YES\"}}}\"", "<p class=\"foo {{{echo \\\"YES\\\"}}}\"></p>");

    integration_assertions.compilesTo("p class=\"foo #{echo \"NO\"} and {{{echo \"YES\"}}}\" Hello", "<p class=\"foo {{echo \\\"NO\\\"}} and {{{echo \\\"YES\\\"}}}\">Hello</p>");

    emblem = "p class=\"foo {{echo \"BORF\"}}\"\n  | Hello";
    integration_assertions.compilesTo(emblem, "<p class=\"foo {{echo \\\"BORF\\\"}}\">Hello</p>");
  });

  QUnit.module("attributes: boolean");

  test("static", function () {
    integration_assertions.compilesTo("p borf=true", "<p borf></p>");
    integration_assertions.compilesTo("p borf=true Woot", "<p borf>Woot</p>");
    integration_assertions.compilesTo("p borf=false", "<p></p>");
    integration_assertions.compilesTo("p borf=false Nork", "<p>Nork</p>");
    integration_assertions.compilesTo("option selected=true Thingeroo", "<option selected>Thingeroo</option>");
  });

  QUnit.module("attributes: class name coalescing");

  test("when literal class is used", function () {
    return integration_assertions.compilesTo("p.foo class=\"bar\"", "<p class=\"foo bar\"></p>");
  });

  test("when ember expression is used with variable", function () {
    integration_assertions.compilesTo("p.foo class=bar", "<p class=\"foo {{bar}}\"></p>");
  });

  test("when ember expression is used with variable in braces", function () {
    integration_assertions.compilesTo("p.foo class={ bar }", "<p class=\"foo {{bar}}\"></p>");
  });

  test("when ember expression is used with constant in braces", function () {
    integration_assertions.compilesTo("p.foo class={ :bar }", "<p class=\"foo bar\"></p>");
  });

  test("when ember expression is used with constant and variable in braces", function () {
    integration_assertions.compilesTo("p.foo class={ :bar bar }", "<p class=\"foo bar {{bar}}\"></p>");
  });

  QUnit.module("attributes: shorthand: mustache DOM attribute shorthand");

  test("tagName w/o space", function () {
    var emblem = "App.FunView%span";
    integration_assertions.compilesTo(emblem, "{{view App.FunView tagName=\"span\"}}");
  });

  test("tagName w/ space", function () {
    var emblem = "App.FunView %span";
    integration_assertions.compilesTo(emblem, "{{view App.FunView tagName=\"span\"}}");
  });

  test("tagName block", function () {
    var emblem = "App.FunView%span\n  p Hello";
    integration_assertions.compilesTo(emblem, "{{#view App.FunView tagName=\"span\"}}<p>Hello</p>{{/view}}");
  });

  test("class w/ space (needs space)", function () {
    var emblem = "App.FunView .bork";
    integration_assertions.compilesTo(emblem, "{{view App.FunView class=\"bork\"}}");
  });

  test("multiple classes", function () {
    var emblem = "App.FunView .bork.snork";
    integration_assertions.compilesTo(emblem, "{{view App.FunView class=\"bork snork\"}}");
  });

  test("elementId", function () {
    var emblem = "App.FunView#ohno";
    integration_assertions.compilesTo(emblem, "{{view App.FunView elementId=\"ohno\"}}");
  });

  test("mixed w/ hash`", function () {
    var emblem = "App.FunView .bork.snork funbags=\"yeah\"";
    integration_assertions.compilesTo(emblem, "{{view App.FunView funbags=\"yeah\" class=\"bork snork\"}}");
  });

  test("mixture of all`", function () {
    var emblem = "App.FunView%alex#hell.bork.snork funbags=\"yeah\"";
    integration_assertions.compilesTo(emblem, "{{view App.FunView funbags=\"yeah\" tagName=\"alex\" elementId=\"hell\" class=\"bork snork\"}}");
  });

  QUnit.module("attributes: bound and unbound");

  test("path with dot", function () {
    var emblem = "iframe src=post.pdfAttachment";
    integration_assertions.compilesTo(emblem, "<iframe src={{post.pdfAttachment}}></iframe>");

    emblem = "iframe src=post.pdfAttachmentUrl width=\"96%\" height=\"400\" view=\"FitV\" frameborder=\"0\" style=\"z-index: 0 !important;\"";
    integration_assertions.compilesTo(emblem, "<iframe src={{post.pdfAttachmentUrl}} width=\"96%\" height=\"400\" view=\"FitV\" frameborder=\"0\" style=\"z-index: 0 !important;\"></iframe>");
  });

  test("mustache in attribute", function () {
    var emblem = "img src=\"{{unbound post.showLogoUrl}}\" onerror=\"this.src='{{unbound orgSettings.onErrorBlankLogoImage}}'\"";
    integration_assertions.compilesTo(emblem, "<img src=\"{{unbound post.showLogoUrl}}\" onerror=\"this.src='{{unbound orgSettings.onErrorBlankLogoImage}}'\">");
  });

  test("mustache in attribute with exclamation point", function () {
    var emblem = "a href=postLink! target='_blank'";
    integration_assertions.compilesTo(emblem, "<a href=\"{{unbound postLink}}\" target=\"_blank\"></a>");
  });

  test("mustache attribute value has comma", function () {
    var emblem = "a name='my, cool, name'";
    integration_assertions.compilesTo(emblem, "<a name=\"my, cool, name\"></a>");
  });

  test("mustache class binding", function () {
    var emblem = "iframe.foo class=dog";
    integration_assertions.compilesTo(emblem, "<iframe class=\"foo {{dog}}\"></iframe>");
  });

  test("numbers in shorthand", function () {
    integration_assertions.compilesTo("#4a", "<div id=\"4a\"></div>");
    integration_assertions.compilesTo(".4a", "<div class=\"4a\"></div>");
    integration_assertions.compilesTo(".4", "<div class=\"4\"></div>");
    integration_assertions.compilesTo("#4", "<div id=\"4\"></div>");
    integration_assertions.compilesTo("%4", "<4></4>");
    integration_assertions.compilesTo("%4 ermagerd", "<4>ermagerd</4>");
    integration_assertions.compilesTo("%4#4.4 ermagerd", "<4 id=\"4\" class=\"4\">ermagerd</4>");
  });

  test("negative numbers should work", function () {
    integration_assertions.compilesTo("foo positive=100 negative=-100", "{{foo positive=100 negative=-100}}");
  });

  test("booleans with and without quoting", function () {
    integration_assertions.compilesTo("foo what=false", "{{foo what=false}}");
    integration_assertions.compilesTo("foo what=\"false\"", "{{foo what=\"false\"}}");
    integration_assertions.compilesTo("foo what='false'", "{{foo what='false'}}");
  });

  test("bound attributes from within strings", function () {
    var emblem = "div style=\"width: {{userProvidedWidth}}px;\"";
    integration_assertions.compilesTo(emblem, "<div style=\"width: {{userProvidedWidth}}px;\"></div>");
  });

  QUnit.module("attributes with inline if");

  test("with attribute and bound values", function () {
    var emblem = "div style={ if isActive foo bar }";
    integration_assertions.compilesTo(emblem, "<div style={{if isActive foo bar}}></div>");
  });

  test("with attribute", function () {
    var emblem = "a href={ if isActive 'http://google.com' 'http://bing.com' }";
    integration_assertions.compilesTo(emblem, "<a href={{if isActive 'http://google.com' 'http://bing.com'}}></a>");
  });

  test("with attribute and bound values", function () {
    var emblem = "a href={ if isActive google bing }";
    integration_assertions.compilesTo(emblem, "<a href={{if isActive google bing}}></a>");
  });

  test("unbound attributes", function () {
    var emblem = "div class={ if isActive 'foo' 'bar' }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive 'foo' 'bar'}}></div>");
  });

  test("bound attributes", function () {
    var emblem = "div class={ if isActive foo bar }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive foo bar}}></div>");
  });

  test("mixed attributes", function () {
    var emblem = "div class={ if isActive 'foo' bar }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive 'foo' bar}}></div>");
  });

  test("unbound attributes with full quote", function () {
    var emblem = "div class={ if isActive \"foo\" bar }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive \"foo\" bar}}></div>");
  });

  test("one unbound option", function () {
    var emblem = "div class={ if isActive \"foo\" }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive \"foo\"}}></div>");
  });

  test("one bound option", function () {
    var emblem = "div class={ if isActive foo }";
    integration_assertions.compilesTo(emblem, "<div class={{if isActive foo}}></div>");
  });

  test("within a string", function () {
    var emblem = "div style=\"{{ if isActive \"15\" \"25\" }}px\"";
    integration_assertions.compilesTo(emblem, "<div style=\"{{if isActive \\\"15\\\" \\\"25\\\" }}px\"></div>");
  });

  test("with dot params", function () {
    var emblem = utils.w("li class={ if content.length 'just-one' }", "  |Thing");
    integration_assertions.compilesTo(emblem, "<li class={{if content.length 'just-one'}}>Thing</li>");
  });

  test("mixed with subexpressions", function () {
    var emblem = utils.w("li class={ if (has-one content.length) 'just-one' }", "  |Thing");
    integration_assertions.compilesTo(emblem, "<li class={{if (has-one content.length) 'just-one'}}>Thing</li>");
  });

  QUnit.module("binding behavior for unquoted attribute values");

  test("basic", function () {
    var emblem = "p class=foo";
    integration_assertions.compilesTo(emblem, "<p class={{foo}}></p>");
  });

  test("basic w/ underscore", function () {
    var emblem = "p class=foo_urns";
    integration_assertions.compilesTo(emblem, "<p class={{foo_urns}}></p>");
  });

  test("subproperties", function () {
    var emblem = "p class=foo._death.woot";
    integration_assertions.compilesTo(emblem, "<p class={{foo._death.woot}}></p>");
  });

  test("multiple", function () {
    var emblem = "p class=foo id=\"yup\" data-thinger=yeah Hooray";
    integration_assertions.compilesTo(emblem, "<p id=\"yup\" data-thinger={{yeah}} class={{foo}}>Hooray</p>");
  });

  test("in brackets", function () {
    var emblem;
    emblem = "p [\n  id=id some-data=data.ok]\n";
    return integration_assertions.compilesTo(emblem, "<p id={{id}} some-data={{data.ok}}></p>");
  });

  test("class special syntax with 2 vals", function () {
    var emblem = "p class=foo:bar:baz";
    integration_assertions.compilesTo(emblem, "<p class={{if foo 'bar' 'baz'}}></p>");
  });

  test("class special syntax with only 2nd val", function () {
    var emblem = "p class=foo::baz";
    integration_assertions.compilesTo(emblem, "<p class={{if foo '' 'baz'}}></p>");
  });

  test("class special syntax with only 1st val", function () {
    var emblem = "p class=foo:baz";
    integration_assertions.compilesTo(emblem, "<p class={{if foo 'baz'}}></p>");
  });

  test("class special syntax with slashes", function () {
    var emblem = "p class=foo/bar:baz";
    integration_assertions.compilesTo(emblem, "<p class={{if foo/bar 'baz'}}></p>");
  });

  test("Inline binding with mixed classes", function () {
    var emblem = ".notice class={ test::active }";
    integration_assertions.compilesTo(emblem, "<div class=\"notice {{if test '' 'active'}}\"></div>");
  });

  test("class braced syntax w/ underscores and dashes", function () {
    integration_assertions.compilesTo("p class={f-oo:bar :b_az}", "<p class=\"b_az {{if f-oo 'bar'}}\"></p>");
    integration_assertions.compilesTo("p class={ f-oo:bar :b_az }", "<p class=\"b_az {{if f-oo 'bar'}}\"></p>");
    integration_assertions.compilesTo("p class={ f-oo:bar :b_az } Hello", "<p class=\"b_az {{if f-oo 'bar'}}\">Hello</p>");
    var emblem = utils.w(".input-prepend class={ filterOn:input-append }", "  span.add-on");
    integration_assertions.compilesTo(emblem, "<div class=\"input-prepend {{if filterOn 'input-append'}}\"><span class=\"add-on\"></span></div>");
  });

  test("multiple bindings with inline conditionals", function () {
    var emblem = "button class={ thing1:active thing2:alert }";
    integration_assertions.compilesTo(emblem, "<button class=\"{{if thing1 'active'}} {{if thing2 'alert'}}\"></button>");
  });

  test("exclamation modifier (ember)", function () {
    var emblem = "p class=foo!";
    integration_assertions.compilesTo(emblem, "<p class=\"{{unbound foo}}\"></p>");
  });

  test("block as #each", function () {
    var emblem = utils.w("thangs", "  p Woot #{yeah}");
    integration_assertions.compilesTo(emblem, "{{#thangs}}<p>Woot {{yeah}}</p>{{/thangs}}");
  });

});
define('integration/capitalized-line-starter-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("capitalized line-starter");

  test("should invoke `view` helper by default", function () {
    var emblem = utils.w("SomeView");
    integration_assertions.compilesTo(emblem, "{{view SomeView}}");
  });

  test("should support block mode", function () {
    var emblem = utils.w("SomeView", "  p View content");
    integration_assertions.compilesTo(emblem, "{{#view SomeView}}<p>View content</p>{{/view}}");
  });

  test("should not kick in if preceded by equal sign", function () {
    var emblem = utils.w("= SomeView");
    integration_assertions.compilesTo(emblem, "{{SomeView}}");
  });

  test("should not kick in if preceded by equal sign (example with partial)", function () {
    var emblem = utils.w("= partial \"cats\"");
    integration_assertions.compilesTo(emblem, "{{partial \"cats\"}}");
  });

  test("should not kick in explicit {{mustache}}", function () {
    var emblem = utils.w("p Yeah {{SomeView}}");
    integration_assertions.compilesTo(emblem, "<p>Yeah {{SomeView}}</p>");
  });

});
define('integration/colon-separator-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("colon separator");

  test("basic", function () {
    var emblem;
    emblem = "each foo: p Hello, #{this}";
    integration_assertions.compilesTo(emblem, "{{#each foo}}<p>Hello, {{this}}</p>{{/each}}");
  });

  test("html stack", function () {
    var emblem;
    emblem = ".container: .row: .span5: span Hello";
    return integration_assertions.compilesTo(emblem, "<div class=\"container\"><div class=\"row\"><div class=\"span5\"><span>Hello</span></div></div></div>");
  });

  test("epic", function () {
    var emblem;
    emblem = ".container: .row: .span5\n  ul#list data-foo=\"yes\": each foo: li\n    span: this";
    return integration_assertions.compilesTo(emblem, "<div class=\"container\"><div class=\"row\"><div class=\"span5\"><ul id=\"list\" data-foo=\"yes\">{{#each foo}}<li><span>{{this}}</span></li>{{/each}}</ul></div></div></div>");
  });

  test("html stack elements only", function () {
    var emblem;
    emblem = "p: span: div: p: foo";
    return integration_assertions.compilesTo(emblem, "<p><span><div><p>{{foo}}</p></div></span></p>");
  });

  test("mixed separators", function () {
    var emblem;
    emblem = ".fun = each foo: %nork = this";
    return integration_assertions.compilesTo(emblem, "<div class=\"fun\">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>");
  });

  test("mixed separators rewritten", function () {
    var emblem;
    emblem = ".fun: each foo: %nork: this";
    return integration_assertions.compilesTo(emblem, "<div class=\"fun\">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>");
  });

  test("with text terminator", function () {
    var emblem;
    emblem = ".fun: view SomeView | Hello";
    return integration_assertions.compilesTo(emblem, "<div class=\"fun\">{{#view SomeView}}Hello{{/view}}</div>");
  });

  test("test from heartsentwined", function () {
    integration_assertions.compilesTo("li data-foo=bar: a", "<li data-foo={{bar}}><a></a></li>");
    integration_assertions.compilesTo("li data-foo='bar': a", "<li data-foo=\"bar\"><a></a></li>");
  });

  test("mixture of colon and indentation", function () {
    var emblem;
    emblem = "li data-foo=bar: a\n  baz";
    return integration_assertions.compilesTo(emblem, "<li data-foo={{bar}}><a>{{baz}}</a></li>");
  });

  test("mixture of colon and indentation pt.2", function () {
    var emblem, result;
    emblem = utils.w("ul", "  li data-foo=bar: a quux", "  li data-foo='bar': a quux", "  li data-foo=bar href='#': a quux");
    integration_assertions.compilesTo(emblem, "<ul><li data-foo={{bar}}><a>quux</a></li><li data-foo=\"bar\"><a>quux</a></li><li data-foo={{bar}} href=\"#\"><a>quux</a></li></ul>");
  });

  test("condensed nesting", function () {
    var emblem = "\n    #content-frame: .container: .row\n      .span4: render \"sidebar\"\n      .span8: render \"main\"\n  ";
    integration_assertions.compilesTo(emblem, "<div id=\"content-frame\"><div class=\"container\"><div class=\"row\"><div class=\"span4\">{{render \"sidebar\"}}</div><div class=\"span8\">{{render \"main\"}}</div></div></div></div>");
  });

});
define('integration/comments-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("comments");

  QUnit.test("it strips out single line '/' comments", function () {
    var emblem = utils.w("p Hello", "", "/ A comment", "", "h1 How are you?");
    integration_assertions.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });

  QUnit.test("it strips out multi-line '/' comments", function () {
    var emblem = utils.w("p Hello", "", "/ A comment", "  that goes on to two lines", "  even three!", "", "h1 How are you?");
    integration_assertions.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });

  QUnit.test("it strips out multi-line '/' comments without text on the first line", function () {
    var emblem = utils.w("p Hello", "", "/ ", "  A comment", "  that goes on to two lines", "  even three!", "", "h1 How are you?");
    integration_assertions.compilesTo(emblem, "<p>Hello</p><h1>How are you?</h1>");
  });


  QUnit.test("mix and match with various indentation", function () {
    var emblem = utils.w("/ A test", "p Hello", "", "span", "  / This is gnarly", "  p Yessir nope.", "", "/ Nothin but comments", "  so many comments.", "", "/", "  p Should not show up");
    integration_assertions.compilesTo(emblem, "<p>Hello</p><span><p>Yessir nope.</p></span>");
  });

  QUnit.test("uneven indentation", function () {
    var emblem = utils.w("/ nop", "  nope", "    nope");
    integration_assertions.compilesTo(emblem, "");
  });

  QUnit.test("uneven indentation 2", function () {
    var emblem = utils.w("/ n", "  no", "    nop", "  nope");
    integration_assertions.compilesTo(emblem, "");
  });

  QUnit.test("uneven indentation 3", function () {
    var emblem = utils.w("/ n", "  no", "    nop", "  nope");
    integration_assertions.compilesTo(emblem, "");
  });


  QUnit.test("empty first line", function () {
    var emblem = utils.w("/ ", "  nop", "  nope", "    nope", "  no");
    integration_assertions.compilesTo(emblem, "");
  });

  QUnit.test("on same line as html content", function () {
    var emblem = utils.w(".container / This comment doesn't show up", "  .row / Nor does this", "    p Hello");
    integration_assertions.compilesTo(emblem, "<div class=\"container\"><div class=\"row\"><p>Hello</p></div></div>");
  });

  QUnit.test("on same line as mustache content", function () {
    integration_assertions.compilesTo("frank text=\"YES\" text2=\"NO\" / omg", "{{frank text=\"YES\" text2=\"NO\"}}");
  });

  QUnit.test("on same line as colon syntax", function () {
    var emblem = utils.w("ul: li: span / omg", "  | Hello");
    integration_assertions.compilesTo(emblem, "<ul><li><span>Hello</span></li></ul>");
  });

});
define('integration/conditionals-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("conditionals");

  test("simple if statement", function () {
    var emblem = utils.w("if foo", "  | Foo", "if bar", "  | Bar");
    integration_assertions.compilesTo(emblem, "{{#if foo}}Foo{{/if}}{{#if bar}}Bar{{/if}}");
  });

  test("simple if else statement", function () {
    var emblem = utils.w("if foo", "  | Foo", "else", "  | Bar");
    integration_assertions.compilesTo(emblem, "{{#if foo}}Foo{{else}}Bar{{/if}}");
  });

  test("if else ", function () {
    var emblem = utils.w("if foo", "  | Foo", "  if bar", "    | Bar", "  else", "    | Woot", "else", "  | WRONG", "if bar", "  | WRONG", "else", "  | Hooray");
    integration_assertions.compilesTo(emblem, "{{#if foo}}Foo{{#if bar}}Bar{{else}}Woot{{/if}}{{else}}WRONG{{/if}}{{#if bar}}WRONG{{else}}Hooray{{/if}}");
  });

  test("else with preceding `=`", function () {
    var emblem = utils.w("= if foo", "  p Yeah", "= else", "  p No", "= if bar", "  p Yeah!", "= else", "  p No!", "=if bar", "  p Yeah!", "=else", "  p No!");
    integration_assertions.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}{{#if bar}}<p>Yeah!</p>{{else}}<p>No!</p>{{/if}}");
  });


  test("unless", function () {
    var emblem = utils.w("unless bar", "  | Foo", "  unless foo", "    | Bar", "  else", "    | Woot", "else", "  | WRONG", "unless foo", "  | WRONG", "else", "  | Hooray");
    integration_assertions.compilesTo(emblem, "{{#unless bar}}Foo{{#unless foo}}Bar{{else}}Woot{{/unless}}{{else}}WRONG{{/unless}}{{#unless foo}}WRONG{{else}}Hooray{{/unless}}");
  });

  test("else followed by newline doesn't gobble else content", function () {
    var emblem = utils.w("if something", "  p something", "else", "", "  if nothing", "    p nothing", "  else", "    p not nothing");
    integration_assertions.compilesTo(emblem, "{{#if something}}<p>something</p>{{else}}{{#if nothing}}<p>nothing</p>{{else}}<p>not nothing</p>{{/if}}{{/if}}");
  });

  test("else if block", function () {
    var emblem = utils.w("if something", "  p something", "else if somethingElse", "  p nothing");
    integration_assertions.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>nothing</p>{{/if}}");
  });

  test("else if with else block", function () {
    var emblem = utils.w("if something", "  p something", "else if somethingElse", "  p otherThing", "else", "  p nothing");
    integration_assertions.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if twice with else block", function () {
    var emblem = utils.w("if something", "  p something", "else if somethingElse", "  p otherThing", "else if anotherSomethingElse", "  p otherThing2", "else", "  p nothing");
    integration_assertions.compilesTo(emblem, "{{#if something}}<p>something</p>{{else if somethingElse}}<p>otherThing</p>{{else if anotherSomethingElse}}<p>otherThing2</p>{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if with extra nodes", function () {
    var emblem = utils.w("if something", "  p something", "  h2", "    p something", "else if somethingElse", "  p otherThing", "  if twoThree", "    strong 2:3", "  else if twoFour", "    strong 2:4", "else if anotherSomethingElse", "  p otherThing2", "  h2", "    h4", "      p something", "else", "  p nothing");
    integration_assertions.compilesTo(emblem, "{{#if something}}<p>something</p><h2><p>something</p></h2>" + "{{else if somethingElse}}<p>otherThing</p>{{#if twoThree}}<strong>2:3</strong>{{else if twoFour}}<strong>2:4</strong>{{/if}}" + "{{else if anotherSomethingElse}}<p>otherThing2</p><h2><h4><p>something</p></h4></h2>" + "{{else}}<p>nothing</p>{{/if}}");
  });

  test("else if with component block", function () {
    var emblem = utils.w("if something", "  = my-component/widget-a value=model.options as |component indexWidget|", "    p The current value is #{ indexWidget }", "    strong = component.warningMessage", "else if somethingElse", "  h5 Danger!");
    integration_assertions.compilesTo(emblem, "{{#if something}}{{#my-component/widget-a value=model.options as |component indexWidget|}}<p>The current value is {{indexWidget }}</p><strong>{{component.warningMessage}}</strong>{{/my-component/widget-a}}" + "{{else if somethingElse}}<h5>Danger!</h5>{{/if}}");
  });

  test("inline if with unbound statements", function () {
    var emblem = utils.w("if something 'something' 'somethingElse'");
    integration_assertions.compilesTo(emblem, "{{if something 'something' 'somethingElse'}}");
  });

  test("inline if with bound statements", function () {
    var emblem = utils.w("if something something 'somethingElse'");
    integration_assertions.compilesTo(emblem, "{{if something something 'somethingElse'}}");
  });

  test("truth helpers syntax test 1", function () {
    var emblem = utils.w("if (eq 1 2)", "  |1 == 2", "unless (eq 1 2)", "  |1 != 2");
    integration_assertions.compilesTo(emblem, "{{#if (eq 1 2)}}1 == 2{{/if}}{{#unless (eq 1 2)}}1 != 2{{/unless}}");
  });

  test("truth helpers syntax test 2", function () {
    var emblem = utils.w("if (is-array siblings)", "  each siblings as |sibling|", "    |My sibling: #{ sibling }", "else if (and (not model.isLoading) model.isError)", "  p Hey!");
    integration_assertions.compilesTo(emblem, "{{#if (is-array siblings)}}{{#each siblings as |sibling|}}My sibling: {{sibling }}{{/each}}" + "{{else if (and (not model.isLoading) model.isError)}}<p>Hey!</p>{{/if}}");
  });

});
define('integration/general-test-legacy', ['emblem'], function (Emblem) {

  'use strict';

});
define('integration/glimmer-component-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

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

});
define('integration/haml-style-test', ['support/integration-assertions'], function (integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("haml style");

  test("basic", function () {
    var emblem;
    emblem = "%borf";
    return integration_assertions.compilesTo(emblem, "<borf></borf>");
  });

  test("nested", function () {
    var emblem;
    emblem = "%borf\n    %sporf Hello";
    return integration_assertions.compilesTo(emblem, "<borf><sporf>Hello</sporf></borf>");
  });

  test("capitalized", function () {
    var emblem;
    emblem = "%Alex alex\n%Alex\n  %Woot";
    return integration_assertions.compilesTo(emblem, "<Alex>alex</Alex><Alex><Woot></Woot></Alex>");
  });

  test("funky chars", function () {
    var emblem;
    emblem = "%borf:narf\n%borf:narf Hello, {{foo}}.\n%alex = foo";
    return integration_assertions.compilesTo(emblem, "<borf:narf></borf:narf><borf:narf>Hello, {{foo}}.</borf:narf><alex>{{foo}}</alex>");
  });

});
define('integration/html-test', ['emblem', 'support/utils', 'support/integration-assertions'], function (Emblem, utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("html: single line");

  QUnit.test("element only", function () {
    integration_assertions.compilesTo("p", "<p></p>");
  });

  QUnit.test("with text", function () {
    integration_assertions.compilesTo("p Hello", "<p>Hello</p>");
  });

  QUnit.test("with more complex text", function () {
    integration_assertions.compilesTo("p Hello, how's it going with you today?", "<p>Hello, how's it going with you today?</p>");
  });

  QUnit.test("with inline html", function () {
    integration_assertions.compilesTo("p Hello, how are you <strong>man</strong>", "<p>Hello, how are you <strong>man</strong></p>");
  });

  QUnit.test("with trailing space", function () {
    integration_assertions.compilesTo("p Hello   ", "<p>Hello   </p>");
  });

  QUnit.test("can start with angle bracket html", function () {
    var emblem = "<span>Hello</span>";
    integration_assertions.compilesTo(emblem, "<span>Hello</span>");
  });

  QUnit.module("html: multiple lines");

  QUnit.test("two lines", function () {
    var emblem = utils.w("p This is", "  pretty cool.");
    integration_assertions.compilesTo(emblem, "<p>This is pretty cool.</p>");
  });

  QUnit.test("three lines", function () {
    var emblem = utils.w("p This is", "  pretty damn", "  cool.");
    integration_assertions.compilesTo(emblem, "<p>This is pretty damn cool.</p>");
  });

  QUnit.test("three lines w/ embedded html", function () {
    var emblem = utils.w("p This is", "  pretty <span>damn</span>", "  cool.");
    integration_assertions.compilesTo(emblem, "<p>This is pretty <span>damn</span> cool.</p>");
  });

  QUnit.test("indentation doesn't need to match starting inline content's", function () {
    var emblem = utils.w("  span Hello,", "    How are you?");
    integration_assertions.compilesTo(emblem, "<span>Hello, How are you?</span>");
  });

  QUnit.test("indentation may vary between parent/child, must be consistent within inline-block", function () {
    var emblem = utils.w("div", "      span Hello,", "           How are you?", "           Excellent.", "      p asd");
    integration_assertions.compilesTo(emblem, "<div><span>Hello, How are you? Excellent.</span><p>asd</p></div>");

    emblem = utils.w("div", "  span Hello,", "       How are you?", "     Excellent.");
    QUnit.throws(function () {
      Emblem['default'].compile(emblem);
    });
  });

  QUnit.test("indentation may vary between parent/child, must be consistent within inline-block pt 2", function () {
    var emblem = utils.w("div", "  span Hello,", "       How are you?", "       Excellent.");

    integration_assertions.compilesTo(emblem, "<div><span>Hello, How are you? Excellent.</span></div>");
  });


  QUnit.test("w/ mustaches", function () {
    var emblem = utils.w("div", "  span Hello,", "       {{foo}} are you?", "       Excellent.");

    integration_assertions.compilesTo(emblem, "<div><span>Hello, {{foo}} are you? Excellent.</span></div>");
  });

  QUnit.test("with followup", function () {
    var emblem = utils.w("p This is", "  pretty cool.", "p Hello.");
    integration_assertions.compilesTo(emblem, "<p>This is pretty cool.</p><p>Hello.</p>");
  });

  QUnit.test("can start with angle bracket html and go to multiple lines", function () {
    var emblem = utils.w("<span>Hello dude,", "      what's up?</span>");
    integration_assertions.compilesTo(emblem, "<span>Hello dude, what's up?</span>");
  });

  QUnit.module("html: nested");

  test("basic", function () {
    var emblem = utils.w("p", "  span Hello", "  strong Hi", "div", "  p Hooray");
    integration_assertions.compilesTo(emblem, "<p><span>Hello</span><strong>Hi</strong></p><div><p>Hooray</p></div>");
  });

  test("empty nest", function () {
    var emblem = utils.w("p", "  span", "    strong", "      i");
    integration_assertions.compilesTo(emblem, "<p><span><strong><i></i></strong></span></p>");
  });

  test("empty nest w/ attribute shorthand", function () {
    var emblem = utils.w("p.woo", "  span#yes", "    strong.no.yes", "      i");
    integration_assertions.compilesTo(emblem, "<p class=\"woo\"><span id=\"yes\"><strong class=\"no yes\"><i></i></strong></span></p>");
  });

  QUnit.module("html: self-closing html tags");

  test("br", function () {
    var emblem;
    emblem = "br";
    integration_assertions.compilesTo(emblem, "<br>");
  });

  test("hr", function (assert) {
    var emblem;
    emblem = "hr";
    integration_assertions.compilesTo(emblem, "<hr>");
  });

  test("br paragraph example", function () {
    var emblem;
    emblem = "p\n  | LOL!\n  br\n  | BORF!";
    integration_assertions.compilesTo(emblem, "<p>LOL!<br>BORF!</p>");
  });

  test("input", function () {
    var emblem;
    emblem = "input type=\"text\"";
    integration_assertions.compilesTo(emblem, "<input type=\"text\">");
  });

  test("nested content under self-closing tag should fail", function () {
    var emblem = "hr\n | here is text";
    QUnit.throws(function () {
      Emblem['default'].compile(emblem);
    }, /cannot nest/i);
  });

});
define('integration/mustaches-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("mustache: simple");

  test("various one-liners", function () {
    var emblem = utils.w("= foo", "arf", "p = foo", "span.foo", "p data-foo=\"yes\" = goo");
    integration_assertions.compilesTo(emblem, "{{foo}}{{arf}}<p>{{foo}}</p><span class=\"foo\"></span><p data-foo=\"yes\">{{goo}}</p>");
  });


  test("double =='s un-escape", function () {
    var emblem = utils.w("== foo", "foo", "p == foo");
    integration_assertions.compilesTo(emblem, "{{{foo}}}{{foo}}<p>{{{foo}}}</p>");
  });

  test("nested combo syntax", function () {
    var emblem = utils.w("ul = each items", "  li = foo");
    integration_assertions.compilesTo(emblem, "<ul>{{#each items}}<li>{{foo}}</li>{{/each}}</ul>");
  });

  QUnit.module("mustache: block params");

  test("anything after 'as' goes in block params", function () {
    var emblem = utils.w("= each foos as |foo|");
    integration_assertions.compilesTo(emblem, "{{each foos as |foo|}}");
  });

  test("spaces between '||' and params are removed", function () {
    integration_assertions.compilesTo("= each foos as |foo|", "{{each foos as |foo|}}");
    integration_assertions.compilesTo("= each foos as | foo |", "{{each foos as |foo|}}");
  });

  test("multiple words work too", function () {
    var emblem = utils.w("= my-helper as |foo bar|");
    integration_assertions.compilesTo(emblem, "{{my-helper as |foo bar|}}");
  });

  test("block form works for the 'with' helper", function () {
    var emblem = utils.w("= with car.manufacturer as |make|", "  p {{make.name}}");
    integration_assertions.compilesTo(emblem, "{{#with car.manufacturer as |make|}}<p>{{make.name}}</p>{{/with}}");
  });

  test("block form works for components", function () {
    var emblem = utils.w("= my-component as |item|", "  p {{item.name}}");
    integration_assertions.compilesTo(emblem, "{{#my-component as |item|}}<p>{{item.name}}</p>{{/my-component}}");
  });

  QUnit.module("mustache: capitalized line-starter");

  test("should invoke `view` helper by default", function () {
    var emblem = utils.w("SomeView");
    integration_assertions.compilesTo(emblem, "{{view SomeView}}");
  });

  test("should support block mode", function () {
    var emblem = utils.w("SomeView", "  p View content");
    integration_assertions.compilesTo(emblem, "{{#view SomeView}}<p>View content</p>{{/view}}");
  });

  test("should not kick in if preceded by equal sign", function () {
    var emblem = utils.w("= SomeView");
    integration_assertions.compilesTo(emblem, "{{SomeView}}");
  });

  test("should not kick in explicit {{mustache}}", function () {
    var emblem = utils.w("p Yeah {{SomeView}}");
    integration_assertions.compilesTo(emblem, "<p>Yeah {{SomeView}}</p>");
  });

  QUnit.module("mustache: lower-case starting string");

  test("recognizes double-quoted attrs", function () {
    var emblem = "frank text=\"yes\"";
    integration_assertions.compilesTo(emblem, "{{frank text=\"yes\"}}");
  });

  test("recognizes single-quoted attrs", function () {
    var emblem = "frank text='yes'";
    integration_assertions.compilesTo(emblem, "{{frank text='yes'}}");
  });

  test("recognizes unquoted attrs", function () {
    var emblem = "frank foo=bar";
    integration_assertions.compilesTo(emblem, "{{frank foo=bar}}");
  });

  test("sub-expressions are ok", function () {
    var emblem = "\n    = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName=\"li\"\n  ";
    integration_assertions.compilesTo(emblem, "{{link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName=\"li\"}}");
  });

  test("percent sign in quoted attr value", function () {
    var emblem = "\n      = input placeholder=\"100%\"\n  ";
    integration_assertions.compilesTo(emblem, "{{input placeholder=\"100%\"}}");
  });

  test("colon and semicolon in quoted attr value", function () {
    var emblem = "\n      = input style=\"outline:blue; color:red\"\n  ";
    integration_assertions.compilesTo(emblem, "{{input style=\"outline:blue; color:red\"}}");
  });

  QUnit.module("mustache: raw mustache unescaped");
  // _ Bork {{foo}} {{{bar}}}!

  test("triple mustache in text line", function () {
    var emblem = "| bork {{{bar}}}";
    integration_assertions.compilesTo(emblem, "bork {{{bar}}}");
  });

  test("double mustache in text line", function () {
    var emblem = "| bork {{bar}}";
    integration_assertions.compilesTo(emblem, "bork {{bar}}");
  });

  test("hash stache in text line", function () {
    var emblem = "| bork #{bar}";
    integration_assertions.compilesTo(emblem, "bork {{bar}}");
  });

  QUnit.module("mustache: hash brace syntax, #{}");

  test("acts like {{}}", function () {
    var emblem = "span Yo #{foo}, I herd.";
    integration_assertions.compilesTo(emblem, "<span>Yo {{foo}}, I herd.</span>");
  });

  test("can start inline content", function () {
    var emblem = "span #{foo}, I herd.";
    integration_assertions.compilesTo(emblem, "<span>{{foo}}, I herd.</span>");
  });

  test("can end inline content", function () {
    var emblem = "span I herd #{foo}";
    integration_assertions.compilesTo(emblem, "<span>I herd {{foo}}</span>");
  });

  test("doesn't screw up parsing when # used in text nodes", function () {
    var emblem = "span OMG #YOLO";
    integration_assertions.compilesTo(emblem, "<span>OMG #YOLO</span>");
  });

  test("# can be only thing on line", function () {
    var emblem = "span #";
    integration_assertions.compilesTo(emblem, "<span>#</span>");
  });

  test("brace works with text pipe", function () {
    var emblem = "= link-to 'users.view' user | View user #{ user.name } #{ user.id }";
    integration_assertions.compilesTo(emblem, "{{#link-to 'users.view' user}}View user {{user.name }} {{user.id }}{{/link-to}}");
  });


  QUnit.module("mustache: inline block helper");

  test("text only", function () {
    var emblem;
    emblem = "view SomeView | Hello";
    integration_assertions.compilesTo(emblem, "{{#view SomeView}}Hello{{/view}}");
  });

  test("multiline", function () {
    var emblem;
    emblem = utils.w("view SomeView | Hello,", "  How are you?", "  Sup?");
    integration_assertions.compilesTo(emblem, "{{#view SomeView}}Hello, How are you? Sup?{{/view}}");
  });

  test("more complicated", function () {
    var emblem;
    emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";
    integration_assertions.compilesTo(emblem, "{{#view SomeView borf=\"yes\"}}Hello, How are you? Sup?{{/view}}");
  });

  test("GH-26: no need for space before equal sign", function () {
    var emblem;
    emblem = "span= foo";
    integration_assertions.compilesTo(emblem, "<span>{{foo}}</span>");
    emblem = "span.foo= foo";
    integration_assertions.compilesTo(emblem, "<span class=\"foo\">{{foo}}</span>");
    emblem = "span#hooray.foo= foo";
    integration_assertions.compilesTo(emblem, "<span id=\"hooray\" class=\"foo\">{{foo}}</span>");
    emblem = "#hooray= foo";
    integration_assertions.compilesTo(emblem, "<div id=\"hooray\">{{foo}}</div>");
    emblem = ".hooray= foo";
    return integration_assertions.compilesTo(emblem, "<div class=\"hooray\">{{foo}}</div>");
  });

  QUnit.module("mustache: in-tag explicit mustache");

  test("single", function () {
    return integration_assertions.compilesTo("p{inTagHelper foo}", "<p {{inTagHelper foo}}></p>");
  });

  test("double", function () {
    return integration_assertions.compilesTo("p{{inTagHelper foo}}", "<p {{inTagHelper foo}}></p>");
  });

  test("triple", function () {
    return integration_assertions.compilesTo("p{{{inTagHelper foo}}}", "<p {{{inTagHelper foo}}}></p>");
  });

  test("with singlestache", function () {
    return integration_assertions.compilesTo("p{insertClass foo} Hello", "<p {{insertClass foo}}>Hello</p>");
  });

  test("singlestache can be used in text nodes", function () {
    return integration_assertions.compilesTo("p Hello {dork}", "<p>Hello {dork}</p>");
  });

  test("with doublestache", function () {
    return integration_assertions.compilesTo("p{{insertClass foo}} Hello", "<p {{insertClass foo}}>Hello</p>");
  });

  test("with triplestache", function () {
    return integration_assertions.compilesTo("p{{{insertClass foo}}} Hello", "<p {{{insertClass foo}}}>Hello</p>");
  });

  test("multiple", function () {
    return integration_assertions.compilesTo("p{{{insertClass foo}}}{{{insertClass boo}}} Hello", "<p {{{insertClass foo}}} {{{insertClass boo}}}>Hello</p>");
  });

  test("with nesting", function () {
    var emblem;
    emblem = "p{{bind-attr class=\"foo\"}}\n  span Hello";
    return integration_assertions.compilesTo(emblem, "<p {{bind-attr class=\"foo\"}}><span>Hello</span></p>");
  });

  test("more nesting", function () {
    var emblem = utils.w("", "sally", "  p Hello");
    integration_assertions.compilesTo(emblem, "{{#sally}}<p>Hello</p>{{/sally}}");
  });

  test("recursive nesting", function () {
    var emblem = utils.w("", "sally", "  sally", "    p Hello");
    integration_assertions.compilesTo(emblem, "{{#sally}}{{#sally}}<p>Hello</p>{{/sally}}{{/sally}}");
  });

  test("recursive nesting part 2", function () {
    var emblem = utils.w("", "sally", "  sally thing", "    p Hello");
    integration_assertions.compilesTo(emblem, "{{#sally}}{{#sally thing}}<p>Hello</p>{{/sally}}{{/sally}}");
  });

  test("use of \"this\"", function () {
    var emblem = utils.w("", "each foo", "  p = this", "  this");
    integration_assertions.compilesTo(emblem, "{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}");
  });

  test("mustache attr with underscore", function () {
    var emblem = "input placeholder=cat_name";
    integration_assertions.compilesTo(emblem, "<input placeholder={{cat_name}}>");
  });

  test("mustache with empty attr value (single-quoted string)", function () {
    var emblem = "= input placeholder=''";
    integration_assertions.compilesTo(emblem, "{{input placeholder=''}}");
  });

  test("mustache with empty attr value (double-quoted string)", function () {
    var emblem = "= input placeholder=\"\"";
    integration_assertions.compilesTo(emblem, "{{input placeholder=\"\"}}");
  });

  test("explicit mustache with \"/\" in name", function () {
    var emblem = "= navigation/button-list";
    integration_assertions.compilesTo(emblem, "{{navigation/button-list}}");
  });

  test("bracketed nested statement", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\" ]", "  | Bracketed helper attrs!");
    integration_assertions.compilesTo(emblem, "{{#sally 'foo' something=\"false\"}}Bracketed helper attrs!{{/sally}}");
  });

  test("bracketed nested block params with block", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\" ]", "  p Bracketed helper attrs!");
    integration_assertions.compilesTo(emblem, "{{#sally 'foo' something=\"false\"}}<p>Bracketed helper attrs!</p>{{/sally}}");
  });

  test("bracketed nested block params", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\" ] as |foo|");
    integration_assertions.compilesTo(emblem, "{{sally 'foo' something=\"false\" as |foo|}}");
  });

  test("bracketed with block params and block", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\" ] as |foo|", "  p = foo");
    integration_assertions.compilesTo(emblem, "{{#sally 'foo' something=\"false\" as |foo|}}<p>{{foo}}</p>{{/sally}}");
  });

  test("bracketed with close on newline and with block", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\"", "]", "  p = foo");
    integration_assertions.compilesTo(emblem, "{{#sally 'foo' something=\"false\"}}<p>{{foo}}</p>{{/sally}}");
  });

  test("bracketed with close on newline, with block params and block", function () {
    var emblem = utils.w("", "sally [", "  'foo'", "  something=\"false\"", "] as |foo|", "  p = foo");
    integration_assertions.compilesTo(emblem, "{{#sally 'foo' something=\"false\" as |foo|}}<p>{{foo}}</p>{{/sally}}");
  });

  test("bracketed action attribute", function () {
    var emblem = utils.w("", "button [", "  click=\"doSomething\" ]", "  | click here");
    integration_assertions.compilesTo(emblem, "<button {{action \"doSomething\" on=\"click\"}}>click here</button>");
  });

  test("single-line mustaches can have elements right after", function () {
    var emblem = utils.w("div", "  = thing", "  div" // significantly, this has no return character
    );
    integration_assertions.compilesTo(emblem, "<div>{{thing}}<div></div></div>");
  });

  test("several bracketed attributes with closing bracket on final line", function () {
    var emblem = utils.w("= asdf-asdf [", "  thing=res1", "  thi2ng='res2'", "  otherThing=res3", "]");
    return integration_assertions.compilesTo(emblem, "{{asdf-asdf thing=res1 thi2ng='res2' otherThing=res3}}");
  });

  test("several bracketed attributes without a block", function () {
    var emblem = utils.w("= asdf-asdf [", "  thing=res1", "  thi2ng='res2'", "  otherThing=res3", "]", "p Hi there");
    return integration_assertions.compilesTo(emblem, "{{asdf-asdf thing=res1 thi2ng='res2' otherThing=res3}}<p>Hi there</p>");
  });

  test("several brackets with closing bracket on final line with a view", function () {
    var emblem = utils.w("Ember.Select [", "  thing=res1", "  thi2ng='res2'", "  otherThing=\"res3\"", "]");
    return integration_assertions.compilesTo(emblem, "{{view Ember.Select thing=res1 thi2ng='res2' otherThing=\"res3\"}}");
  });

  test("single-line mustaches can have array indexes", function () {
    var emblem = utils.w("my-component value=child.[0]");
    integration_assertions.compilesTo(emblem, "{{my-component value=child.[0]}}");
  });

  test("single-line mustaches can have array indexes with bound indexes (not supported by Ember)", function () {
    var emblem = utils.w("my-component value=child.[someIndex]");
    integration_assertions.compilesTo(emblem, "{{my-component value=child.[someIndex]}}");
  });

  test("multi-line mustaches can have array indexes with blocks", function () {
    var emblem = utils.w("my-component [", "  value=child.[0] ]", "  | Thing");
    integration_assertions.compilesTo(emblem, "{{#my-component value=child.[0]}}Thing{{/my-component}}");
  });

  test("mustaches with else statement", function () {
    var emblem = utils.w("some-component-with-inverse-yield", "  |foo", "else", "  |bar");
    integration_assertions.compilesTo(emblem, "{{#some-component-with-inverse-yield}}foo{{else}}bar{{/some-component-with-inverse-yield}}");
  });

  test("mustaches with blocks and comments", function () {
    var emblem = utils.w("/ Hi", "= if foo", "  p Hi", "/ Bye", "= else if bar", "  p bye");
    integration_assertions.compilesTo(emblem, "{{#if foo}}<p>Hi</p>{{else if bar}}<p>bye</p>{{/if}}");
  });

});
define('integration/preprocessor-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("preprocessor");

  QUnit.test("it strips out preceding whitespace", function () {
    var emblem = utils.w("", "p Hello");
    integration_assertions.compilesTo(emblem, "<p>Hello</p>");
  });

  QUnit.test("it handles preceding indentation", function () {
    var emblem = utils.w("  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

  QUnit.test("it handles preceding indentation and newlines", function () {
    var emblem = utils.w("", "  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

  QUnit.test("it handles preceding indentation and newlines pt 2", function () {
    var emblem = utils.w("  ", "  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

});
define('integration/subexpressions-test', ['support/integration-assertions'], function (integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("subexpressions");

  /*
  Handlebars.registerHelper('echo', function(param) {
    return "ECHO " + param;
  });

  Handlebars.registerHelper('echofun', function() {
    var options;
    options = Array.prototype.pop.call(arguments);
    return "FUN = " + options.hash.fun;
  });

  Handlebars.registerHelper('hello', function(param) {
    return "hello";
  });

  Handlebars.registerHelper('equal', function(x, y) {
    return x === y;
  });
  */

  test("arg-less helper", function () {
    var emblem = "p {{echo (hello)}}";
    integration_assertions.compilesTo(emblem, "<p>{{echo (hello)}}</p>");

    emblem = "= echo (hello)";
    integration_assertions.compilesTo(emblem, "{{echo (hello)}}");
  });

  test("helper w args", function () {
    var emblem = "p {{echo (equal 1 1)}}";
    integration_assertions.compilesTo(emblem, "<p>{{echo (equal 1 1)}}</p>");

    emblem = "= echo (equal 1 1)";
    integration_assertions.compilesTo(emblem, "{{echo (equal 1 1)}}");
  });

  test("supports much nesting", function () {
    var emblem = "p {{echo (equal (equal 1 1) true)}}";
    integration_assertions.compilesTo(emblem, "<p>{{echo (equal (equal 1 1) true)}}</p>");
    emblem = "= echo (equal (equal 1 1) true)";
    integration_assertions.compilesTo(emblem, "{{echo (equal (equal 1 1) true)}}");
  });

  test("with hashes", function () {
    var emblem = "p {{echo (equal (equal 1 1) true fun=\"yes\")}}";
    integration_assertions.compilesTo(emblem, "<p>{{echo (equal (equal 1 1) true fun=\"yes\")}}</p>");
    emblem = "= echo (equal (equal 1 1) true fun=\"yes\")";
    integration_assertions.compilesTo(emblem, "{{echo (equal (equal 1 1) true fun=\"yes\")}}");
  });

  test("with multiple", function () {
    var emblem = "if (and (or true true) true)";
    integration_assertions.compilesTo(emblem, "{{if (and (or true true) true)}}");
  });

  test("with multiple p2", function () {
    var emblem = "if (and (or true true) (or true true))";
    integration_assertions.compilesTo(emblem, "{{if (and (or true true) (or true true))}}");
  });

  test("as hashes", function () {
    var emblem = "p {{echofun fun=(equal 1 1)}}";
    integration_assertions.compilesTo(emblem, "<p>{{echofun fun=(equal 1 1)}}</p>");

    emblem = "= echofun fun=(equal 1 1)";
    integration_assertions.compilesTo(emblem, "{{echofun fun=(equal 1 1)}}");
  });

  test("complex expression", function () {
    var emblem = "p {{echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"}}";
    integration_assertions.compilesTo(emblem, "<p>{{echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"}}</p>");

    emblem = "= echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"";
    var expected = "{{echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"}}";
    integration_assertions.compilesTo(emblem, expected);
  });

});
define('integration/syntax-helpers-test', ['support/utils', 'support/integration-assertions'], function (utils, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("syntax helpers: bang syntax");

  test("simple bang helper defaults to `unbound` invocation", function () {
    var emblem;
    emblem = utils.w("foo!");
    integration_assertions.compilesTo(emblem, "{{unbound foo}}");
  });

  test("bang helper defaults to `unbound` invocation", function () {
    var emblem;
    emblem = utils.w("foo! Yar", "= foo!");
    integration_assertions.compilesTo(emblem, "{{unbound foo Yar}}{{unbound foo}}");
  });

  test("bang helper works with blocks", function () {
    var emblem;
    emblem = utils.w("hey! you suck", "  = foo!");
    integration_assertions.compilesTo(emblem, "{{#unbound hey you suck}}{{unbound foo}}{{/unbound}}");
  });

  QUnit.module("syntax helpers: question mark");

  test("? helper defaults to `if` invocation", function () {
    var emblem;
    emblem = "foo?\n  p Yeah";
    return integration_assertions.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{/if}}");
  });

  test("else works", function () {
    var emblem;
    emblem = "foo?\n  p Yeah\nelse\n  p No";
    return integration_assertions.compilesTo(emblem, "{{#if foo}}<p>Yeah</p>{{else}}<p>No</p>{{/if}}");
  });

  test("compound with text", function () {
    var emblem;
    emblem = utils.w("p = foo? ", "  | Hooray", "else", "  | No", "p = bar? ", "  | Hooray", "else", "  | No");
    return integration_assertions.compilesTo(emblem, "<p>{{#if foo}}Hooray{{else}}No{{/if}}</p>" + "<p>{{#if bar}}Hooray{{else}}No{{/if}}</p>");
  });

  test("compound with variables", function () {
    var emblem;
    emblem = utils.w("p = foo? ", "  bar", "else", "  baz");
    return integration_assertions.compilesTo(emblem, "<p>{{#if foo}}{{bar}}{{else}}{{baz}}{{/if}}</p>");
  });

});
define('integration/text-line-test', ['support/utils', 'emblem', 'support/integration-assertions'], function (utils, Emblem, integration_assertions) {

  'use strict';

  /*global QUnit*/

  var runTextLineSuite;

  /*
    Default plaintext format
   */

  QUnit.module("text lines: starting with '|'");

  test("basic", function () {
    integration_assertions.compilesTo("| What what", "What what");
  });

  test("with html", function () {
    integration_assertions.compilesTo("| What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!", "What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!");
  });

  test("multiline", function () {
    var emblem;
    emblem = "| Blork\n  Snork";
    integration_assertions.compilesTo(emblem, "Blork Snork");
  });

  test("triple multiline", function () {
    var emblem;
    emblem = "| Blork\n  Snork\n  Bork";
    integration_assertions.compilesTo(emblem, "Blork Snork Bork");
  });

  test("quadruple multiline", function () {
    var emblem;
    emblem = "| Blork\n  Snork\n  Bork\n  Fork";
    integration_assertions.compilesTo(emblem, "Blork Snork Bork Fork");
  });

  test("multiline w/ trailing whitespace", function () {
    var emblem;
    emblem = "| Blork \n  Snork";
    integration_assertions.compilesTo(emblem, "Blork  Snork");
  });

  test("secondline", function () {
    var emblem;
    emblem = "|\n  Good";
    integration_assertions.compilesTo(emblem, "Good");
  });

  test("secondline multiline", function () {
    var emblem;
    emblem = "| \n  Good\n  Bork";
    integration_assertions.compilesTo(emblem, "Good Bork");
  });

  test("with a mustache", function () {
    var emblem;
    emblem = "| Bork {{foo}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}}!");
  });

  test("with mustaches", function () {
    var emblem;
    emblem = "| Bork {{foo}} {{{bar}}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}} {{{bar}}}!");
  });

  test("on each line", function () {
    var emblem;
    emblem = "\n  pre\n    | This\n    |   should\n    |  hopefully\n    |    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre>This  should hopefully   work, and work well.</pre>");
  });

  test("with blank", function () {
    var emblem;
    emblem = "\n  pre\n    | This\n    |   should\n    |\n    |  hopefully\n    |    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre>This  should hopefully   work, and work well.</pre>");
  });

  /*
    Add a newline after formatting the plaintext
   */

  QUnit.module("text lines: starting with '`' -- backtick ADDS a trailing newline");

  test("basic", function () {
    integration_assertions.compilesTo("` What what", "What what\n");
  });

  test("with html", function () {
    integration_assertions.compilesTo("` What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!", "What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!\n");
  });

  test("multiline", function () {
    var emblem;
    emblem = utils.w("` Blork", "  Snork");
    integration_assertions.compilesTo(emblem, "Blork Snork\n");
  });

  test("triple multiline", function () {
    var emblem;
    emblem = utils.w("` Blork", "  Snork", "  Bork");
    integration_assertions.compilesTo(emblem, "Blork Snork Bork\n");
  });

  test("quadruple multiline", function () {
    var emblem;
    emblem = utils.w("` Blork", "  Snork", "  Bork", "  Fork");
    integration_assertions.compilesTo(emblem, "Blork Snork Bork Fork\n");
  });

  test("multiline w/ trailing whitespace", function () {
    var emblem;
    emblem = utils.w("` Blork ", "  Snork");
    integration_assertions.compilesTo(emblem, "Blork  Snork\n");
  });

  test("secondline", function () {
    var emblem;
    emblem = utils.w("`", "  Good");
    integration_assertions.compilesTo(emblem, "Good\n");
  });

  test("secondline multiline", function () {
    var emblem;
    emblem = utils.w("` ", "  Good", "  Bork");
    integration_assertions.compilesTo(emblem, "Good Bork\n");
  });

  test("with a mustache", function () {
    var emblem;
    emblem = "` Bork {{foo}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}}!\n");
  });

  test("with mustaches", function () {
    var emblem;
    emblem = "` Bork {{foo}} {{{bar}}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}} {{{bar}}}!\n");
  });

  test("on each line", function () {
    var emblem;
    emblem = "\n  pre\n    ` This\n    `   should\n    `  hopefully\n    `    work, and work well.";
    var expected = "<pre>This\n  should\n hopefully\n   work, and work well.\n</pre>";
    integration_assertions.compilesTo(emblem, expected);
  });

  test("with blank", function () {
    var emblem;
    emblem = "\n  pre\n    ` This\n    `   should\n    `\n    `  hopefully\n    `    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre>This\n  should\n\n hopefully\n   work, and work well.\n</pre>");
  });

  /*
    Add an extra space after
   */

  QUnit.module("text lines: starting with \"'\" should add an extra space");

  test("basic", function () {
    integration_assertions.compilesTo("' What what", "What what ");
  });

  test("with html", function () {
    integration_assertions.compilesTo("' What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!", "What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>! ");
  });

  test("multiline", function () {
    var emblem;
    emblem = "' Blork\n              Snork";
    integration_assertions.compilesTo(emblem, "Blork Snork ");
  });

  test("triple multiline", function () {
    var emblem;
    emblem = "' Blork\n              Snork\n              Bork";
    integration_assertions.compilesTo(emblem, "Blork Snork Bork ");
  });

  test("quadruple multiline", function () {
    var emblem;
    emblem = "' Blork\n              Snork\n              Bork\n              Fork";
    integration_assertions.compilesTo(emblem, "Blork Snork Bork Fork ");
  });

  test("multiline w/ trailing whitespace", function () {
    var emblem;
    emblem = "' Blork \n              Snork";
    integration_assertions.compilesTo(emblem, "Blork  Snork ");
  });

  test("secondline", function () {
    var emblem;
    emblem = "'\n  Good";
    integration_assertions.compilesTo(emblem, "Good ");
  });

  test("secondline multiline", function () {
    var emblem;
    emblem = "' \n  Good\n  Bork";
    integration_assertions.compilesTo(emblem, "Good Bork ");
  });

  test("with a mustache", function () {
    var emblem;
    emblem = "' Bork {{foo}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}}! ");
  });

  test("with mustaches", function () {
    var emblem;
    emblem = "' Bork {{foo}} {{{bar}}}!";
    integration_assertions.compilesTo(emblem, "Bork {{foo}} {{{bar}}}! ");
  });

  test("on each line", function () {
    var emblem;
    emblem = "\n  pre\n    ' This\n    '   should\n    '  hopefully\n    '    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre>This   should  hopefully    work, and work well. </pre>");
  });

  test("with blank", function () {
    var emblem;
    emblem = "\n  pre\n    ' This\n    '   should\n    '\n    '  hopefully\n    '    work, and work well.";
    var expected = "<pre>This   should   hopefully    work, and work well. </pre>";
    integration_assertions.compilesTo(emblem, expected);
  });

  /*
    Add an extra space before
   */

  QUnit.module("text lines: starting with \"+\" should add an extra space before");

  test("basic", function () {
    integration_assertions.compilesTo("+ What what", " What what");
  });

  test("with html", function () {
    integration_assertions.compilesTo("+ What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!", " What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!");
  });

  test("multiline", function () {
    var emblem;
    emblem = "+ Blork\n  Snork";
    integration_assertions.compilesTo(emblem, " Blork Snork");
  });

  test("triple multiline", function () {
    var emblem;
    emblem = "+ Blork\n  Snork\n  Bork";
    integration_assertions.compilesTo(emblem, " Blork Snork Bork");
  });

  test("quadruple multiline", function () {
    var emblem;
    emblem = "+ Blork\n  Snork\n  Bork\n  Fork";
    integration_assertions.compilesTo(emblem, " Blork Snork Bork Fork");
  });

  test("multiline w/ trailing whitespace", function () {
    var emblem;
    emblem = "+ Blork\n  Snork";
    integration_assertions.compilesTo(emblem, " Blork Snork");
  });

  test("secondline", function () {
    var emblem;
    emblem = "+\n  Good";
    integration_assertions.compilesTo(emblem, " Good");
  });

  test("secondline multiline", function () {
    var emblem;
    emblem = "+ \n  Good\n  Bork";
    integration_assertions.compilesTo(emblem, " Good Bork");
  });

  test("with a mustache", function () {
    var emblem;
    emblem = "+ Bork {{foo}}!";
    integration_assertions.compilesTo(emblem, " Bork {{foo}}!");
  });

  test("with mustaches", function () {
    var emblem;
    emblem = "+ Bork {{foo}} {{{bar}}}!";
    integration_assertions.compilesTo(emblem, " Bork {{foo}} {{{bar}}}!");
  });

  test("on each line", function () {
    var emblem;
    emblem = "\n  pre\n    + This\n    +   should\n    +  hopefully\n    +    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre> This   should  hopefully    work, and work well.</pre>");
  });

  test("with blank", function () {
    var emblem;
    emblem = "\n  pre\n    + This\n    +   should\n    +\n    +  hopefully\n    +    work, and work well.";
    var expected = "<pre> This   should   hopefully    work, and work well.</pre>";
    integration_assertions.compilesTo(emblem, expected);
  });

  /*
   Add an extra space before and after
   */

  QUnit.module("text lines: starting with \"\"\" should add an extra space before and after");

  test("basic", function () {
    var emblem;
    emblem = "\" What what";
    integration_assertions.compilesTo(emblem, " What what ");
  });

  test("with html", function () {
    integration_assertions.compilesTo("\" What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>!", " What <span id=\"woot\" data-t=\"oof\" class=\"f\">what</span>! ");
  });

  test("multiline", function () {
    var emblem;
    emblem = "\" Blork\n  Snork";
    integration_assertions.compilesTo(emblem, " Blork Snork ");
  });

  test("triple multiline", function () {
    var emblem;
    emblem = "\" Blork\n  Snork\n  Bork";
    integration_assertions.compilesTo(emblem, " Blork Snork Bork ");
  });

  test("quadruple multiline", function () {
    var emblem;
    emblem = "\" Blork\n  Snork\n  Bork\n  Fork";
    integration_assertions.compilesTo(emblem, " Blork Snork Bork Fork ");
  });

  test("multiline w/ trailing whitespace", function () {
    var emblem;
    emblem = "\" Blork\n  Snork";
    integration_assertions.compilesTo(emblem, " Blork Snork ");
  });

  test("secondline", function () {
    var emblem;
    emblem = "\"\n  Good";
    integration_assertions.compilesTo(emblem, " Good ");
  });

  test("secondline multiline", function () {
    var emblem;
    emblem = "\"\n  Good\n  Bork";
    integration_assertions.compilesTo(emblem, " Good Bork ");
  });

  test("with a mustache", function () {
    var emblem;
    emblem = "\" Bork {{foo}}!";
    integration_assertions.compilesTo(emblem, " Bork {{foo}}! ");
  });

  test("with mustaches", function () {
    var emblem;
    emblem = "\" Bork {{foo}} {{{bar}}}!";
    integration_assertions.compilesTo(emblem, " Bork {{foo}} {{{bar}}}! ");
  });

  test("on each line", function () {
    var emblem;
    emblem = "\n  pre\n    \" This\n    \"   should\n    \"  hopefully\n    \"    work, and work well.";
    integration_assertions.compilesTo(emblem, "<pre> This    should   hopefully     work, and work well. </pre>");
  });

  test("with blank", function () {
    var emblem;
    emblem = "\n  pre\n   \" This\n   \"   should\n   \"\n   \"  hopefully\n   \"    work, and work well.";
    var expected = "<pre> This    should     hopefully     work, and work well. </pre>";
    integration_assertions.compilesTo(emblem, expected);
  });

});
define('integration/text-test', ['support/utils', 'emblem', 'support/integration-assertions'], function (utils, Emblem, integration_assertions) {

  'use strict';

  /*global QUnit*/

  QUnit.module("text: pipe character");

  test("pipe (|) creates text", function () {
    integration_assertions.compilesTo("| hello there", "hello there");
  });

  test("pipe (|) multiline creates text", function () {
    integration_assertions.compilesTo(utils.w("| hello there", "   and more"), "hello there and more");
  });

  test("pipe lines preserves leading spaces", function () {
    var fourSpaces = "    ";
    var threeSpaces = "   ";
    integration_assertions.compilesTo("|" + fourSpaces + "hello there", threeSpaces + "hello there");
  });

  test("multiple pipe lines are concatenated", function () {
    integration_assertions.compilesTo(utils.w("| hi there", "| and more"), "hi thereand more");
  });

  QUnit.module("text: whitespace fussiness");

  test("spaces after html elements", function () {
    integration_assertions.compilesTo("p \n  span asd", "<p><span>asd</span></p>");
    integration_assertions.compilesTo("p \nspan  \n\ndiv\nspan", "<p></p><span></span><div></div><span></span>");
  });

  test("spaces after mustaches", function () {
    integration_assertions.compilesTo("each foo    \n  p \n  span", "{{#each foo}}<p></p><span></span>{{/each}}");
  });

  QUnit.module("text: preprocessor");

  QUnit.test("it strips out preceding whitespace", function () {
    var emblem = utils.w("", "p Hello");
    integration_assertions.compilesTo(emblem, "<p>Hello</p>");
  });

  QUnit.test("it handles preceding indentation", function () {
    var emblem = utils.w("  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

  QUnit.test("it handles preceding indentation and newlines", function () {
    var emblem = utils.w("", "  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

  QUnit.test("it handles preceding indentation and newlines pt 2", function () {
    var emblem = utils.w("  ", "  p Woot", "  p Ha");
    integration_assertions.compilesTo(emblem, "<p>Woot</p><p>Ha</p>");
  });

  test("multiple text lines", function () {
    var emblem = "\n     span Your name is name\n       and my name is name";
    integration_assertions.compilesTo(emblem, "<span>Your name is name and my name is name</span>");
  });

  test("use an \"'\" to add a space", function () {
    var emblem = "span\n                 ' trailing space";
    integration_assertions.compilesTo(emblem, "<span>trailing space </span>");
  });

  QUnit.module("text: copy paste html");

  test("indented", function () {
    var emblem;
    emblem = utils.w("<p>", "  <span>This be some text</span>", "  <title>Basic HTML Sample Page</title>", "</p>");
    integration_assertions.compilesTo(emblem, "<p> <span>This be some text</span> <title>Basic HTML Sample Page</title></p>");
  });

  test("flatlina", function () {
    var emblem;
    emblem = "<p>\n<span>This be some text</span>\n<title>Basic HTML Sample Page</title>\n</p>";
    integration_assertions.compilesTo(emblem, "<p><span>This be some text</span><title>Basic HTML Sample Page</title></p>");
  });

  QUnit.module("text: indentation");

  test("it doesn't throw when indenting after a line with inline content", function () {
    var emblem = utils.w("p Hello", "  p invalid");
    integration_assertions.compilesTo(emblem, "<p>Hello p invalid</p>");
  });

  test("it throws on half dedent", function () {
    var emblem = utils.w("p", "    span This is ok", "  span This aint");
    QUnit.throws(function () {
      Emblem['default'].compile(emblem);
    });
  });

  test("new indentation levels don't have to match parents'", function () {
    var emblem = utils.w("p ", "  span", "     div", "      span yes");
    integration_assertions.compilesTo(emblem, "<p><span><div><span>yes</span></div></span></p>");
  });

  test("Windows line endings", function () {
    var emblem;
    emblem = ".navigation\r\n  p Hello\r\n#main\r\n  | hi";
    integration_assertions.compilesTo(emblem, "<div class=\"navigation\"><p>Hello</p></div><div id=\"main\">hi</div>");
  });

  test("backslash doesn't cause infinite loop", function () {
    var emblem;
    emblem = "| \\";
    integration_assertions.compilesTo(emblem, "\\");
  });

  test("backslash doesn't cause infinite loop with letter", function () {
    var emblem;
    emblem = "| \\a";
    integration_assertions.compilesTo(emblem, "\\a");
  });

  test("self closing tag with forward slash", function () {
    var emblem = "hr/";
    integration_assertions.compilesTo(emblem, "<hr>");

    // non-void elements are still closed correctly
    emblem = "p/";
    integration_assertions.compilesTo(emblem, "<p></p>");
  });

  test("tagnames and attributes with colons", function () {
    var emblem;
    emblem = "%al:ex match:neer=\"snork\" Hello!";
    integration_assertions.compilesTo(emblem, "<al:ex match:neer=\"snork\">Hello!</al:ex>");
  });

  test("windows newlines", function () {
    var emblem;
    emblem = "\r\n  \r\n  p Hello\r\n\r\n";
    integration_assertions.compilesTo(emblem, "<p>Hello</p>");
  });

  QUnit.module("text: EOL Whitespace");

  test("shouldn't be necessary to insert a space", function () {
    var emblem;
    emblem = "p Hello,\n  How are you?\np I'm fine, thank you.";
    integration_assertions.compilesTo(emblem, "<p>Hello, How are you?</p><p>I'm fine, thank you.</p>");
  });

  QUnit.module("text: indent/predent");

  test("mixture", function () {
    var emblem;
    emblem = "        \n";
    emblem += "  p Hello\n";
    emblem += "  p\n";
    emblem += "    | Woot\n";
    emblem += "  span yes\n";
    return integration_assertions.compilesTo(emblem, "<p>Hello</p><p>Woot</p><span>yes</span>");
  });

  test("mixture w/o opening blank", function () {
    var emblem;
    emblem = "  p Hello\n";
    emblem += "  p\n";
    emblem += "    | Woot\n";
    emblem += "  span yes\n";
    return integration_assertions.compilesTo(emblem, "<p>Hello</p><p>Woot</p><span>yes</span>");
  });

  test("w/ blank lines", function () {
    var emblem;
    emblem = "  p Hello\n";
    emblem += "  p\n";
    emblem += "\n";
    emblem += "    | Woot\n";
    emblem += "\n";
    emblem += "  span yes\n";
    return integration_assertions.compilesTo(emblem, "<p>Hello</p><p>Woot</p><span>yes</span>");
  });

  test("w/ blank whitespaced lines", function () {
    var emblem;
    emblem = "  p Hello\n";
    emblem += "  p\n";
    emblem += "\n";
    emblem += "    | Woot\n";
    emblem += "        \n";
    emblem += "       \n";
    emblem += "         \n";
    emblem += "\n";
    emblem += "  span yes\n";
    emblem += "\n";
    emblem += "  sally\n";
    emblem += "\n";
    emblem += "         \n";
    emblem += "    | Woot\n";
    return integration_assertions.compilesTo(emblem, "<p>Hello</p><p>Woot</p><span>yes</span>{{#sally}}Woot{{/sally}}");
  });

});
define('integration/vanilla-handlebars-support-test', function () {

  'use strict';

  // FIXME handle ">" partial invocation
  //
  // from http://emblemjs.com/syntax/
  //
  // "> partialName" -> "{{>partialName}}"
  // "p check out #{> partialName}" -> "<p>check out {{>partialName}}</p>"
  // "> partialName foo" -> "{{>partialName foo}}"
  //  | Hello, {{> emblemPartialC foo}}{{>emblemPartialB}}{{>emblemPartialB }}

  /*
  QUnit.module "old school handlebars"

  test "array", ->
    emblem =
    '''
    goodbyes
      | #{text}!
    | cruel #{world}!
    '''
    hash = {goodbyes: [{text: "goodbye"}, {text: "Goodbye"}, {text: "GOODBYE"}], world: "world"}
    shouldCompileToString emblem, hash, "goodbye! Goodbye! GOODBYE! cruel world!"

    hash = {goodbyes: [], world: "world"}
    shouldCompileToString emblem, hash, "cruel world!"

  test "handlebars dot-separated paths with segment-literal notation", ->
    emblem =
    '''
    p = articles.[3]
    '''
    shouldCompileTo emblem, { articles: ['zero', 'one', 'two', 'three']}, '<p>three</p>'

  test "handlebars dot-separated paths with segment-literal notation, more nesting", ->
    emblem =
    '''
    p = articles.[3].[#comments].[0]
    '''
    shouldCompileTo emblem, { articles: [{}, {}, {}, {'#comments': ['bazinga']}]}, '<p>bazinga</p>'

  test "../path as inMustacheParam recognized correctly as pathIdNode instead of classShorthand", ->
    Handlebars.registerHelper 'jumpToParent', (link) ->
      new Handlebars.SafeString "<a href='#{link}'>Jump to parent top</a>"
    emblem =
    '''
    each children
      jumpToParent ../parentLink
    '''
    shouldCompileTo emblem, {parentLink: '#anchor', children: [{}]}, '<a href=\'#anchor\'>Jump to parent top</a>'

  if supportsEachHelperDataKeywords

    QUnit.module "each block helper keywords prefixed by @"

    test "#each with @index", ->
      emblem =
      '''
      thangs
        p #{@index} Woot #{yeah}
      '''
      shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>0 Woot 123</p><p>1 Woot 456</p>'

    test "#each with @key", ->
      emblem =
      '''
      each thangs
        p #{@key}: #{this}
      '''
      shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>@key: 123</p><p>works!: 456</p>'

    test "#each with @key, @index", ->
      emblem =
      '''
      each thangs
        p #{@index} #{@key}: #{this}
      '''
      shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>0 @key: 123</p><p>1 works!: 456</p>'

    test "#each with @key, @first", ->
      emblem =
      '''
      each thangs
        if @first
          p First item
        else
          p #{@key}: #{this}
      '''
      shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>First item</p><p>works!: 456</p>'

  */

  // this sees a comment instead of a "../path"
  // This sort of path is not valid in ember but allowed by vanilla handlebars
  /*
  test("../path as inMustacheParam recognized correctly as pathIdNode instead of classShorthand", function() {
    var emblem = w('each children',
               '  jumpToParent ../parentLink');
    compilesTo(emblem, '{{#each children}}{{jumpToParent ../parentLink}}{{/each}}');
  });
  */

  /*
  test("exclamation modifier (vanilla)", function() {
    var emblem = 'p class=foo!';
    return shouldCompileTo(emblem, {
      foo: "YEAH"
    }, '<p class="YEAH"></p>');
  });
  */

});
define('support/handlebars', ['exports'], function (exports) {

  'use strict';

  var Handlebars;

  if (typeof window === "undefined") {
    Handlebars = require("handlebars");
  } else {
    Handlebars = window.Handlebars;
  }

  exports['default'] = Handlebars;

});
define('support/integration-assertions', ['exports', 'support/utils', 'emblem'], function (exports, utils, Emblem) {

  'use strict';

  exports.compilesTo = compilesTo;

  function compilesTo(emblem, handlebars, message) {
    var output = Emblem['default'].compile(emblem);
    if (!message) {
      var maxLenth = 40;
      var messageEmblem = emblem.replace(/\n/g, "\\n");
      if (messageEmblem.length > maxLenth) {
        messageEmblem = messageEmblem.slice(0, maxLenth) + "...";
      }
      message = utils.w("compilesTo assertion failed:", "\tEmblem:   \"" + messageEmblem + "\"", "\tExpected: \"" + handlebars + "\"", "\tActual:   \"" + output + "\"");
    }
    QUnit.push(output === handlebars, output, handlebars, message);
  };

});
define('support/node-context', function () {

	'use strict';

});
define('support/utils', ['exports'], function (exports) {

  'use strict';

  exports.w = w;

  function w() {
    var values = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
      values.push(arguments[i]);
    }
    return values.join("\n");
  }

});
define('unit/ast-builder-test', ['emblem/ast-builder'], function (ast_builder) {

  'use strict';

  /* global QUnit*/
  QUnit.module("Unit - Builder#toAST");

  QUnit.test("empty builder", function (assert) {
    var builder = ast_builder.generateBuilder();

    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: []
    });
  });

  QUnit.test("text node", function (assert) {
    var builder = ast_builder.generateBuilder();
    builder.text("abc def ghi");
    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "text",
        content: "abc def ghi"
      }]
    });
  });

  QUnit.test("element node", function (assert) {
    var builder = ast_builder.generateBuilder();
    builder.element("h1");
    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "element",
        tagName: "h1",
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: []
      }]
    });
  });

  QUnit.test("void element node", function (assert) {
    var builder = ast_builder.generateBuilder();
    builder.element("hr");
    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "element",
        tagName: "hr",
        inTagText: [],
        isVoid: true,
        classNameBindings: [],
        attrStaches: [],
        childNodes: []
      }]
    });
  });

  QUnit.test("attribute node", function (assert) {
    var builder = ast_builder.generateBuilder();

    var el = builder.element("h1");
    builder.enter(el);
    var attrName = "class";
    var attrContent = "my-class";
    builder.attribute(attrName, attrContent);
    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "element",
        tagName: "h1",
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [{
          type: "attribute",
          name: attrName,
          content: attrContent
        }],
        childNodes: []
      }]
    });
  });

  QUnit.test("nested element nodes", function (assert) {
    var builder = ast_builder.generateBuilder();

    var h1 = builder.element("h1");
    builder.enter(h1);
    builder.text("hello");

    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "element",
        tagName: "h1",
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: [{
          type: "text",
          content: "hello"
        }]
      }]
    });
  });

  QUnit.test("nested element nodes enter and exit", function (assert) {
    var builder = ast_builder.generateBuilder();

    var h1 = builder.element("h1");
    builder.enter(h1);
    builder.text("hello");
    builder.exit();
    builder.text("foobar");

    var ast = builder.toAST();

    assert.deepEqual(ast, {
      type: "program",
      childNodes: [{
        type: "element",
        tagName: "h1",
        inTagText: [],
        isVoid: false,
        classNameBindings: [],
        attrStaches: [],
        childNodes: [{
          type: "text",
          content: "hello"
        }]
      }, {
        type: "text",
        content: "foobar"
      }]
    });
  });

});
define('unit/mustache-parser-test', ['emblem/parser', 'support/utils', 'emblem/preprocessor', 'emblem/ast-builder'], function (parser, utils, preprocessor, ast_builder) {

  'use strict';

  /* global QUnit */
  QUnit.module("Unit - mustache-parser");

  function parseEmblem(emblem) {
    var builder = ast_builder.generateBuilder();

    parser.parse(preprocessor.processSync(emblem), {
      builder: builder
    });

    var ast = builder.toAST();

    return ast;
  }

  test("capitalized start", function (assert) {
    var text = "App.Funview";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "view App.Funview",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("lowercase start", function (assert) {
    var text = "frank";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("lowercase unquoted attr value", function (assert) {
    var text = "frank foo=bar";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank foo=bar",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("attrs with spaces", function (assert) {
    var text = "frank foo = bar boo = far";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank foo=bar boo=far",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("multiple attrs", function (assert) {
    var text = "frank foo=bar boo=far";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank foo=bar boo=far",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("lowercase double-quoted attr value", function (assert) {
    var doubleQuote = "input placeholder=\"'100% /^%&*()x12#\"";

    assert.deepEqual(parseEmblem(doubleQuote), {
      childNodes: [{
        attrStaches: [{
          content: "'100% /^%&*()x12#",
          name: "placeholder",
          type: "attribute"
        }],
        childNodes: [],
        classNameBindings: [],
        inTagText: [],
        isVoid: true,
        tagName: "input",
        type: "element"
      }],
      type: "program"
    });
  });

  test("lowercase single-quoted attr value", function (assert) {
    var singleQuote = "input placeholder='\"100% /^%&*()x12#'";

    assert.deepEqual(parseEmblem(singleQuote), {
      childNodes: [{
        attrStaches: [{
          content: "\"100% /^%&*()x12#",
          name: "placeholder",
          type: "attribute"
        }],
        childNodes: [],
        classNameBindings: [],
        inTagText: [],
        isVoid: true,
        tagName: "input",
        type: "element"
      }],
      type: "program"
    });
  });

  test("attr value with underscore", function (assert) {
    var text = "input placeholder=cat_name";
    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        attrStaches: [{
          content: "cat_name",
          key: "placeholder",
          type: "assignedMustache"
        }],
        childNodes: [],
        classNameBindings: [],
        inTagText: [],
        isVoid: true,
        tagName: "input",
        type: "element"
      }],
      type: "program"
    });
  });

  test("attr value is subexpression", function (assert) {
    var text = "echofun fun=(equal 1 1)";
    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "echofun fun=(equal 1 1)",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("attr value is complex subexpression", function (assert) {
    var text = "echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"";
    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "echofun true (hello how=\"are\" you=false) 1 not=true fun=(equal \"ECHO hello\" (echo (hello))) win=\"yes\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("attr value is empty string", function (assert) {
    var doubleQuote = "input placeholder=\"\"";
    var singleQuote = "input placeholder=''";

    assert.deepEqual(parseEmblem(singleQuote), {
      childNodes: [{
        attrStaches: [{
          content: "",
          name: "placeholder",
          type: "attribute"
        }],
        childNodes: [],
        classNameBindings: [],
        inTagText: [],
        isVoid: true,
        tagName: "input",
        type: "element"
      }],
      type: "program"
    });
    assert.deepEqual(parseEmblem(doubleQuote), {
      childNodes: [{
        attrStaches: [{
          content: "",
          name: "placeholder",
          type: "attribute"
        }],
        childNodes: [],
        classNameBindings: [],
        inTagText: [],
        isVoid: true,
        tagName: "input",
        type: "element"
      }],
      type: "program"
    });
  });

  test("query-params", function (assert) {
    var text = "frank (query-params groupId=defaultGroup.id)";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank (query-params groupId=defaultGroup.id)",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("nested query-params", function (assert) {
    var text = "frank (query-params groupId=defaultGroup.id (more-qp x=foo))";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank (query-params groupId=defaultGroup.id (more-qp x=foo))",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mixed query-params and key-value attrs", function (assert) {
    var text = "frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab  ";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank (query-params abc=def) fob=bob (qp-2 dog=fog) dab=tab",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache name with dash", function (assert) {
    var text = "link-to foo=bar";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "link-to foo=bar",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache name with \"/\"", function (assert) {
    var text = "navigation/button-list";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "navigation/button-list",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  /**
  test('mustache value that is a bare "/" is not valid', function(assert){
    var text = 'navigation/button-list / omg';

    assert.throws( function() { parseEmblem(text); } );
  });
  */

  test("mustache with quoted param", function (assert) {
    var text = "link-to \"abc.def\"";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "link-to \"abc.def\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with unquoted param", function (assert) {
    var text = "link-to dog";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "link-to dog",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with multiple params", function (assert) {
    var text = "link-to \"dog.tag\" dog";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "link-to \"dog.tag\" dog",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with shorthand % syntax", function (assert) {
    var text = "frank%span";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank tagName=\"span\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with shorthand # syntax", function (assert) {
    var text = "frank#id-name";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank elementId=\"id-name\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with shorthand . syntax with required space", function (assert) {
    var text = "frank .class-name";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank class=\"class-name\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with multiple classes", function (assert) {
    var text = "frank .class-name1.class-name2";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank class=\"class-name1 class-name2\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("mustache with multiple shorthands", function (assert) {
    var text = "frank%span#my-id.class-name";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank tagName=\"span\" elementId=\"my-id\" class=\"class-name\"",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  /**
  test('mustache cannot start with a dot, a dash or a digit', function(assert){
    assert.throws( function() { parseEmblem('.frank'); } );
    assert.throws( function() { parseEmblem('-frank'); } );
    assert.throws( function() { parseEmblem('9frank'); } );
  });
  */

  test("bang modifier", function (assert) {
    var text = "foo!";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "unbound foo",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("conditional modifier", function (assert) {
    var text = "foo?";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "if foo",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("block params", function (assert) {
    var text = "frank foo=bar boo=far as |steve|";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank foo=bar boo=far as |steve|",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

  test("multiple block params", function (assert) {
    var text = "frank foo=bar boo=far as |steve dave|";

    assert.deepEqual(parseEmblem(text), {
      childNodes: [{
        content: "frank foo=bar boo=far as |steve dave|",
        escaped: true,
        type: "mustache"
      }],
      type: "program"
    });
  });

});
define('unit/parser-test', ['emblem/parser', 'emblem/preprocessor', 'emblem/ast-builder', 'support/utils', 'emblem/utils/void-elements'], function (parser, preprocessor, ast_builder, utils, isVoidElement) {

  'use strict';

  /* global QUnit*/
  QUnit.module("Unit - parse");

  function truncate(text, len) {
    if (!len) {
      len = 40;
    }
    text = text.replace(/\n/g, "\\n");
    var ellipses = text.length > len - 3 ? "..." : "";
    return text.slice(0, len) + ellipses;
  }

  function astTest(name, emblem, callback) {
    QUnit.test(name + " \"" + truncate(emblem) + "\"", function (assert) {
      var builder = ast_builder.generateBuilder();
      parser.parse(preprocessor.processSync(emblem), { builder: builder });
      var ast = builder.toAST();

      callback(assert, ast);
    });
  }

  function program(childNodes) {
    return {
      type: "program",
      childNodes: childNodes || []
    };
  }

  function element(tagName, childNodes, attrStaches, classNameBindings) {
    return {
      type: "element",
      tagName: tagName,
      isVoid: isVoidElement['default'](tagName),
      classNameBindings: classNameBindings || [],
      attrStaches: attrStaches || [],
      inTagText: [],
      childNodes: childNodes || []
    };
  }

  function text(content) {
    return {
      type: "text",
      content: content
    };
  }

  function attribute(attrName, attrContent) {
    return {
      type: "attribute",
      name: attrName,
      content: attrContent
    };
  }

  function classNameBinding(name) {
    return {
      type: "classNameBinding",
      name: name
    };
  }

  astTest("simple element", "h1 hello", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [text("hello")])]));
  });

  astTest("simple void element", "hr", function (assert, ast) {
    assert.deepEqual(ast, program([element("hr")]));
  });

  astTest("simple text", "| abc def ghi", function (assert, ast) {
    assert.deepEqual(ast, program([text("abc def ghi")]));
  });

  astTest("multiline text puts spaces where newlines are", utils.w("| abc def ghi", "  another line"), function (assert, ast) {
    assert.deepEqual(ast, program([text("abc def ghi another line")]));
  });

  astTest("simple element", "h1 my great element", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [text("my great element")])]));
  });

  astTest("simple element with single class name", "h1.my-class", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [], [], [classNameBinding(":my-class")])]));
  });

  astTest("simple element with id", "h1#my-id", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [], [attribute("id", "my-id")])]));
  });

  astTest("simple element with id and class", "h1#my-id.my-class", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [], [attribute("id", "my-id")], [classNameBinding(":my-class")])]));
  });

  astTest("element with shorthand attributes", "#my-id.my-class", function (assert, ast) {
    assert.deepEqual(ast, program([element("div", [], [attribute("id", "my-id")], [classNameBinding(":my-class")])]));
  });

  astTest("special element", "%blink", function (assert, ast) {
    assert.deepEqual(ast, program([element("blink", [], [])]));
  });

  astTest("simple nested elements", utils.w("ul", "  li"), function (assert, ast) {
    assert.deepEqual(ast, program([element("ul", [element("li")])]));
  });

  astTest("simple nested elements with content", utils.w("ul", "  li hello", "  li goodbye"), function (assert, ast) {
    assert.deepEqual(ast, program([element("ul", [element("li", [text("hello")]), element("li", [text("goodbye")])])]));
  });

  astTest("html attributes", "button.close data-dismiss=\"modal\" x", function (assert, ast) {
    assert.deepEqual(ast, program([element("button", [text("x")], [attribute("data-dismiss", "modal")], [classNameBinding(":close")])]));
  });

  astTest("comments are stripped", "/ Some comment", function (assert, ast) {
    assert.deepEqual(ast, program());
  });

  astTest("multiline comments are stripped", utils.w("/ Some multiline", "  comment"), function (assert, ast) {
    assert.deepEqual(ast, program());
  });

  astTest("simple handlebars expression", "h1 = name", function (assert, ast) {
    assert.deepEqual(ast, program([element("h1", [{
      type: "mustache",
      escaped: true,
      content: "name"
    }])]));
  });

  astTest("nested elements interspersed with content", ["p", "  | blah blah", "  b bold text"].join("\n"), function (assert, ast) {
    assert.deepEqual(ast, program([element("p", [text("blah blah"), element("b", [text("bold text")])])]));
  });

  astTest("action in bracketed attributes", ["p [", "click=\"test\" ]"].join("\n"), function (assert, ast) {
    assert.deepEqual(ast, program([element("p", [], [{
      type: "mustache",
      escaped: true,
      content: "action \"test\" on=\"click\""
    }])]));
  });

  astTest("action in bracketed attributes with dom event", ["p [", "onclick={ action \"test\" } ]"].join("\n"), function (assert, ast) {
    assert.deepEqual(ast, program([element("p", [], [{
      type: "assignedMustache",
      key: "onclick",
      content: "action \"test\""
    }])]));
  });

});
define('unit/template-compiler-test', ['emblem/template-compiler'], function (template_compiler) {

  'use strict';

  /* global QUnit*/
  QUnit.module("template compiler");


  QUnit.test("compiles text node AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "text",
        content: "hello world" }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "hello world", "content is output");
  });

  QUnit.test("compiles element node AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "element",
        tagName: "div",
        attrStaches: [{ type: "attribute",
          name: "data-name",
          content: "red" }] }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "<div data-name=\"red\"></div>", "content is output");
  });

  QUnit.test("compiles block node AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "block",
        content: "each person in people",
        childNodes: [{ type: "element",
          tagName: "div" }] }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "{{#each person in people}}<div></div>{{/each}}", "content is output");
  });

  QUnit.test("compiles mustache node AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "mustache",
        escaped: true,
        content: "name" }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "{{name}}", "content is output");
  });

  QUnit.test("compiles unescaped mustache node AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "mustache",
        escaped: false,
        content: "name" }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "{{{name}}}", "content is output");
  });

  QUnit.test("compiles mustaches in attr content AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "element",
        tagName: "div",
        attrStaches: [{ type: "mustache",
          escaped: true,
          content: "bind-attr foo=baz" }, { type: "mustache",
          escaped: true,
          content: "action \"whammo\"" }] }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "<div {{bind-attr foo=baz}} {{action \"whammo\"}}></div>", "content is output");
  });

  QUnit.test("compiles block with inverse AST", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "block",
        content: "with foo as bar",
        childNodes: [{
          type: "text",
          content: "hello there"
        }],
        invertibleNodes: [{
          content: [[{
            type: "text",
            content: "not hello there"
          }]],
          name: "else"
        }]
      }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "{{#with foo as bar}}hello there{{else}}not hello there{{/with}}");
  });

  QUnit.test("compiles boolean attribute", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "element",
        tagName: "input",
        attrStaches: [{
          type: "attribute",
          name: "disabled"
          // NO value for content for a true boolean attribute
        }]
      }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "<input disabled></input>");
  });

  QUnit.test("compiles complex classNameBindings to a bind-attr", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "element",
        tagName: "div",
        classNameBindings: [{
          type: "classNameBinding",
          name: ":size"
        }, {
          type: "classNameBinding",
          name: "color"
        }, {
          type: "classNameBinding",
          name: "isHeavy:oof:whee"
        }]
      }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "<div class=\"size {{color}} {{if isHeavy 'oof' 'whee'}}\"></div>");
  });

  QUnit.test("compiles simple classNameBindings to a class attribute", function (assert) {
    var ast = {
      type: "program",
      childNodes: [{ type: "element",
        tagName: "div",
        classNameBindings: [{
          type: "classNameBinding",
          name: ":size"
        }, {
          type: "classNameBinding",
          name: ":color"
        }]
      }]
    };

    var result = template_compiler.compile(ast);

    assert.equal(result, "<div class=\"size color\"></div>");
  });

});