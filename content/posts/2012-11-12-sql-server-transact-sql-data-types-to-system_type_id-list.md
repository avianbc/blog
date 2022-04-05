---
id: 277
title: SQL Server (T-SQL) Data Types to system_type_id list (2022 update)
date: 2022-04-05T10:33:59-04:00
author: brad
layout: post
guid: http://avian.netne.net/blog/?p=277
permalink: /sql-server-transact-sql-data-types-to-system_type_id-list/
categories:
  - SQL
---
I received metadata for a SQL Server database which contained the system\_type\_id but not what I needed: the data types of each column. Google did not seem to have a list of these so I ran the queries and posted them here as reference. I hope you find it useful.

| system_type_id | datatype |
| -------------- | -------- |
| 34 | image |
| 35 | text |
| 36 | uniqueidentifier |
| 40 | date |
| 41 | time |
| 42 | datetime2 |
| 43 | datetimeoffset |
| 48 | tinyint |
| 52 | smallint |
| 56 | int |
| 58 | smalldatetime |
| 59 | real |
| 60 | money |
| 61 | datetime |
| 62 | float |
| 98 | sql_variant |
| 99 | ntext |
| 104 | bit |
| 106 | decimal |
| 108 | numeric |
| 122 | smallmoney |
| 127 | bigint |
| 165 | varbinary |
| 167 | varchar |
| 173 | binary |
| 175 | char |
| 189 | timestamp |
| 231 | nvarchar |
| 239 | nchar |
| 241 | xml |

Here is the SQL query I used to get the above data:

{{< highlight sql >}}
SELECT system_type_id, name as datatype
FROM sys.types
WHERE system_type_id = user_type_id
{{< /highlight >}}

*Editor's Note: This post was originally published in November 2012 and has been updated to include new datatypes that have been added since.*
