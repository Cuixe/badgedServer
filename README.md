# BadgeBuilder

## Descripcion

Inicia un pequeño servidor que funciona como webhook listener, por medio del cual reliza la compilaicón de los proyectos y guarda las metricas generadas, además, puede genear los badges basados en dichas méticas.

Las metricas disponibles son aquellas generadas por el plugin de jacoco:
 - INSTRUCTION
 - BRANCH
 - LINE
 - COMPLEXITY
 - METHOD
 - CLASS

## Instalación

Este proyecto esta desarrollado en Nodejs, así que para funcionar deberá estar instalado nodejs y npm, usualmente esto se consigue vía comandos: https://nodejs.org/en/download/package-manager/ o descargando los binarios https://nodejs.org/en/download/

Para lanzar la instalación se puede usar el shell ```install.sh``` con los parametros: **puerto** **urlGitlab** **tokenPrivado**
El shell, empaquetará el proyecto y lo desempaquetará en el servidor, además de instalar automáticamente las dependencias del proyecto.

## Start & Stop

El proyecto tiene un shell para iniciar **start.sh** y uno para detener **stop.sh**, si durante el start, se recibe un mensaje como este:

```
Error: listen EADDRINUSE :::<port>
```

Eso quiere decir que el puerto esta ocupado, puede ser por otra instancia del componente o por otra aplicación, se puede cambiar el puerto en el archivo de configuración **configuration.properties**

## Webhooks de gitlab

El servidor funciona como un webhook listener, para lo cual pone a disposición 2 links

 - **http://\<IP\>:\<PUERTO\>//webhook/singleProject**
 - **http://\<IP\>:\<PUERTO\>//webhook/multiProject**

### singleProject
Este link funciona cuando los proyectos no tienen módulos o subproyectos

### multiProject
Este link funciona cuando los proyectos sí tienen módulos o subproyectos
### Diferencias
La diferencia entre usar uno u otro radica en la manera en que se compila el proyecto y se generan las métricas ya que para un proyecto simple se ejecuta la tarea **jacocoTestReport** y para los multiproyectos **jacocoMultiprojectReport**

## Generación de badges

Una vez que el componente ha recibido una orden de ejcución (un webhook), este guarda las metricas de covertura así es posible solicitarle que el genere los badges basados en las métircas de jacoco

Para lo cual el link es:

**http://\<IP\>:\<PUERTO\>/jacoco/\<id Proyecto\>/\<metrica\>**

Si la información está disponible, se generará el badge con al información, si es incorrecto se generará otor que indicará que la información no está disponible

Para saber cual es el Id del proyecto, existe un servicio que consulta la información de proyectos basados en un nombre, la url es:

**http://\<IP\>:\<PUERTO\>/git/\<proyect name\>/detail**

Esto mostrará un mensjae json con las coincidencias en el nombre enviado.

## Uso en los proyectos

Una vez configurado el webhook en el proyecto de gitlab, se pueden agregar los badges en el archivo **README.md** las aplicaciones agregar la linea:
```
[![<NombreMetrica>](http://<IP>:<PUERTO>/jacoco/<id Proyecto>/<metrica>)](ttp://<IP>:<PUERTO>/jacoco/<id Proyecto>/<metrica>*)
```
Por ejemplo: 
```
[![<Class Coverage>](http://127.0.0.1:7000/jacoco/431/CLASS)](http://127.0.0.1:7000/jacoco/431/CLASS)
[![<Branc Coverage>](http://127.0.0.1:7000/jacoco/431/BRANCH)](http://127.0.0.1:7000/jacoco/431/BRANCH)
```
Adicionalmente se cuentan con 2 estatus de proyecto:

### Estado de compilación
http://\<IP\>:\<PUERTO\>/jacoco/\<id Proyecto\>/buildStatus 
Muestra el estado de compilación del proyecto en el branch master

### Último tag
http://\<IP\>:\<PUERTO\>/jacoco/\<id Proyecto\>/lastTag 
Muestra cual es el último tag creado en el proyecto

## Utilerias

### Compilación
El componente también permite que se dispare una compilación de algun projecto bajo demanda, esto es con las ligas:

**http://127.0.0.1:7000/build/simple/\<projectId\>** Para proyectos sin subproyectos

**http://127.0.0.1:7000/build/multiple/\<projectId\>** Para proyectos con subproyectos

