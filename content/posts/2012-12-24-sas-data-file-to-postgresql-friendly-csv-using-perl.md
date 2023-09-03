---
id: 405
title: SAS Data File to PostgreSQL friendly CSV using Perl
date: 2012-12-24T00:06:39-04:00
author: brad
layout: post
guid: http://br4d.net/?p=405
permalink: /sas-data-file-to-postgresql-friendly-csv-using-perl/
categories:
  - Programming
  - Databases
tags:
  - SQL
  - Perl
  - SEER
---
In my database course at Marshall University, I helped my professor with a side project involving Cancer research data that has been collected since 1973 by the National Cancer Institute. My first job was to take the [SEER](http://seer.cancer.gov/about/) data and load it into a postgreSQL database.

The job was simple enough. The only problem? The data files were in [SAS format](http://en.wikipedia.org/wiki/SAS_(software)). Basically the format was CRLF delimited entries composed of fixed-length fields. [Here](http://seer.cancer.gov/manuals/read.seer.research.nov2011.sas) is a list of the fields and lengths that I used for the script.

If you look below, the arrays @l and @p hold the integer length and position of each field (respectively). So, in order to adopt this to your SAS file, all you need is a data dictionary that shows the column (aka location) and the length of each field and fill these two arrays with the appropriate values. Change the input and output filenames if you desire to do so. Run it. Presto, you now have the SAS files in CSV format for easy loading to a RMDB!

How this script works: @c is a container for the csv entries for each line that is parsed. We iterate @p and @l using each_array from List::MoreUtils and push the resulting CSV line into the @c container. After the lines from the input SAS file are parsed, it is written to file using print, the files are closed and the script exits.

{{< highlight perl >}}
#!/usr/bin/perl -w

use warnings;
use List::MoreUtils qw( each_array );

open (IN, 'FILENAME.TXT');
open (OUT, '>output.csv');

@l = (8,10,1,2,1,1,1,3,4,3,2,2,4,4,1,4,1,4,1,1,1,1,3,2,2,1,2,2,13,2,4,1,1,1,1,3,3,3,2,3,3, 3,3,3,3,3,2,2,2,2,1,1,1,1,1,6,6,6,2,1,1,2,1,1,1,1,1,2,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,2,5,5,4,4,3,3,3,3,1,1,2,2,3,1,1,1,1,2,2,1,1,2,1,5,4,5,5,1,1,1,2,2,1,1,1,1,1);

@p = (0,8,18,19,21,22,23,24,27,31,34,36,38,42,46,47,51,52,56,57,58,59,60,63,65,67,68,70,72,85,87,91,92,93,94,95,98,101,104,106,109,112,115,118,121,124,127,129,131,133,135,136,137,138,139,140,146,152,158,160,161,162,164,165,166,167,168,169,171,173,174,175,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,193,198,203,207,211,214,217,220,223,224,225,227,229,232,233,234,235,236,238,240,241,242,244,245,250,254,259,264,265,266,267,269,271,272,273,274,275);

while (<IN>) {
  chomp;
  @c=();
  my $iter = each_array( @p, @l );
  while (my ($p, $l) = $iter->()) {
    push(@c, substr($_, $p, $l));
  }
  print OUT join(",", @c);
  print OUT "\n";
}

close (OUT);
close (IN);
exit;
{{< /highlight >}}
