---
id: 390
title: 3D Wireframe Solids in OpenGL using GLUT
date: 2011-11-23T23:33:56-04:00
author: brad
layout: post
guid: http://br4d.net/?p=390
permalink: /3d-wireframe-solids-in-opengl-using-glut/
categories:
  - C / C++
  - OpenGL / WebGL
  - Programming
---
[<img src="/images/2015/01/3dwireframesolids-292x300.png" alt="3dwireframesolids" width="292" height="300" class="alignleft size-medium wp-image-391" srcset="/images/2015/01/3dwireframesolids-292x300.png 292w, /images/2015/01/3dwireframesolids.png 489w" sizes="(max-width: 292px) 100vw, 292px" />](/images/2015/01/3dwireframesolids.png)

This is esentially the same thing as the code from 3D wireframe except now it has textures. Instead of GL\_LINE\_LOOP as in the last example, the solid was rendered using GL_POLYGON and colored accordingly.

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
    glColor3f(1.0,1.0,1.0);
    GLfloat light_specular[] = {1.0,1.0,1.0,1.0};
    GLfloat light_diffuse[] = {1.0, 0.8, 1.0, 1.0};
    GLfloat light_ambient[] = {0.9, 0.9, 0.71, 1.0};
    GLfloat light_position[] = {0.0, 8.0, 20.0, 0.0};
    glLightfv(GL_LIGHT0, GL_AMBIENT, light_ambient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, light_diffuse);
    glLightfv(GL_LIGHT0, GL_SPECULAR, light_specular);
    glLightfv(GL_LIGHT0, GL_POSITION, light_position);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_DEPTH_TEST);
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
            norm[k] /= sqrt(d);
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
            glBegin(GL_POLYGON);
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
            glBegin(GL_POLYGON);
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
    glutCreateWindow("3D Wireframe Solids with Lighting");
    glutDisplayFunc(display);
    glutIdleFunc(myIdle);
    init();
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
