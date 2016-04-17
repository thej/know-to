# Docker Overview

## What is docker?
- container based virtualization, uses the kernel on the host's OS to run multiple guest instances
- each guest instance is called a **container**
- each container has its own:
  - root filesystem
  - processes
  - memory
  - devices
  - network ports
- each container has its own libraries


## Benefits of Docker
- portable between platforms
- not a VM: only contains the application + required libraries
- Scalability: easily spin uo new containers if needed
- run more apss on one host machine


## Docker concepts and terminology

### Docker Engine
- daemon that enables containers to be built, shipped and run
- uses Linux kernel namespaces and control groups (cgroups)
- namespaces give us the isolated workspace

#### Namespaces used:
- pid
- net
- ipc
- mnt
- uts


### Docker containers and images

#### Images
- read-only template to create containers
- built by you or other Docker-users
- stored in the Docker Hub or local registry
- inside a registry are multiple repositories, that can contain multiple images

#### Containers
- Isolated application platform
- Contains everything needed to run your application
- base on one or more images


### Docker Hub
- App store for docker 


## Docker Orchastration

3 tools for orchastrating distributed applications:

1. **Docker Machine**: Tool that provisions Docker hosts and installs the Docker engine on them
2. **Docker Swarm**: Tool that clusters many Engines and schedules containers
3. **Docker Compose**: Tool to create and manage multi-container applications

## Docker Images


# Docker Fundamentals

`docker commit [options] [container ID] [repository[:tag]]` saves changes to a container

Example:

`docker commit 25442324 thej/myapplication:1.0`

Show docker containers
`docker ps -a`

Start image as daemon:
`docker run -d nginx`

Start a container using container ID
`docker start <container ID>`

Stop a container using container ID
`docker stop <container ID>`

Start another process within a container:
`docker exec -ti [container ID] /bin/bash` starts a bash shell
Note: Exiting from the terminal will not terminate the container

Delete container
`docker rm <container ID>`

Delete images
`docker rmi [imageID|repo]`



## Dockerfile

- each `RUN` forces a new commit
- no new commit if you chain commands with `&&`
- `ENTRYPOINT` runs command that cant't be overwritten by paramaters. Instead, paramaters are passed as parameters to the ENTRYPOINT instruction

Build:

`docker build [options] [path]`

Examples to build:

`docker build -t [repository:tag] [path]` to build specific tag
`docker build -t thej/myimage:1.0 .` to build from the current path as context
`docker build -t thej/myimage:1.0 myproject` to build from *myproject* path as context


## Docker Volumes

A *Volume* is a designated directory in a container, which is designed to persist data, independent of the container's life cylce

- Volume changes are excluded when updating an image
- persist when a container is deleted
- Can be mapped to host a directory
- Can be shared between containers

### Mount a volume
- Volumes are mounted when creating or executing a container
- can be mapped to a host directory
- volume paths specified must be absolute

Execute a new container and mount the directory /myvolume into its filesystem
`docker run -d -P -v /myvolume nginx:latest`

Execute a new container an mape */data/src* directory from the host into the */test/src* directory in the container
`docker run -i -t -v /data/src:/test/src nginx:latest`

### Volumes in Dockerfile
- VOLUME instruction creates a mountpoint
- can specify arguments a JSON array or string
- cannot map volumes to host directories
- volumes are initialized when the container is executed

String example:
`VOLUME /myvol`

String examples with multiple volumes:
`VOLUME /myvol1 /test/src`

JSON example
`VOLUME ["myvol", "myvl2"]`


### Uses of volumes
- de-couple the data that is stored from the container which created the data
- good for sharing data between containers
    + can setup a data container which has a volume you mount in other containers
- mounting directories from the host is good for testing purposes but generally not recommended for production use


## Networking

### Mapping ports
- containers have their own network and IP address
- map exposed container ports to ports on the host machine
- ports can be manually mapped or auto mapped
- uses the -p and -P parameters in `docker run`

Maps port 80 on the container to 8080 on the host:
`docker run -d -p 8080:80 nginx`

### Automapping ports
- use the *-P* option in `docker run`
- automatically maps exposed ports in the container to a port number in the host
- host port numbers used go from 49154 to 65535
- only works for ports defined in the EXPOSE instruction 

Auto map ports exposed by the NGINX contaoner to a port value on the host:
`docker run -d -P nginx`

### EXPOSE instruction 
- configures which ports a container will listen on at runtime
- ports still need to me mapped when container is executed

```
FROM ubuntu:14.04
RUN apt-get update & apt-get install -y nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```



## Linking containers

Linking is a communication method between containers which allows them to securely transfer data from one to antoher

- source and recipient containers
- recipient containers have access to data on source containers
- links are established based on container names

```
---------------------------------------
|                                     |   
|  -------------    ---------------   |
|  | --------  |    |  ---------- |   |
|  | |webapp|  |    |  |database| |   |
|  | --------  | -> |  ---------- |   |
|  | container |    |  container  |   |
|  -------------    ---------------   |
|    recipient           source       |
|                                     |
|               host                  |
---------------------------------------

```

### creating a link
1. create soruce container first
2. create the recipient container using the *--link* option

- Bets practice: give the containers meaningful names

Create source container using postgres:
`docker run -d --name database postgres`

Create the recipient container and link it:
`docker run -d -p 8080:80 --name website --link database:db nginx`
note: *db* is the alias

#### Uses of linking
- containers can talk to each others without having to epose ports to the host
- essential for micro service applicatin architecture
- Example:
    + container with tomcat running
    + container with MySQL running
    + application on tomcat need to connect to MySQL

