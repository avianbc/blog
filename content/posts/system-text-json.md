+++
date = 2020-09-17
title = "System.Text.Json.Serialization - Read Numbers from JSON strings"
categories = ['Programming']
tags = ['C Sharp', '.NET', 'Json']
+++

Lets say you are POSTing a json that looks like this:

{{< highlight json >}}
{
  "someNumber": "123"
}
{{< /highlight >}}

...to a server-side web api DTO that looks like this:

{{< highlight csharp >}}
public class Stuff
{
    public int? SomeNumber { get; set; }
}
{{< /highlight >}}

This thing will fail since the number in the json is quoted. It looks like System.Text.Json is adding [JsonNumberHandling.AllowReadingFromString](https://github.com/dotnet/runtime/issues/30255) which will accomplish this once [.NET 5.0](https://devblogs.microsoft.com/dotnet/announcing-net-5-0-rc-1/) is finally released.

In the meantime, I wrote a [custom converter](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-converters-how-to) which works with nullable ints.

## StringJsonConverter.cs

{{< highlight csharp >}}
public class StringJsonConverter : JsonConverter<int?>
{
    public override int? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return reader.TokenType switch
        {
            JsonTokenType.Number => reader.GetInt32(),
            JsonTokenType.Null => null,
            JsonTokenType.String => int.TryParse(reader.GetString(), out var parsed) ? parsed : (int?)null,
            _ => throw new ArgumentOutOfRangeException(nameof(reader), reader.TokenType, "Cannot parse unexpected JSON token type.")
        };
    }

    public override void Write(Utf8JsonWriter writer, int? value, JsonSerializerOptions options)
    {
        if (value.HasValue)
        {
            writer.WriteNumberValue(value.Value);
        }
        else
        {
            writer.WriteNullValue();
        }
    }
}
{{< /highlight >}}

Don't forget to register it in one of the [many ways](https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-converters-how-to#register-a-custom-converter) you can do so:

> - Add an instance of the converter class to the JsonSerializerOptions.Converters collection.
> - Apply the [JsonConverter] attribute to the properties that require the custom converter.
> - Apply the [JsonConverter] attribute to a class or a struct that represents a custom value type.

I chose the first option and threw it in my startup:

{{< highlight csharp >}}
services.AddControllers()
        .AddJsonOptions(
            options =>
            {
                // TODO: replace StringToIntJsonConverter with JsonNumberHandling.AllowReadingFromString once we move to .NET 5
                options.JsonSerializerOptions.Converters.Add(new StringToIntJsonConverter());
            });
{{< /highlight >}}
