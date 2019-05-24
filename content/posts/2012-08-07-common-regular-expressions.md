---
id: 40
title: Common Regular Expressions
date: 2012-08-07T11:31:12-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=40
permalink: /common-regular-expressions/
categories:
  - Programming
tags:
  - Programming
  - RegEx
---
Any programmer worth their salt should have a few tricks up their sleeve. Among these should be [regular expressions](http://en.wikipedia.org/wiki/Regular_expression). The syntax for RegEx is unusual and hard to get used to, but only with a little practice (or even a [cheat sheet](http://www.cheatography.com/davechild/cheat-sheets/regular-expressions/)) you can realize the full potential when it comes to text processing and string handling.

<!--more-->

Pretty much every modern programming language provides a library necessary to use regular expressions. For reference: [C++ / Boost](http://www.boost.org/doc/libs/1_50_0/libs/regex/doc/html/index.html), [Java](http://docs.oracle.com/javase/6/docs/api/java/util/regex/package-summary.html), [.NET (C# and VB)](http://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regex.aspx), [Perl](http://perldoc.perl.org/perlre.html#Regular-Expressions), [Python](http://docs.python.org/library/re.html), [PHP](http://php.net/manual/en/function.preg-match.php), and [more](http://en.wikipedia.org/wiki/Comparison_of_regular_expression_engines). Further more, [popular IDEs](http://www.microsoft.com/visualstudio/en-us) and [Text Editors](http://www.textpad.com/) usually support Find/Replace using RegEx patterns which can greatly increase productivity.

Through the years I have seen RegExes that match things from the simple, to the bizarre. So I decided to put together a list of commonly used ones as a reference for myself (and others):

  1. HTML Hex Value
  2. URL
  3. E-Mail Address
  4. Phone Number
  5. IP Address
  6. Host Names
  7. White Space
  8. Comments
  9. Credit Cards
 10. Dates

* * *

1. **HTML Hex Color Values (Of length 3 or 6)**

> #?([a-f0-9]{6}|[a-f0-9]{3})

As you can see, this pattern first matches the literal ‘#’ followed by exactly 3 or 6 valid hex digits (a-f, 0-9). This pattern should probably be used sparingly since there are [many](http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/) [other](http://msdn.microsoft.com/en-us/library/system.windows.forms.colordialog.aspx) [methods](http://jscolor.com/) for getting color input from the user. Though, this may be used to validate the input after they have made their selection.

2. **Valid URLs**

> (https?://)?([da-z.-]+).([a-z.]{2,6})([/w .-]\*)\*/?

This pattern will match common URLs that begin with http, https, or neither. Note that it does not match ftp. It then checks to make sure only valid characters exist in the domain and path (which is optional so that it will match top level domains and things such as localhost). Also note that directories can optionally end with a slash.

3. **E-Mail Addresses**

> ([a-z0-9_.-]+)@([da-z.-]+).([a-z.]{2,6})

By now you should recognize this pattern. The only tough part about constructing it is figuring out which characters are valid for e-mail addresses (which has been done for you). It will match common e-mails such as someguy@somedomain.org. Note that the user name may also contain underscores in addition to alphanumerics.

4. **Phone Numbers**

> [2-9]d{2}-d{3}-d{4}

This pattern matches simple, 7 digit US telephone numbers.  Note that the number must be hyphen seperated and the first digit must be between 2 and 9 for it to be valid.

Edit: Steven Levithan has an [excellent write-up](http://blog.stevenlevithan.com/archives/validate-phone-number) on this subject that covers far more, including International phone numbers.

5. **IP Address**

> d{1,3}.d{1,3}.d{1,3}.d{1,3}

This is the simplest solution. It will match any IPv4 address in the range from 0.0.0.0 to 999.999.999.999. Any octet values greater than 255 are invalid, so you may consider using this for IPv4 matching instead:

> ((\[0-9]|[1-9\]\[0-9\]|1\[0-9]{2}|2[0-4\]\[0-9\]|25\[0-5]).){3}([0-9]|[1-9\]\[0-9\]|1\[0-9]{2}|2[0-4\]\[0-9\]|25[0-5])

This matches similar values to the one above but restricts it to values from 0.0.0.0 to 255.255.255.255.

For most cases, this regex can lead to code smells. You should peruse your programming language documentation for something similar to [IPAddress.TryParse()](http://msdn.microsoft.com/en-us/library/system.net.ipaddress.tryparse) found in the .NET framework before resorting to this method for validation.

6. **Host Names**

> ((\[a-zA-Z]|[a-zA-Z\]\[a-zA-Z0-9-\]\*\[a-zA-Z0-9]).)\*([A-Za-z]|[A-Za-z\]\[A-Za-z0-9-\]*[A-Za-z0-9])

This pattern matches exactly to the specification defined in the [IETF RFC](http://tools.ietf.org/html/rfc952) for hostnames and will match any valid hostname that you feed it. Note that modern hostnames are valid if they begin with a digit (even though the RFC does not specify this).

7. **Whitespace**

> <tt>[ s]+</tt>

This one is useful for editors that support regular expressions. If you wish to trim all whitespace (r, n, t, and spaces) from code to make it more compact, this regular expression will accomplish this. In particular, JavaScript developers who wish to trim all unnecessary whitespace before pushing the code live (in order to minimize file size) may find this useful.

Note that minor changes can increase the power of this regex:  ^[ s]+ will find whitespace at the beginning of a line, [ s]+$ will find whitespace at the end of a line, or you may combine these together. Also, you can substitute by changing s which matches returns, newlines, tabs for r, n, and t respectively or remove the leading space to not include spaces.

8. **Comments**

Another one useful for programmers in RegEx enables search/replace functionality. These RegExes are very useful if you want to automate the removal of dead or commented out code. Just open your favorite IDE, select Find -> Replace, enable regexes,a nd search for the given pattern to quickly remove the unnecessary clutter.

Different languages use different syntax for comments, so I’m going to try and list as many as I can think of off the top of my head:

> #.*$

This pattern matches all single line comments that begin with the pound sign (#). Useful for Perl and Ruby programmers.

> ^s\*#.\*$

This one is a stronger version of the one above adapted to match compiler directives and pragmas in C / C++ source code.

>  /\*.\*?*/

This pattern matches multiline comments in the form of /\* Comment goes here \*/. This style is common in many programming languages such as C++ and Java.

> //.*$

This one matches doubleslash style comments such as // Comment goes here. Note that it will match the entire line if the string // is found. This is another very common style for comments.

> ^.\*’.\*$

Finally, this pattern matches VB style comments which begin with an apostrophe.

9. **Credit Cards**

>  ^4[0-9]{12}(?:[0-9]{3})?

Matches a valid Visa credit card, both new and old style since the newer cards have a few extra digits. Visa cards must begin with 4.

> ^5\[1-5\]\[0-9\]{14}

Matches a valid MasterCard number. MasterCard must begin with 5.

>  ^3\[47\]\[0-9\]{13}$

Matches a valid Amex card (must begin with a 3).

Note that before using these, it would be best to strip white-space and hyphens (or even better, all non-digits). These would be useful for validation on a web app for an online store.

10. **Dates**

> ^(19|20)dd\[- /.\](0\[1-9]|1\[012])[- /.\](0[1-9]|[12\]\[0-9\]|3[01])$

This matches dates in the format of yyyy-mm-dd. This enforces hyphen delimiters and also checks that the date is within a valid range. Most programming languages have a rich syntax for dates and date/time validation. You should probably check documentation for it before resorting to using a regex. Also you could check our [jQuery](http://jqueryui.com/demos/datepicker/) if you are building a web app or website.
