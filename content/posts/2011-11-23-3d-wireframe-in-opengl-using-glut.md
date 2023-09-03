---
id: 386
title: 3D Wireframe in OpenGL using GLUT
date: 2011-11-23T23:32:12-04:00
author: brad
layout: post
guid: http://br4d.net/?p=386
permalink: /3d-wireframe-in-opengl-using-glut/
categories:
  - Programming
tags:
  - C
  - C++
  - OpenGL
  - WebGL
---
[<img class="float-right size-medium wp-image-387" src="/images/2015/01/3dwireframe-292x300.png" alt="3dwireframe" width="292" height="300" srcset="/images/2015/01/3dwireframe-292x300.png 292w, /images/2015/01/3dwireframe.png 490w" sizes="(max-width: 292px) 100vw, 292px" />](/images/2015/01/3dwireframe.png)

The wireframe you see here is nothing more than the 3d plot of the function [f(x,z) = 4\*cos(sqrt(x\*x+z*z))](http://www.wolframalpha.com/input/?i=plot+4*cos%28sqrt%28x*x%2Bz*z%29%29+from+-6+to+6) rendered using GL\_LINE\_LOOP and a little math. As of now, is is still untextured and without lighting. Though in 3D Wireframe Solids, I added that functionality as well.

{{< highlight cpp >}}
#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "GL/glut.h"

void init();
void display();
void myIdle();
int main(int argc, char** argv);
float f(double x, double z);
void normalVector(float x, float y, float z, float *norm);

float thetaY = 0;
float thetaX = 20;
float increment = 0.5;
float xNear = -6, xFar = 6, yNear = -6, yFar = 6, zNear = -6, zFar = 6;
float n = 50, m = 50;

void init()
{
    glClearColor(1.0, 1.0, 1.0, 0);
    glMatrixMode(GL_PROJECTION);
    glOrtho(xNear, xFar, yNear, yFar, zNear, zFar);
    glColor3f(0.0,0.0,1.0);

}

float f(double x, double z)
{
    return 4*cos(sqrt(x*x+z*z));
}

void normalVector(float x, float y, float z, float *norm)
{
    norm[0] = 4*sin(sqrt(x*x+z*z))*x/sqrt(x*x+z*z);
    norm[1] = 1;
    norm[2] = 4*sin(sqrt(x*x+z*z))*z/sqrt(x*x+z*z);
    float d = norm[0]*norm[0] + norm[1]*norm[1] + norm[2]*norm[2];
    if(d > 0)
        for (int k = 0; k < 3; k++)
            norm[k]/=sqrt(d);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glRotatef(thetaX,1,0,0);
    glRotatef(thetaY,0,1,0);
    float norm[3];
    double xGap=(xNear-xFar)/n;
    double zGap=(zNear-zFar)/m;
    for (int i=0; i<n; i++)
    {
        for (int j=0; j<m; j++)
        {
            glBegin(GL_LINE_LOOP);
                float x = xFar + i*xGap;
                float z = zFar + j*zGap;
                float y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
                x = xFar + i*xGap;
                z = zFar + (j+1)*zGap;
                y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
                x = xFar + (i+1)*xGap;
                z = zFar + (j+1)*zGap;
                y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
            glEnd();
            glBegin(GL_LINE_LOOP);
                x = xFar + i*xGap;
                z = zFar + j*zGap;
                y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
                x = xFar + (i+1)*xGap;
                z = zFar + (j+1)*zGap;
                y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
                x = xFar + (i+1)*xGap;
                z = zFar + (j)*zGap;
                y = f(x,z);
                glVertex3f(x,y,z);
                normalVector(x,y,z,norm);
                glNormal3fv(norm);
            glEnd();
        }
    }
    glutSwapBuffers();
}

void myIdle()
{
    double zzz=0;
    thetaY += increment;
    if(thetaY > 360.0)
        thetaY -= 360.0;
    for (int i=0; i<1000000; i++)
        zzz = sqrt((double)i);
    glutPostRedisplay();
}

int main(int argc, char** argv)
{
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB);
    glutInitWindowSize(800,800);
    glutInitWindowPosition(10,10);
    glutCreateWindow("3D Wireframe Solids");
    glutDisplayFunc(display);
    glutIdleFunc(myIdle);
    init();
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
