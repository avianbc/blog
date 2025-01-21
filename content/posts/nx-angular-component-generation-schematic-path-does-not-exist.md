+++
date = 2024-10-06T15:48:48-05:00
title = "Nx Angular Component Generation Schematic: Path Does Not Exist"
tags = ['TypeScript', 'JavaScript', 'Angular', 'Nx']
categories = ['Programming']
+++

A few years back, I successfully migrated several Angular libraries and applications from individual projects to a monorepo using [Nx](https://nx.dev/). Nx is a great tool for managing multiple projects and libraries in a single repository.

Nx provides many schematics to generate code and migrate existing code. One of the most common tasks is generating a new Angular component. However, I encountered an issue where the schematic was unable to resolve the path where it was supposed to generate the code.

Here's the error message I encountered:

{{< highlight bash >}}
 *  Executing task: npx nx generate @nx/angular:component --name=foo --project=bar --no-interactive --dry-run

>  NX  Generating @nx/angular:component

 >  NX   The path provided (../../../../..) does not exist under the project root (libs/bar). Please make sure to provide a path that exists under the project root.
{{< /highlight >}}

While migrating projects from Angular version 16 to 17, I found the solution: upgrade the `typescript` package from version `^4` to `^5`.

I believe the actual cause was that Nx schematics generated invalid `tsconfig` files that assumed the use of the newer TypeScript version. For specific details, see this blog post explaining how `tsconfig`s are handled: [Announcing TypeScript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#supporting-multiple-configuration-files-in-extends).
