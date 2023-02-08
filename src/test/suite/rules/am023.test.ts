import { ErrorContext, FilterParams, Rule } from "../../../rules/shared";
import { MarkdownItToken } from "markdownlint";
import assert from "assert";

const rule = require("./../../../rules/rules/am023");
const AM023: Rule = rule;

suite("AM023", () => {
  test("Returns an error if the table does not use outer pipes", () => {
    let callCount = 0;
    const onError = (context: ErrorContext) => {
      callCount++;
      assert.strictEqual(context.line, "Missing Table pipes");
    };
    // const token = new MarkdownItToken("table_open", "table", 1);
    // const tokens: MarkdownItToken[] = [{ line: "   ", lineNumber: 1 }];
    const params: FilterParams = {
      name: "AM023",
      lines: [],
      tokens: [],
      frontMatterLines: [],
    };

    AM023.function(params, onError);

    assert.strictEqual(callCount, 1);
  });

  //   test("Does not return an error if the table uses outer pipes", () => {
  //     let callCount = 0;
  //     const onError = (context: ErrorContext) => {
  //       callCount++;
  //     };
  //     const token: MarkdownItToken = { line: "|   |", lineNumber: 1 };
  //     const params: FilterParams = { frontMatterLines: [] };

  //     AM023.function(params, onError);

  //     assert.strictEqual(callCount, 0);
  //   });
});
