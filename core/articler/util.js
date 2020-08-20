/** Articler Parser Util Functions */

const r_css_selector = /^[a-zA-Z-][a-zA-Z0-9-]*$/;
const r_url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const r_fa_icon = /^fa[srldb]? [a-z-]*$/;
const r_caption = /^[-a-zA-Z0-9@:%._\//+~#= ]*$/;


String.prototype.is_css_selector = function () { return this.match(r_css_selector); };
String.prototype.is_url = function () { return this.match(r_url); };
String.prototype.is_fa_icon = function () { return this.match(r_fa_icon); };
String.prototype.is_caption = function () { return this.match(r_caption); };


String.prototype.starts_with = String.prototype.startsWith;
String.prototype.ends_with = String.prototype.endsWith;
String.prototype.index_of = String.prototype.indexOf;


/** @return [string] returns this with target removed from the start */
String.prototype.consume = function (target) {
    if (!this.starts_with(target))
        return this;
    return this.slice(target.length);
};

/** @return [string] returns this without preceeding whitespace. */
String.prototype.skip_whitespace = String.prototype.trimStart;


/** */
String.prototype.read_option = function (options) {
    for (const option of options)
        if (this.starts_with(option))
            return [option, this.consume(option)];
    return ["", this];
};


/** @return [before, after]  */
String.prototype.read_to = function (target) {
    var index = this.index_of(target);
    if (index === -1)
        return [this, ""]
    return [this.slice(0, index), this.slice(index + target.length)];
};


/** @return [line, article] @see read_to */
String.prototype.read_line = function () { return this.read_to("\n"); };


/** @return [bool] */
String.prototype.is_at_end = function () { return this == "" };


/** @return [string] indent a strings lines by n indents */
String.prototype.indent = function(n, indent_str) {
    if (this.split("\n") === this)
        return indent_str.repeat(n) + this;
    return indent_str.repeat(n)
        + this.split("\n").join("\n" + indent_str.repeat(n));
}
