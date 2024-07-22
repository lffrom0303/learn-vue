import { parse } from "./html-parser";
import { generate } from "./codegen";

const cache = Object.create(null);

export function compile(html) {
  html = html.trim();
  console.log("compile函数-得到根节点html字符串", html);
  const hit = cache[html];
  // console.log("compile函数-检查缓存是否有根节点dom字符串, 有直接返回", hit);
  if (hit) {
    return hit;
  }
  let htmlParse = parse(html);
  console.log(
    "compile函数-传入根节点html字符串，得到解析ast抽象语法树",
    htmlParse
  );
  let generateParseHtmlFn = generate(htmlParse);
  console.log(
    "compile函数-得到传入ast抽象语法树，生成相应的JavaScript代码的函数",
    generateParseHtmlFn
  );
  cache[html] = generateParseHtmlFn;
  // console.log("compile函数-将该函数放到缓存里", cache[html]);
  return cache[html];
}
