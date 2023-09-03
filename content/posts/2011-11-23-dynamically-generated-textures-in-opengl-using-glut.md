---
id: 380
title: Dynamically Generated Textures in OpenGL using GLUT
date: 2011-11-23T23:29:12-04:00
author: brad
layout: post
guid: http://br4d.net/?p=380
permalink: /dynamically-generated-textures-in-opengl-using-glut/
categories:
  - Programming
tags:
  - C
  - C++
  - OpenGL
  - Procedural Generation
  - WebGL
---
<div class="pull-left" style="padding:10px;">
  <a href="/images/2015/01/dynamictextures.png"><img src="/images/2015/01/dynamictextures-290x300.png" alt="dynamictextures" width="290" height="300" class="alignnone size-medium wp-image-381" srcset="/images/2015/01/dynamictextures-290x300.png 290w, /images/2015/01/dynamictextures.png 351w" sizes="(max-width: 290px) 100vw, 290px" /></a>
</div>

The textures in this small program were generated procedurally and added to 3 sides of a cube. If you look at the sourcem the createTexture functions actually create the three textures. After created, the textures are then added onto a GL_POLYGON. Finally, simple lighting and rotation is added.

{{< highlight cpp >}}
#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "GL/glut.h"

void createTexture1(GLubyte image1[64][64][3]);
void createTexture2(GLubyte image1[64][64][3]);
void createTexture3(GLubyte image1[64][64][3]);
void myinit();
void display();
//void myReshape(int w, int h);
void idle();
int main(int argc, char** argv);

#define PI 3.141592653
typedef float point3[4];
double theta=0, beta=40, r=6;
float xMin=-4, xMax=4, yMin=-4, yMax =4, zMin=-6, zMax=6;
int n=32, m=32;
GLubyte image1[64][64][3];
GLubyte image2[64][64][3];

void createTexture1(GLubyte image1[64][64][3]) // checkerboard
{
    int row, col;
    for(int i=0; i<16; i++)
    {
        for(int j=0; j<16; j++)
        {
            row = i*4;
            col = j*4;
            int c1, c2, c3;
            for(int k = row; k < row+4; k++)
            {
                for(int l = col; l<col+4; l++)
                {
                    if((i+j)%2==0)
                    {
                        c1=128; c2=128; c3=128;
                    }
                    else
                    {
                        c1=255; c2=255; c3=255;
                    }
                    image1[k][l][0]=(GLubyte)c1;
                    image1[k][l][1]=(GLubyte)c2;
                    image1[k][l][2]=(GLubyte)c3;
                }
            }
        }
    }
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,64,64,0,GL_RGB, GL_UNSIGNED_BYTE, image1);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

void createTexture2(GLubyte image1[64][64][3]) // blue flag
{
    for (int k=0; k<64; k++)
    {
        for(int l=0; l<64; l++)
        {
            if((l >= 0 && l <= 8) || (l >= 16 && l <= 24) || (l >= 32 && l <= 40) || (l >= 48 && l <= 56) )
            {
                image1[k][l][0]=255;
                image1[k][l][1]=100;
                image1[k][l][2]=0;
            } else {
                image1[k][l][0]=0;
                image1[k][l][1]=100;
                image1[k][l][2]=0;
            }
        }
    }
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,64,64,0,GL_RGB, GL_UNSIGNED_BYTE, image1);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

void createTexture3(GLubyte image1[64][64][3])
{
    for (int k=0; k<64; k++)
    {
        for(int l=0; l<64; l++)
        {
            if(k<l)
            {
                image1[k][l][0]=100;
                image1[k][l][1]=255;
                image1[k][l][2]=0;
            } else {
                image1[k][l][0]=255;
                image1[k][l][1]=255;
                image1[k][l][2]=255;
            }
        }
    }
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,64,64,0,GL_RGB, GL_UNSIGNED_BYTE, image1);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

void myinit()
{
    GLfloat light_ambient[] = {0.75, 0.75, 0.75, 1.0};
    GLfloat light_diffuse[] = {1.0, 1.0, 1.0, 1.0};
    GLfloat light_specular[] = {1.0, 0.0, 0.0, 1.0};
    GLfloat light_position[] = {0.0, 0.0, 28.0, 0.0};
    glLightfv(GL_LIGHT0, GL_AMBIENT, light_ambient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, light_diffuse);
    glLightfv(GL_LIGHT0, GL_SPECULAR, light_specular);
    glLightfv(GL_LIGHT0, GL_POSITION, light_position);
    float lmodel_ambient[] = {0.5, 0.5, 0.5, 1.0};
    //glLightModelfv(GL_LIGHT_MODEL_AMBIENT, lmodel_ambient);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_DEPTH_TEST);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(xMin, xMax, yMin, yMax, zMin, zMax);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glRotatef(20, 1, 0, 0);
    glTranslatef(1, 0, 0);
    glRotatef(theta, 0, 1, 0);
    glTranslatef(-1, 0, 0);
    createTexture2(image2); // side 1
    glBegin(GL_POLYGON);
        glTexCoord2f(0,0); glNormal3f(0,0,1); glVertex3f(-2,-2,0);
        glTexCoord2f(0,1); glNormal3f(0,0,1); glVertex3f(2,-2,0);
        glTexCoord2f(1,1); glNormal3f(0,0,1); glVertex3f(2,2,0);
        glTexCoord2f(1,0); glNormal3f(0,0,1); glVertex3f(-2,2,0);
    glEnd();
    createTexture1(image1); // side 2
    glBegin(GL_POLYGON);
        glTexCoord2f(0,0); glNormal3f(0,1,0); glVertex3f(2,-2,0);
        glTexCoord2f(0,1); glNormal3f(0,1,0); glVertex3f(2,2,0);
        glTexCoord2f(1,1); glNormal3f(0,1,0); glVertex3f(2,2,-4);
        glTexCoord2f(1,0); glNormal3f(0,1,0); glVertex3f(2,-2,-4);
    glEnd();
    createTexture3(image2); // side 3
    glBegin(GL_POLYGON);
        glTexCoord2f(0,0); glNormal3f(1,0,0); glVertex3f(-2,-2,-4);
        glTexCoord2f(0,1); glNormal3f(1,0,0); glVertex3f(2,-2,-4);
        glTexCoord2f(1,1); glNormal3f(1,0,0); glVertex3f(2,2,-4);
        glTexCoord2f(1,0); glNormal3f(1,0,0); glVertex3f(-2,2,-4);
    glEnd();
    //createTexture1(image1); // side 4
    //glBegin(GL_POLYGON);
    //  glTexCoord2f(0,0); glNormal3f(0,0,1); glVertex3f(-2,-2,0);
    //  glTexCoord2f(0,1); glNormal3f(0,0,1); glVertex3f(2,-2,-4);
    //  glTexCoord2f(1,1); glNormal3f(0,0,1); glVertex3f(-2,-2,-4);
    //  glTexCoord2f(1,0); glNormal3f(0,0,1); glVertex3f(-2,-2,0);
    //glEnd();
    glutSwapBuffers();
}

void idle()
{
    theta += 0.25;
    if(theta > 360)
        theta -= 360;
    glutPostRedisplay();
}

int main(int argc, char** argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(800,800);
    glutInitWindowPosition(50,50);
    glutCreateWindow("Texture Map, 10-2b");
    myinit();
    glutDisplayFunc(display);
    glutIdleFunc(idle);
    //glutReshapeFunc(myReshape);
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
