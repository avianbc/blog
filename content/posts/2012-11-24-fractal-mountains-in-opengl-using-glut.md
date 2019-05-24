---
id: 375
title: Fractal Mountains in OpenGL using GLUT
date: 2012-11-24T00:16:21-04:00
author: brad
layout: post
guid: http://br4d.net/?p=375
permalink: /fractal-mountains-in-opengl-using-glut/
categories:
  - C / C++
  - OpenGL / WebGL
  - Programming
---
[<img src="/images/2015/01/fractalmountains-292x300.png" alt="fractalmountains" width="292" height="300" class="alignleft size-medium wp-image-376" srcset="/images/2015/01/fractalmountains-292x300.png 292w, /images/2015/01/fractalmountains.png 490w" sizes="(max-width: 292px) 100vw, 292px" />](/images/2015/01/fractalmountains.png)

This was a project from my Computer Graphics course at Marshall University. The mountains are randomly generated from a normalized pseudo-random number generator and a fractal function. Every time you resize the windows or launch the program, they are drawn differently.

<!--more-->

This program relies upon GLUT and uses a bitmap for the grass texture. As such, BitmapLoader.h was used to load them into the program for usage. All of these as well as the source code can be found below.

Dependencies:

  * [GLUT Official Site](http://user.xmission.com/~nate/glut.html)
  * [Download BitmapLoader.h](/images/2015/01/BitmapLoader.h)
  * [Download grass.bmp texture](/images/2015/01/grass.bmp)

{{< highlight cpp >}}
#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <GL/glut.h>
#include <math.h>
#include "BitmapLoader.h"
using namespace std;

double tolerance = 0.015;
double lightPos[3] = {50,35,1.95};
BITMAPINFOHEADER myBitmap1, myBitmap2;
unsigned char *mytexture1, *mytexture2;
void createTexture1(unsigned char *mytexture1, BITMAPINFOHEADER myBitmap1);
void createTexture2(unsigned char *mytexture2, BITMAPINFOHEADER myBitmap2);
double randomNormal (double mu, double sigma);
void fracMountain(float x1, float y1, float z1, float x2, float y2, float z2, float x3, float y3, float z3, float x4, float y4, float z4);


double randomNormal (double mu, double sigma)
{
  double sum = 0;
  for(int i = 0; i < 12; i++)
    sum = sum + (double)rand()/RAND_MAX;
  sum -= 6;
  return sigma*sum + mu;
}

void createTexture1(unsigned char *mytexture1, BITMAPINFOHEADER myBitmap1)
{
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,myBitmap1.biWidth,myBitmap1.biHeight,0,GL_RGB, GL_UNSIGNED_BYTE, mytexture1);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

void draw_circle(double radius, double xLoc, double yLoc)
{
    double theta = 0;
    double increment = (10*3.14159265)/180; // 10 degrees
    glBegin(GL_POLYGON);
    for(int i=0; i<36; i++)
    {
        float x = radius*cos(theta) + xLoc;
        float y = radius*sin(theta) + yLoc;
        glVertex2f(x,y);
        theta+=increment;
    }
    glEnd();
}

void fracMountain(float x1, float y1, float z1, float x2, float y2, float z2, float x3, float y3, float z3, float x4, float y4, float z4)
{
    double perim = sqrt((x2-x1)*(x2-x1) + (z2-z1)*(z2-z1)) + sqrt((x3-x2)*(x3-x2) + (z3-z2)*(z3-z2))
        + sqrt((x4-x3)*(x4-x3) + (z4-z3)*(z4-z3)) + sqrt((x1-x4)*(x1-x4) + (z1-z4)*(z1-z4));
    if(perim <= tolerance)
    {
        double v1=x2-x1, v2=y2-y1, v3=z2-z1;
        double w1=x3-x2, w2=y3-y2, w3=z3-z2;
        double crossx=v2*w3-w2*v3;
        double crossy=v3*w1-w3*v1;
        double crossz=v1*w2-w1*v2;

        double tolightx=lightPos[0]-x1;
        double tolighty=lightPos[1]-y1;
        double tolightz=lightPos[2]-z1;

        double dot =crossx*tolightx +crossy*tolighty +crossz*tolightz;
        double normc=sqrt(crossx*crossx +crossy*crossy + crossz*crossz);
        double norml = sqrt(tolightx*tolightx + tolighty*tolighty + tolightz*tolightz);

        double lightamt=dot/(normc*norml);
        if(lightamt>1)
            lightamt=1;
        if(lightamt<0)
            lightamt=0.5;

        lightamt=(lightamt*2 +0.15)/2.15;
        glColor3f(lightamt,lightamt,lightamt);
        glBegin(GL_POLYGON);
            glVertex3f(x1,y1,z1);
            glVertex3f(x2,y2,z2);
            glVertex3f(x3,y3,z3);
            glVertex3f(x4,y4,z4);
        glEnd();
    }
    else
    {
        double r1 = (double)randomNormal(0.041, 0.1);
        double r2 = (double)randomNormal(0.0,   0.01);
        double r3 = (double)randomNormal(0.0,   0.01);
        double xmid = ((x1+x2+x3+x4)/4)+r2*perim;
        double ymid = ((y1+y2+y3+y4)/4)+r1*perim;
        if(ymid<0)
            ymid=0;
        double zmid = ((z1+z2+z3+z4)/4)+r3*perim;
        fracMountain(x1,y1,z1,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2,xmid,ymid,zmid,(x1+x4)/2,(y1+y4)/2,(z1+z4)/2);
        fracMountain((x1+x4)/2,(y1+y4)/2,(z1+z4)/2,xmid,ymid,zmid,(x4+x3)/2,(y4+y3)/2,(z4+z3)/2,x4,y4,z4);
        fracMountain((x1+x2)/2,(y1+y2)/2,(z1+z2)/2,x2,y2,z2,(x2+x3)/2,(y2+y3)/2,(z2+z3)/2,xmid,ymid,zmid);
        fracMountain(xmid,ymid,zmid,(x2+x3)/2,(y2+y3)/2,(z2+z3)/2,x3,y3,z3,(x3+x4)/2,(y3+y4)/2,(z3+z4)/2);
    }
}

void init()
{
    mytexture1 = LoadBitmapFile("grass.bmp", &myBitmap1);
    if(mytexture1==NULL)
    {
        printf("grass load failed\n");
        int w;
        scanf_s("%i",&w);
        exit(0);
    }
    else
        printf("grass.bmp load succeeded\n");

    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glClearColor(0.2, 0.2, 0.2, 0);
    glOrtho(-0.5,1.5,-0.25,2,-5,1.95); // l r b t n f
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glColor3f(0.2, 0.2, 0.2);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glRotatef(25,1,0,0);
    glRotatef(15,0,1,0);
    glColor3f(1.0,1.0,1.0);
    draw_circle(0.2,1.44,1);


    glColor3f(0.0,0.4,0.0);
    createTexture1(mytexture1, myBitmap1);
    glBegin(GL_POLYGON);
        glTexCoord2f(0,0); glNormal3f(0,1,0); glVertex3f(-1,0,-5);
        glTexCoord2f(0,1); glNormal3f(0,1,0); glVertex3f(-1,0,1);
        glTexCoord2f(1,1); glNormal3f(0,1,0); glVertex3f(2,0,1);
        glTexCoord2f(1,0); glNormal3f(0,1,0); glVertex3f(2,0,-5);
    glEnd();
    glColor3f(1,1,1);
    fracMountain(0.8,0.0,-2,  0.8,0.0,-1,  2.0,0.0,-1,  2.0,0.0,-2);
    fracMountain(-0.85,0.0,-1.0,  -0.85,0.0,0.0,  0.85,0.0,0.0,  0.85,0.0,-1.0);
    glFlush();
}

int main(int argc, char** argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(800,800);
    glutCreateWindow("CS370 Final Project");
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB );
    glutDisplayFunc(display);
    init();
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
