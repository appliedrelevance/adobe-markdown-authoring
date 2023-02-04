/**
 * Look for lines that begin with the regex "[!BEGINSHADEBOX ".  These lines delimit a shaded box section of the
 * document.  Replace the "[!BEGINSHADEBOX ..." with a <div class="sp-wrapper"> opening.  Then, look for the
 * corresponding "[!ENDSHADEBOX]" line and replace it with a </div> closing tag.
 * The text after the "[!BEGINSHADEBOX " is used as the title of the shaded box.
 * Note that the actual syntax begins with ">" because it is a blockquote.  We need to look for blockquotes before
 * we look for the shaded box.
 * @param {*} state
 */

import StateCore from "markdown-it/lib/rules_core/state_core";
import Token from "markdown-it/lib/token";
import { TokenType } from "..";

export function transformShadebox(state: StateCore) {
  let tokens: Token[] = state.tokens;
  let shadeboxRe =
    /\[!BEGINSHADEBOX(\s+\"(.*)\")*\]\n*([\s\S]*)\n*\[!ENDSHADEBOX\]\n*/;
  let endShadeboxRe = /\[!ENDSHADEBOX\]/;
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    if (token.type !== TokenType.BLOCKQUOTE_OPEN) {
      continue;
    }
    // We are in a Blockquote. The next token should be a paragraph.
    let nextToken = tokens[i + 1];
    if (!(nextToken.type === TokenType.PARAGRAPH_OPEN)) {
      continue;
    }
    // The next token should be an inline token.
    let nextNextToken = tokens[i + 2];
    if (nextNextToken.type === TokenType.INLINE) {
      let text = nextNextToken.content;
      // Find the opening line.
      let match = shadeboxRe.exec(text);
      if (match) {
        let shadeboxTitleText = match[2] || "";
        let shadeboxContent = match[3] || "";
        // Replace the blockquote_open with a <div class="sp-wrapper"> opening.
        let wrapperToken = new Token("html_block", "", 0);
        wrapperToken.content = '<div class="sp-wrapper">';
        wrapperToken.type = "html_block";
        tokens.splice(i, 1, wrapperToken);
        // Replace the paragraph, inline and paragraph end, with the title HTML div
        let shadeboxToken = new Token("html_block", "", 0);
        shadeboxToken.content = `<p><strong>${shadeboxTitleText}</strong></p>`;
        shadeboxToken.type = "html_block";
        tokens.splice(i + 1, 3, shadeboxToken);
        // insert the content
        let contentToken = new Token("html_block", "", 0);
        contentToken.type = "html_block";
        contentToken.content = `<div>${shadeboxContent}</div>`;
        tokens.splice(i + 2, 0, contentToken); // replace the block end with the content
        i += 3; //skip the content we just inserted
        // Find the BLOCKQUOTE_CLOSE token
        while (i < tokens.length) {
          nextToken = tokens[i];
          if (nextToken.type === TokenType.BLOCKQUOTE_CLOSE) {
            // Replace the blockquote_close with a </div> closing.
            let closeWrapperToken = new Token("html_block", "", 0);
            closeWrapperToken.content = "</div>";
            closeWrapperToken.type = "html_block";
            tokens.splice(i, 1, closeWrapperToken);
            break;
          }
          i++;
        }
      } // end if
    } // end for
  }
}
