---
id: 609
title: 'Enum friendly names using attributes in C# ASP.NET MVC'
date: 2015-08-02T14:58:24-04:00
author: brad
layout: post
guid: http://br4d.net/?p=609
categories:
  - CSharp
  - Programming
---
Are you using enums in dropdowns or radiobuttons or something similar? Instead of hard coding display names, a way of reusing these names was coined in the MVC 3 days that involved decorating the enum with the [DescriptionAttribute](https://msdn.microsoft.com/en-us/library/system.componentmodel.descriptionattribute%28v=vs.110%29.aspx). Judging from posts on stack overflow, this was a very popular method.

When MVC 5 came out, it included new [helpers](https://msdn.microsoft.com/en-us/library/system.web.mvc.html.selectextensions.enumdropdownlistfor%28v=vs.118%29.aspx) for [Enums](https://msdn.microsoft.com/en-us/library/system.web.mvc.html.enumhelper%28v=vs.118%29.aspx) (which was fantastic). However, MS used the typical DisplayAttribute (the [DisplayAttribute.Name property](https://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.displayattribute.name%28v=vs.110%29.aspx) to be exact) instead of the DescriptionAttribute to pull this off.

I wrote an Enum extension method that attempts to grab the name from both of these attributes. This method should work great with legacy and the newer MVC apps.

Keep in mind, that it is probably best to be consistent and use only DisplayAttribute in future projects, as this basically deprecates the DescriptionAttribute method but this could be useful for legacy projects that have been updated to MVC 5.

{{< highlight csharp >}}
public static class ExtensionMethods
{
    /// <summary>
    /// Returns friendly name for enum as long as enum is decorated with a Display or Description Attribute, otherwise returns Enum.ToString()
    /// </summary>
    /// <param name="value">Enum</param>
    /// <returns>Friendly name via DescriptionAttribute</returns>
    public static string ToFriendlyName(this Enum value)
    {
        Type type = value.GetType();

        // first, try to get [Display(Name="")] attribute and return it if exists
        string displayName = TryGetDisplayAttribute(value, type);
        if (!String.IsNullOrWhiteSpace(displayName))
        {
            return displayName;
        }

        // next, try to get a [Description("")] attribute
        string description = TryGetDescriptionAttribute(value, type);
        if (!String.IsNullOrWhiteSpace(description))
        {
            return description;
        }

        // no attributes found, just tostring the enum :(
        return value.ToString();
    }

    private static string TryGetDescriptionAttribute(Enum value, Type type)
    {
        if (!type.IsEnum) throw new ArgumentException(String.Format("Type '{0}' is not Enum", type));

        string name = Enum.GetName(type, value);
        if (!String.IsNullOrWhiteSpace(name))
        {
            FieldInfo field = type.GetField(name);
            if (field != null)
            {
                DescriptionAttribute attr = Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute)) as DescriptionAttribute;
                if (attr != null)
                {
                    return attr.Description;
                }
            }
        }

        return null;
    }

    private static string TryGetDisplayAttribute(Enum value, Type type)
    {
        if (!type.IsEnum) throw new ArgumentException(String.Format("Type '{0}' is not Enum", type));

        MemberInfo[] members = type.GetMember(value.ToString());

        if (members.Length > 0)
        {
            MemberInfo member = members[0];
            var attributes = member.GetCustomAttributes(typeof(DisplayAttribute), false);

            if (attributes.Length > 0)
            {
                DisplayAttribute attribute = (DisplayAttribute)attributes[0];
                return attribute.GetName();
            }
        }

        return null;
    }
}
{{< /highlight >}}
