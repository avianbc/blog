---
id: 393
title: Sierpinski in OpenGL
date: 2011-11-23T23:35:07-04:00
author: brad
layout: post
guid: http://br4d.net/?p=393
permalink: /sierpinski-in-opengl/
categories:
  - C / C++
  - OpenGL / WebGL
  - Programming
---
[<img src="/images/2015/01/sierpinski-292x300.png" alt="sierpinski" width="292" height="300" class="alignleft size-medium wp-image-394" srcset="/images/2015/01/sierpinski-292x300.png 292w, /images/2015/01/sierpinski.png 489w" sizes="(max-width: 292px) 100vw, 292px" />](/images/2015/01/sierpinski.png)

This is just a simple 2D rendering of the famous [Sierpinski gasket](http://www.wolframalpha.com/input/?i=sierpinski+gasket&a=*C.sierpinski+gasket-_*Formula.dflt-&f2=11&f=SierpinskiGasket.n_11&x=10&y=7).

This was rendered using recursion, simple math, and GL_LINES.

{{< highlight cpp >}}
#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "GL/glut.h"

#include<GL/glut.h>

void sierpinski2d(float vertex1[], float vertex2[], float vertex3[], int current_depth)
{
    float next_vertex1[3],next_vertex2[3],next_vertex3[3];

    //float perimeter = sqrt(vertex1[0]);

    //if(perimeter > 0.01)
    //  return;

    if(current_depth >= 12)
        return;

    glBegin(GL_LINES);
        glVertex3fv(vertex1);
        glVertex3fv(vertex2);
        glVertex3fv(vertex3);
    glEnd();


    next_vertex1[0] = (vertex1[0]+vertex2[0])/2;
    next_vertex1[1] = (vertex1[1]+vertex2[1])/2;
    next_vertex1[2] = (vertex1[2]+vertex2[2])/2;

    next_vertex3[0] = (vertex2[0]+vertex3[0])/2;
    next_vertex3[1] = (vertex2[1]+vertex3[1])/2;
    next_vertex3[2] = (vertex2[2]+vertex3[2])/2;

    next_vertex2[0] = (vertex1[0]+vertex3[0])/2;
    next_vertex2[1] = (vertex1[1]+vertex3[1])/2;
    next_vertex2[2] = (vertex1[2]+vertex3[2])/2;

    sierpinski2d(next_vertex1,vertex1,next_vertex2,current_depth+1);
    sierpinski2d(next_vertex1,vertex2,next_vertex3,current_depth+1);
    sierpinski2d(next_vertex3,vertex3,next_vertex2,current_depth+1);
}

void myInit(void)
{

}

void display(void)
{
    float vertex1[3]={5.0,0.0,0.0};
    float vertex2[3]={-5.0,0.0,0.0};
    float vertex3[3]={0.0,5.0,0.0};
        glClearColor(0.0,0.0,0.0,1.0);
    glClear(GL_COLOR_BUFFER_BIT);
    glColor3f(0.0,0.8,0.0);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(-5.0,5.0,0.0,5.0);
    glMatrixMode(GL_MODELVIEW);

    sierpinski2d(vertex1,vertex2,vertex3,0);
    glFlush();
}

int main(int argc,char **argv)
{
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH );
    glutInitWindowSize(800,800);
    glutInitWindowPosition(10,10);
    glutCreateWindow("Sierpinski 2D");
    myInit();
    glutDisplayFunc(display);
    glutMainLoop();
}
{{< /highlight >}}
