---
id: 383
title: Dynamic Lighting in OpenGL using GLUT
date: 2011-11-23T23:30:35-04:00
author: brad
layout: post
guid: http://br4d.net/?p=383
permalink: /dynamic-lighting-in-opengl-using-glut/
categories:
  - Programming
tags:
  - C
  - C++
  - OpenGL
  - WebGL
---
<div class="pull-left" style="padding:`0px;">
  <a href="/images/2015/01/dynamiclighting.png"><img src="/images/2015/01/dynamiclighting.png" alt="dynamiclighting" width="218" height="183" class="alignnone size-full wp-image-384" /></a>
</div>

This is a simple program to show dynamic lighting. The heavy lifting is done in the shadePolygons() function which determines the luminosity of the surface of the cube according to the angle.

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
void shadePolygons(double x[], double y[], double z[], double kr, double kg, double kb);

float xNear = -3, xFar = 3, yNear = -3, yFar = 3, zNear = 3, zFar = -3;
double lightPos[3] = {-60, 10, 20};
double Id = 4.0;
double Ia = 1.0;
int direction = 1;

void shadePolygons(double x[], double y[], double z[], double kr, double kg, double kb)
{
    float vx = x[1] - x[0];
    float vy = y[1] - y[0];
    float vz = z[1] - z[0];

    float wx = x[2] - x[1];
    float wy = y[2] - y[1];
    float wz = z[2] - z[1];

    float Nx = vy*wz-vz*wy;
    float Ny = vx*wz-vz*wx;
    float Nz = vx*wy-vy*wx;

    float Lx = lightPos[0] - ((x[0]+x[1])/2);
    float Ly = lightPos[1] - ((y[0]+y[1])/2);
    float Lz = lightPos[2] - ((z[0]+z[1])/2);

    float LdotN = (Lx*Nx)+(Ly*Ny)+(Lz*Nz);
    float normL = sqrt(Lx*Lx + Ly*Ly + Lz*Lz);
    float normN = sqrt(Nx*Nx + Ny*Ny + Nz*Nz);

    float lightAmt = ( (LdotN*Id)/(normL*normN) );
    lightAmt = lightAmt + Ia;
    lightAmt = lightAmt / (Ia+Id);
    glColor3f(kr*lightAmt, kg*lightAmt, kb*lightAmt);
    glBegin(GL_POLYGON);
        glVertex3f(x[0], y[0], z[0]);
        glVertex3f(x[1], y[1], z[1]);
        glVertex3f(x[2], y[2], z[2]);
        glVertex3f(x[3], y[3], z[3]);
    glEnd();
}

void init()
{
    glClearColor(0, 0, 0, 0);
    glMatrixMode(GL_PROJECTION);
    glOrtho(xNear, xFar, yNear, yFar, zNear, zFar);
    glRotatef(30, -1, 1, 0);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glMatrixMode(GL_MODELVIEW);
    glColor3f(1,1,1);

    char title[15];
    sprintf(title,"%f", lightPos[0]);
    glutSetWindowTitle(title);

    double face1x[] = {0,0,1,1};
    double face1y[] = {0,0,0,0};
    double face1z[] = {0,-1,-1,0};
    shadePolygons(face1x,face1y,face1z,1,0,0);

    double face2x[] = {0,0,1,1};
    double face2y[] = {0,-1,-1,0};
    double face2z[] = {-1,-1,-1,-1};
    shadePolygons(face2x,face2y,face2z,0,1,0);

    double face3x[] = {1,1,1,1};
    double face3y[] = {0,-1,-1,0};
    double face3z[] = {-1,-1,0,0};
    shadePolygons(face3x,face3y,face3z,1,1,1);

    double face4x[] = {0,0,1,1};
    double face4y[] = {-1,-1.5,-1.5,-1};
    double face4z[] = {-1,-1.5,-1.5,-1};
    shadePolygons(face4x,face4y,face4z,1,1,0);

    double face5x[] = {1,1,2,2};
    double face5y[] = {0,-1,-1,0};
    double face5z[] = {0,0,0,0};
    shadePolygons(face5x,face5y,face5z,0,0,1);
    glutSwapBuffers();
}

void myIdle()
{
    lightPos[0] = lightPos[0]+direction;
    if(lightPos[0] >= 60)
        direction = direction*(-1);
    if(lightPos[0] <= -60)
        direction = direction*(-1);
    double zzz=0;
    for (int i=0; i<2000000; i++)
        zzz = sqrt((double)i);
    glutPostRedisplay();
}

int main(int argc, char** argv)
{
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_DOUBLE|GLUT_RGB);
    glutInitWindowSize(400,400);
    glutInitWindowPosition(20,20);
    glutCreateWindow("Shader Lab");
    glutDisplayFunc(display);
    glutIdleFunc(myIdle);
    init();
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
