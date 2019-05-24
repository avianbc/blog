---
id: 12
title: JSON resources in .NET
date: 2012-08-03T11:25:50-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=12
permalink: /json-resources-in-net/
categories:
  - Programming
  - CSharp
  - JSON
---
While working on Sprite Editor, I had to dig deep into the web in order to come up with a fast, lightweight method for the deserialization or parsing JSON files. The .NET 4  Framework does have a few methods to enable this functionality, but they are not very customizable or powerful.

<!--more-->

Basically, it comes down to one of a few use cases:

  1. You have a static JSON, whose structure is known and you wish to deserialize.
  2. You have a dynamic JSON, whose structure can (and will) change (polymorphic).
  3. You have either of the above cases, but only need a subset of the data.

  * **Case 1:  Static JSON **Deserialization**
**

If you have static JSON data, you can build a class using the JSON structure as a model and use either [JavaScriptSerializer](http://msdn.microsoft.com/en-us/library/system.web.script.serialization.javascriptserializer.aspx) to instantiate and set the members of the class. The class file must match the JSON structure exactly or else it will not be parsed correctly. Thankfully, there are a few tools to automate this process:  [JSON2CSharp](http://json2csharp.com/) and [JSONPack](http://jsonpack.com/) will generate a class file for you.

  * **Case 2: Polymorphic JSON **Deserialization**
**

If the JSON structure is unknown, then you have fallen into the fuzzy realm of polymorphic JSONs. This used to be extremely tricky, but thankfully the new features in .NET have made it a lot less painful. Specifically the usage of generics, dynamics, and implicitly typed variables (var). If the JSON is not nested repeatedly, you can use:

> <pre>var jss = new JavaScriptSerializer();
var dict = jss.Deserialize<Dictionary<dynamic,string>>(jsonString);</pre>

The problem in this method arises when you have a 2-3+ level nested structure in the JSON file. It will result in dictionaries of dictionaries of dictionaries and will be tricky to work with. Thankfully, there are many robust 3rd party libraries which will make it even easier!

The most widely used one is [Json.NET](http://james.newtonking.com/projects/json-net.aspx). Though there are others such as [fastJSON](http://fastjson.codeplex.com/), which contains a [nice write-up](http://www.codeproject.com/Articles/159450/fastJSON) on the pros and cons of each library. Through the usage of JTokens and JObjects, I achieved this functionality using a method similar to that of traversing linked lists:

<pre style="padding-left: 30px;">JObject root = JObject.Parse(jsonString);
JToken token = root.Children().ToList().First();
while (token != null) {
    // process each token individually
    token = token.Next;
}</pre>

  * **Case 3: Partial Deserialization**

If you only need to deserialize parts of a JSON string, there isn’t many options. You may do some string manipulation to trim unnecessary sections, then deserialization using this method is inefficient on larger JSON files. Json.NET provides [methods](http://james.newtonking.com/projects/json/help/html/SerializingJSONFragments.htm) for performing this on JSON fragments.

* * *

  * **Leftovers******

<p style="padding-left: 30px;">
  <strong>– Serialization</strong>
</p>

[DataContractJsonSerializer](http://msdn.microsoft.com/en-us/library/system.runtime.serialization.json.datacontractjsonserializer.aspx) and [Json.NET](http://james.newtonking.com/projects/json/help/html/ReducingSerializedJSONSize.htm) support [attributes](http://msdn.microsoft.com/en-us/library/z0w1kczw%28v=vs.100%29.aspx) in order to control which members of a class are serialized. Json.NET has a [guide](http://james.newtonking.com/projects/json/help/html/SerializationGuide.htm) that introduces its many methods and settings when it comes to serialization. It has almost any feature you could possibly think of.

<strong style="padding-left: 30px;">– Schema</strong>

Need to perform some kind of validation on a JSON? Well, there is a [draft](http://json-schema.org/) for a standard JSON schema, similar to those used in XML which can in turn be used to perform validation. Newer versions of Json.NET support this feature.

<p style="padding-left: 30px;">
  <strong>– Other Tools</strong>
</p>

If you look hard enough on the web, there are many tools available when it comes to working with JSON files. Here are a few of them:

  1. [JSONLint](http://jsonlint.com/) – Powerful and popular online JSON validator.
  2. [JSON Viewer](http://jsonviewer.stack.hu/) – Provides an online implementation of a JSON formatter/tidying which can be useful for readability when working with large JSON files.
  3. [JSON Editor](http://braincast.nl/samples/jsoneditor/) – This website offers the ability to convert JSON to XML and vice versa.
  4. [JSON Schema Generator](http://www.jsonschema.net/) – generates a schema for you to use in validation.
