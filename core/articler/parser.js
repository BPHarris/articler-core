/** */

import "./util.js";

import Article from "./ast/article.js";
import Metadata from "./ast/Metadata.js";

import ArticleBody from "./ast/ArticleBody.js";

import Heading from "./ast/Heading.js";
import Paragraph from "./ast/Paragraph.js";
import Figure from "./ast/Figure.js";
import HtmlBlock from "./ast/HtmlBlock.js";
import LineComment from "./ast/LineComment.js";
import CodeBlock from "./ast/CodeBlock.js";


import {
    ArticlerError,
    UnrecognisedMetadataTagError,
    UnexpectedTokenError,
    NewlineExpectedError,
    HeadingLevelError,
    CaptionExpectedError,
    UrlExpectedError,
} from "./error.js";


export default parse_article;


/**
 * article ::= metadata article_body
 * 
 * @return [Article | ArticlerError]
 */
function parse_article(article)
{
    var metadata, article_body;

    // NOTE: Fix line endings
    article = article.replace(/(?:\r\n|\r|\n)/g, "\n");
    
    [metadata, article] = parse_metadata(article);
    if (metadata instanceof ArticlerError)
        return metadata;

    [article_body, article] = parse_article_body(article);
    if (article_body instanceof ArticlerError)
        return article_body;

    // TODO: if (article.length) Error() -- i.e. article_body had leftovers

    return new Article(metadata, article_body);
}


/**
 * metadata ::= (metadata_line | NEWLINE)*
 * 
 * @return [Metadata | ArticlerError, article'] article metadata
 */
function parse_metadata(article)
{
    var metadata_line, metadata_lines = [];

    article = article.skip_whitespace();
    
    while (article.starts_with("@"))
    {
        [metadata_line, article] = parse_metadata_line(article);

        if (metadata_line instanceof ArticlerError)
            return [metadata_line, article];

        metadata_lines.push(metadata_line);
        article = article.skip_whitespace();
    }

    var metadata = new Metadata(metadata_lines), error;
    if ((error = metadata.is_legal()) instanceof ArticlerError)
        return [error, article];
    return [metadata, article];
}


/**
 * metadata_line ::= '@' metadata_tag '=' line
 * 
 * @return [Array[metadata_tag, line] | ArticlerError, article']
 */
function parse_metadata_line(article)
{
    var metadata_tag, line;

    article = article.consume("@");
    
    article = article.skip_whitespace();
    
    [metadata_tag, article] = article.read_option(Metadata.allowed_metadata_tags);
    if (!metadata_tag) {
        var error = new UnrecognisedMetadataTagError(
            Metadata.allowed_metadata_tags, article.read_to("=")[0]);
        return [error, article]
    }
    
    article = article.skip_whitespace();
    
    if (!article.starts_with("="))
        return [new UnexpectedTokenError("=", article[0]), article];
    article = article.consume("=");

    article = article.skip_whitespace();

    [line, article] = article.read_line();

    return [[metadata_tag, line], article];
}


/**
 * article_body ::= (statement | NEWLINE)*
 * 
 * @return [ArticleBody | ArticlerError, article']
 */
function parse_article_body(article)
{
    var statement, statements = [];

    while (article)
    {
        article = article.skip_whitespace();

        if (!article)
            break;

        if (article.starts_with("#"))
            [statement, article] = parse_heading(article);
        else if (article.starts_with("!"))
            [statement, article] = parse_figure(article);
        else if (article.starts_with("<html>"))
            [statement, article] = parse_html(article);
        else if (article.starts_with("<!--"))
            [statement, article] = parse_line_comment(article);
        else if (article.starts_with("```"))
            [statement, article] = parse_code_block(article);
        else
            [statement, article] = parse_paragraph(article);
        
        if (statement instanceof ArticlerError)
            return [statement, article];
        // if (statement instanceof LineComment)
        //     continue;
        statements.push(statement);
    }

    return [new ArticleBody(statements), article];
}


/**
 * heading ::= '#' line | '##' line | ... | '######' line
 * 
 * @return [Heading | ArticlerError, article']
 */
function parse_heading(article)
{
    var level = 0, heading;

    if (article.starts_with("#######"))
        return [new HeadingLevelError(), article];
    else if (article.starts_with("######"))
        level = 6;
    else if (article.starts_with("#####"))
        level = 5;
    else if (article.starts_with("####"))
        level = 4;
    else if (article.starts_with("###"))
        level = 3;
    else if (article.starts_with("##"))
        level = 2;
    else // (article.starts_with("#"))
        level = 1;

    article = article.consume("#".repeat(level));

    [heading, article] = article.read_line();
    heading = heading.trim();

    return [new Heading(level, heading), article];
}


/**
 * paragraph ::= line | line+ NEWLINE
 * 
 * @return [Paragraph | ArticlerError, article']
 */
function parse_paragraph(article)
{
    var lines = [], line;

    do {
        article = article.skip_whitespace();
        [line, article] = article.read_line();
        line = line.trim();
        lines.push(line);
    } while (!article.starts_with("\n")
          && !article.starts_with("#")
          && !article.starts_with("!")
          && !article.starts_with("<html>")
          && !article.starts_with("<!--")
          && !article.starts_with("```")
          && !article.is_at_end());

    return [new Paragraph(lines.join("\n")), article];
}


/**
 * figure ::= '!' '[' CAPTION (',' figure_data)* ']' '(' URL ')'
 * 
 * @return [Figure | ArticlerError, article']
 */
function parse_figure(article)
{
    var caption, url;

    article = article.consume("!");

    if (!article.starts_with("["))
        return [new UnexpectedTokenError("[", article[0]), article];
    article = article.consume("[");

    // Parse caption
    // TODO: figure_data
    [caption, article] = article.read_to("]");
    caption = caption.trim();
    if (!article)
        return [new UnexpectedTokenError("]", "end-of-file"), article];
    if (!caption.is_caption())
        return [new CaptionExpectedError("Figure"), article];
    
    if (!article.starts_with("("))
        return [new UnexpectedTokenError("(", article[0]), article];
    article = article.consume("(");

    // Parse URL
    [url, article] = article.read_to(")");
    url = url.trim();
    if (!article)
        return [new UnexpectedTokenError(")", "end-of-file"), article];
    if(!url.is_url())
        return [new UrlExpectedError("Figure"), article];

    return [new Figure(caption, url), article];
}


/**
 * html ::= '<' 'html' '>' (text | line)* '<' '/' 'html' '>'
 */
function parse_html(article)
{
    var html;

    article = article.consume("<html>");

    [html, article] = article.read_to("</html>");
    if (!article)
        return [new UnexpectedTokenError("</html>", "end-of-file"), article];
    html = html.trim();


    return [new HtmlBlock(html), article];
}


/**
 * line_comment ::= '<!--' text '-->' NEWLINE
 * 
 * @return [LineComment | ArticlerError, article']
 */
function parse_line_comment(article)
{
    var text;
    
    article = article.consume("<!--");

    [text, article] = article.read_line();
    if (!text.ends_with("-->"))
        return [new UnexpectedTokenError("TEXT* -->", text), article];
    text = text.slice(0, -3); // consume "-->"
    text = text.trim();

    return [new LineComment(text), article];
}


/**
 * code_block ::= '\```' (text | line)* '\```'
 * NB: Added \ to grammar for VSCode hover-peak, \ is not in grammar
 */
function parse_code_block(article)
{
    var code;

    article = article.consume("```");

    [code, article] = article.read_to("```");
    if (!article)
        return [new UnexpectedTokenError("```", "end-of-file"), article];
    code = code.trim();

    // Format code
    // FIXME: Assumes all lines are indented by 1
    //        and if not, forces them to be
    code = code.replace(/\n(\t|    )/, "<br>\n");
    code = code.replace("\n", "<br>\n");
    code += "<br>";

    return [new CodeBlock(code), article];
}
