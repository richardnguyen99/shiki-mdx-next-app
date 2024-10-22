import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine-oniguruma.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import javascriptLang from "shiki/langs/javascript.mjs";
import cssLang from "shiki/langs/css.mjs";
import graphqlLang from "shiki/langs/graphql.mjs";
import pythonLang from "shiki/langs/python.mjs";
import shellLang from "shiki/langs/shellscript.mjs";
import protobufLang from "shiki/langs/protobuf.mjs";

import wasm from "shiki/wasm";

/**
 * Create a Shiki core highlighter instance, with no languages or themes
 * bundled. Wasm and each language and theme must be loaded manually.
 */
const highlighter = createHighlighterCore({
  // Specify the themes you want to use. You can include as many as you want.
  // See https://shiki.style/themes for a list of available themes.
  themes: [githubDark, githubLight],

  // Specify the languages you want to use. You can include as many
  // as you want.
  langs: [
    javascriptLang,
    cssLang,
    graphqlLang,
    pythonLang,
    shellLang,
    protobufLang,
  ],

  // Default grammar parser. This is reccomended for most use cases. You can
  // also use your own custom engine.
  // See https://shiki.style/guide/regex-engines#oniguruma-engine
  engine: createOnigurumaEngine(wasm),
});

export default highlighter;
