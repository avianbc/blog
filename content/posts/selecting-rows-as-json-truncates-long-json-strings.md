---
title: "SSMS – Selecting rows as json truncates long json strings"
date: 2018-11-18T00:40:04-05:00
categories:
  - Programming
  - SQL
---

In the newer versions of Microsoft SQL Server, it is now super easy to [return selected rows as json data](https://docs.microsoft.com/en-us/sql/relational-databases/json/format-query-results-as-json-with-for-json-sql-server).

Unfortunately, SSMS seems to truncate json strings that are longer than 2033 chars no matter what you do. This seems to happen no matter if you show the results in the grid, text, or a file.

Here is a workaround using a variable and `PRINT` if you want to just get the json string on your clipboard:

{{< highlight sql >}}
DECLARE @RESULT NVARCHAR(MAX);

SET @RESULT = (SELECT * FROM TABLE FOR JSON AUTO, ROOT('Data'))

PRINT @RESULT;
{{< /highlight >}}

Otherwise, you could always download [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio) which seems to show results without truncation issues. If you are unfamiliar with ADS, it is basically a multi-platform re-write of SSMS.
