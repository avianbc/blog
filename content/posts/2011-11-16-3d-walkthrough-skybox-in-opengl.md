---
id: 396
title: 3D Walkthrough Skybox in OpenGL
date: 2011-11-16T23:38:29-04:00
author: brad
layout: post
guid: http://br4d.net/?p=396
permalink: /3d-walkthrough-skybox-in-opengl/
categories:
  - C / C++
  - OpenGL / WebGL
  - Programming
---
[<img src="/images/2015/01/walkthrough-292x300.png" alt="walkthrough" width="292" height="300" class="float-right size-medium wp-image-397" srcset="/images/2015/01/walkthrough-292x300.png 292w, /images/2015/01/walkthrough.png 490w" sizes="(max-width: 292px) 100vw, 292px" />](/images/2015/01/walkthrough.png)

This is a walkthrough with a bunch of random items. Included are: a giant pyramid (hide it by pressing the p key!), a snowman, a bird, a torus, a rotating texture, and a golden spiral of teapots in the background.

Look at the myKeyboard() function to see what keys move. This program also relies upon texture.bmp as well as grass.bmp and BitmapLoader.h in order to run.

Dependencies:

  * [Download grass.bmp](/images/2015/01/grass.bmp)
  * [Download BitmapLoader.h](/images/2015/01/BitmapLoader.h)

{{< highlight cpp >}}
// Bradley Carey
// 11/16/2011

#include "stdafx.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "GL/glut.h"
#include "BitmapLoader.h"

void init();
void display();
void myIdle();
void createTexture1(unsigned char *mytexture1, BITMAPINFOHEADER myBitmap1);
void createTexture2(unsigned char *mytexture2, BITMAPINFOHEADER myBitmap2);
float randf(float a, float b);
int main(int argc, char** argv);
double eyeX = 30, eyeY = 0, eyeZ = 60, atX = 0, atY = 0, atZ = 0, theta =0;
float rotation = -90;
bool draw = true;
BITMAPINFOHEADER myBitmap1, myBitmap2;
unsigned char *mytexture1, *mytexture2;

void createTexture1(unsigned char *mytexture1, BITMAPINFOHEADER myBitmap1)
{
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,myBitmap1.biWidth,myBitmap1.biHeight,0,GL_RGB, GL_UNSIGNED_BYTE, mytexture1);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

void createTexture2(unsigned char *mytexture2, BITMAPINFOHEADER myBitmap2)
{
    glEnable(GL_TEXTURE_2D);
    glTexImage2D(GL_TEXTURE_2D,0,3,myBitmap2.biWidth,myBitmap2.biHeight,0,GL_RGB, GL_UNSIGNED_BYTE, mytexture2);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
    glTexParameterf(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
}

float randf(float a, float b)
{
    return ((b-a)*((float)rand()/RAND_MAX))+a;
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

    mytexture2 = LoadBitmapFile("texture.bmp", &myBitmap2);
    if(mytexture2==NULL)
    {
        printf("texture load failed\n");
        int w;
        scanf_s("%i",&w);
        exit(0);
    }
    else
        printf("texture.bmp load succeeded\n");

    GLfloat light_ambient[] = {0.2, 0.2, 0.2, 1.0};
    GLfloat light_diffuse[] = {0.8, 0.8, 0.8, 1.0};
    GLfloat light_position[] = {1.0, 20.0, 2.0, 0.0};
    GLfloat light_specular[] = {0.5, 0.5, 0.5, 1.0};

    glLightfv(GL_LIGHT0, GL_AMBIENT, light_ambient);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, light_diffuse);
    glLightfv(GL_LIGHT0, GL_POSITION, light_position);
    glLightfv(GL_LIGHT0, GL_POSITION, light_specular);

    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_DEPTH_TEST);

    glClearColor(0.0, 0.0, 0.4, 0);
    glMatrixMode(GL_PROJECTION);
    gluPerspective(60, 1, 1, 8000);
}

void display()
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    gluLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, 0, 1, 0);

    //glRotatef(theta, 0, 1, 0);

    float white[] = {1, 1, 1, 1.0};
    float red[] = {1, 0, 0, 1.0};
    float green[] = {0, 0.8, 0.1, 1.0};
    float blue[] = {0, 0, 1, 1.0};
    float brown[] = {0.64, 0.16, 0.16, 1.0};
    float gold[] = {0.8, 0.49, 0.19, 1.0};
    float orange[] = {1, 0.5, 0, 1.0};

    ////begin pyramid
    if(draw)
    {
    glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, gold);
    glBegin(GL_TRIANGLE_FAN);
        glVertex3f(  0.0f,  30.0f, 0.0f);
        glVertex3f(-50.0f, -50.0f, 50.0f);
        glVertex3f( 50.0f, -50.0f, 50.0f);
        glVertex3f( 50.0f, -50.0f, -50.0f);
        glVertex3f( -50.0f, -50.0f, -50.0f);
        glVertex3f(-50.0f, -50.0f, 50.0f);
    glEnd();
    }

    //begin stairs
    for(int i=10; i>1; i--)
    {
    glPushMatrix();
        float rand0m[] = {randf(0,1), randf(0,1), randf(0,1), 1.0};
        glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, rand0m);
        glTranslatef(8,(10-i)-9.5,8);
        glutSolidCube(i);
    glPopMatrix();
    }

    //begin cones
    for(int i=19; i>1; i--)
    {
    glPushMatrix();
        glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, red);
        glRotatef(10*i,0,0,1);
        glRotatef(40,0,1,0);
        glTranslatef(0,(10-i),8);
        glutSolidCone(1,4,10,10);
    glPopMatrix();
    }

    //begin teapots
    for(int i=30; i>1; i--)
    {
    glPushMatrix();
        glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, white);
        glRotatef(4*i,0,0,1);
        glTranslatef(0,(10-i)+80,-200);
        glutSolidTeapot(1);
    glPopMatrix();
    }

    // this is a texture
    glPushMatrix();
        createTexture2(mytexture2, myBitmap2);
        glRotatef(theta,0,1,0);
        glRotatef(90,0,0,1);
        glBegin(GL_POLYGON);
            glTexCoord2f(1,0); glNormal3f(0,0,1); glVertex3f(-4, 4, 0);
            glTexCoord2f(0,0); glNormal3f(0,0,1); glVertex3f(-4,-4, 0);
            glTexCoord2f(0,1); glNormal3f(0,0,1); glVertex3f( 4,-4, 0);
            glTexCoord2f(1,1); glNormal3f(0,0,1); glVertex3f( 4, 4, 0);
        glEnd();
    glPopMatrix();

    //begin donut
    glPushMatrix();
        glTranslatef(10,5,10);
        glRotatef(theta,1,1,1);
        glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, orange);
        glutSolidTorus(0.8, 2, 40, 50);
    glPopMatrix();

    //begin snowman
    glMaterialfv(GL_FRONT, GL_AMBIENT_AND_DIFFUSE, white);
    glPushMatrix();  //head
        glTranslatef(10,2.3-1,0);
        glutSolidSphere(1,20,20);
    glPopMatrix();

    glPushMatrix(); //middle
        glTranslatef(10,0.5-1,0);
        glutSolidSphere(1.5,20,20);
    glPopMatrix();

    glPushMatrix(); //bottom
        glTranslatef(10,-2-1,0);
        glutSolidSphere(2,20,20);
    glPopMatrix();

    //begin ground
    createTexture1(mytexture1, myBitmap1);
    glBegin(GL_POLYGON);
        glTexCoord2f(0,0); glNormal3f(0,1,0); glVertex3f(-200,-5,-200);
        glTexCoord2f(0,1); glNormal3f(0,1,0); glVertex3f(-200,-5,200);
        glTexCoord2f(1,1); glNormal3f(0,1,0); glVertex3f(200,-5,200);
        glTexCoord2f(1,0); glNormal3f(0,1,0); glVertex3f(200,-5,-200);
    glEnd();
    glutSwapBuffers();
}

void myIdle()
{
    theta += 2;
    if(theta > 360)
        theta -= 360;
    glutPostRedisplay();
}

void myKeyboard(unsigned char c, int x, int y)
{
    switch(c)
    {
        case 'x': eyeX -= 0.3; atX -= 0.3; break;
        case 'X': eyeX += 0.3; atX += 0.3; break;
        case 'y': eyeY -= 0.3; atY -= 0.3; break;
        case 'Y': eyeY += 0.3; atY += 0.3; break;
        case 'z': eyeZ -= 0.3; atZ -= 0.3; break;
        case 'Z': eyeZ += 0.3; atZ += 0.3; break;
        case 'd': atX -= 0.3; break;
        case 'a': atX += 0.3; break;
        case 'u': atY -= 0.3; break;
        case 'q': atY += 0.3; break;
        case 's': atZ -= 0.3; break;
        case 'w': atZ += 0.3; break;
        case 'p': draw = false; break;
    }
    glutPostRedisplay();
}

void mySpecialFunc(int key, int x, int y)
{
    double oneDeg = 3.14159/180.0;
    double length = 0, deltaX = 0, deltaZ = 0, angle, amount = 0.005;
    switch(key)
    {
        case GLUT_KEY_LEFT:
            rotation += 1;
            if(rotation > 360.0)
                rotation -= 360.0;
            atX = cos(oneDeg)*(atX-eyeX) + sin(oneDeg)*(atZ-eyeZ) + eyeX;
            atZ = -sin(oneDeg)*(atX-eyeX) + cos(oneDeg)*(atZ-eyeZ) + eyeZ;
            break;

        case GLUT_KEY_RIGHT: //rotate at point to viewer's right
            rotation -= 1;
            if(rotation > 360.0)
                rotation -= 360.0;
            atX = cos(-oneDeg)*(atX-eyeX) + sin(-oneDeg)*(atZ-eyeZ) + eyeX;
            atZ = -sin(-oneDeg)*(atX-eyeX) + cos(-oneDeg)*(atZ-eyeZ) + eyeZ;
            break;

        case GLUT_KEY_UP: //move viewer forward
            length = sqrt((atX - eyeX)*(atX - eyeX)
            + (atY - eyeY)*(atY - eyeY)
            + (atZ - eyeZ)*(atZ - eyeZ));
            angle = (3.14159/180.0)*rotation; //convert rotation to radians
            deltaX = amount*cos(angle)*length;
            deltaZ = amount*sin(angle)*length;
            eyeX += deltaX;
            eyeZ += deltaZ;
            atX += deltaX;
            atZ += deltaZ;
            break;

        case GLUT_KEY_DOWN: //move viewer down
            length = sqrt((atX - eyeX)*(atX - eyeX)
            + (atY - eyeY)*(atY - eyeY)
            + (atZ - eyeZ)*(atZ - eyeZ));
            angle = (3.14159/180.0)*rotation; //convert rotation to radians
            deltaX = amount*cos(angle)*length;
            deltaZ = amount*sin(angle)*length;
            eyeX -= deltaX;
            eyeZ -= deltaZ;
            atX -= deltaX;
            atZ -= deltaZ;
            break;
    }
    glutPostRedisplay();
}

int main(int argc, char** argv)
{
    glutInit(&argc,argv);
    glutInitDisplayMode(GLUT_DOUBLE);
    glutInitWindowSize(800,800);
    glutInitWindowPosition(10,10);
    glutCreateWindow("Walkthrough");
    glutDisplayFunc(display);
    glutIdleFunc(myIdle);
    glutSpecialFunc(mySpecialFunc);
    glutKeyboardFunc(myKeyboard);
    init();
    glutMainLoop();
    return 0;
}
{{< /highlight >}}
