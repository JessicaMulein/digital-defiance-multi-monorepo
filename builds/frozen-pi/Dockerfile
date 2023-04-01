# Use the latest Ubuntu as a base image
FROM ubuntu:latest


# Update package lists and install necessary packages
RUN apt-get update && \
    apt-get install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu dosfstools parted

# Set the working directory
WORKDIR /custom-image

# Copy the shutdown source file into the Docker image
COPY ./frozen-pi/custom-image/shutdown.c .

# Compile the shutdown source file
RUN aarch64-linux-gnu-gcc shutdown.c -o shutdown -static

# Create a custom bootloader configuration file
RUN echo -e "kernel_old=1\narm_64bit=1\nenable_uart=1" > config.txt

# Create the disk image
RUN dd if=/dev/zero of=shutdown.img bs=1M count=20

# Format the image with a FAT32 filesystem
RUN mkfs.vfat shutdown.img

# Mount the image and copy the necessary files
RUN mkdir mnt && \
    mount -o loop shutdown.img mnt && \
    cp config.txt mnt/ && \
    cp shutdown mnt/kernel8.img && \
    umount mnt

# Set the entrypoint to move the image to the output folder
ENTRYPOINT ["mv", "shutdown.img", "/output/"]
