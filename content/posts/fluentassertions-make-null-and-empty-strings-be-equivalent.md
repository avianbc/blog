---
title: "FluentAssertions – Make null and empty strings be equivalent"
date: 2017-06-30T00:40:04-05:00
categories:
  - Programming
tags:
  - C Sharp
  - .NET
  - FluentAssertions
  - Unit Testing
---

[FluentAssertions](https://fluentassertions.com/strings/) is my assertion library of choice when writing tests in C#. It is very easy to extend and has a ton of nice functionality out of the box.

Unfortunately, there seems to be no way to make a string be equivalent if it is both null and empty. Thankfully we can create our own using `AssertionOptions.AssertEquivalencyUsing`!

{{< highlight csharp >}}
AssertionOptions.AssertEquivalencyUsing(options =>
  options.Using<string>(ctx => (ctx.Subject ?? string.Empty).Should().BeEquivalentTo(ctx.Expectation ?? string.Empty)).WhenTypeIs<string>()
);
{{< /highlight >}}
