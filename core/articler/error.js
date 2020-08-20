/** articler error class and util functions */

export {
    ArticlerError,
    /* Metadata Specific */
    UnrecognisedMetadataTagError,
    MetadataRepetitionError,
    MetadataFaIconMismatchError,
    /* Generic Errors */
    UnexpectedTokenError,
    NewlineExpectedError,
    /* String Format Errors */
    CssClassOrIdExpectedError,
    UrlExpectedError,
    FontAwesomeIconExpectedError,
    CaptionExpectedError,
    /* Parser - Heading */
    HeadingLevelError,
};


/** */
class ArticlerError
{
    constructor(type, message, lineno)
    {
        this.type = type;
        this.message = message;
        this.lineno = lineno;
    }

    to_html()
    {
        var html =
`<div class="articler-article">
    <div class="articler-debug"></div>
    <div class="articler-error">
        <div class="type">${this.type}</div>
        <div class="message">${this.message}</div>
    </div>
</div>`;
        return html;
    }

    toString()
    {
        return `${this.type}: ${this.message}`;
    }
}


/** */
class UnrecognisedMetadataTagError extends ArticlerError
{
    constructor(allowed_tags, got, lineno)
    {
        super("UnrecognisedMetadataTagError",
            `Metadata expects a tag in [${allowed_tags}] but got "${got}"`,
            lineno);
    }
}


/** */
class MetadataRepetitionError extends ArticlerError
{
    constructor(tag, lineno)
    {
        super("MetadataRepetitionError",
            `Metadata for non-repeatable tag "${tag}" is already set`, lineno);
    }
}


/** */
class MetadataFaIconMismatchError extends ArticlerError
{
    constructor(lineno)
    {
        super("MetadataFaIconMismatchError",
            `Mismatched number of fa-icon and fa-icontarget tags`, lineno);
    }
}


/** */
class UnexpectedTokenError extends ArticlerError
{
    constructor(expected, got, lineno)
    {
        super("UnexpectedTokenError",
            `Expected "${expected}" got "${got}"`, lineno);
    }
}


/** */
class NewlineExpectedError extends ArticlerError
{
    constructor(what, lineno)
    {
        super("NewlineExpectedError",
            `Newline expected after ${what}`, lineno);
    }
}


/** */
class CssClassOrIdExpectedError extends ArticlerError
{
    constructor(what, lineno)
    {
        super("CssClassOrIdExpectedError",
            `Valid CSS class/id expected by "${what}" ` +
            `i.e. /^[a-zA-Z-][a-zA-Z0-9-]*$/`, lineno);
    }
}


/** */
class UrlExpectedError extends ArticlerError
{
    constructor(what, lineno)
    {
        super("UrlExpectedError",
            `Legal URL with http(s) prefix expected by "${what}"`, lineno);
    }
}


/** */
class FontAwesomeIconExpectedError extends ArticlerError
{
    constructor(what, lineno)
    {
        super("FontAwesomeIconExpectedError",
            `Font Awesome icon expected by "${what}" ` +
            `e.g. "far fa-square"`, lineno);
    }
}


/** */
class CaptionExpectedError extends ArticlerError
{
    constructor(what, lineno)
    {
        super("CaptionExpectedError",
            `Valid caption expected by "${what}"`, lineno);
    }
}


/** */
class HeadingLevelError extends ArticlerError
{
    constructor(lineno)
    {
        super("HeadingLevelError", `Articler only supports heading of ` +
            `level 1 to 6`, lineno);
    }
}

