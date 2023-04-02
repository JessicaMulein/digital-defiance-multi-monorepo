# Use the official Node.js 18 image as the base image
FROM node:18

# Set up build arguments
ARG FONTAWESOME_TOKEN

# Set environment variables using build arguments
ENV FONTAWESOME_TOKEN=$FONTAWESOME_TOKEN

# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /usr/src/app

# for now just these 3 packages are needed
COPY packages/duality-social-lib packages/duality-social-lib
COPY packages/duality-social-node packages/duality-social-angular
COPY packages/duality-social-node packages/duality-social-node

# Install the dependencies
RUN SKIP_DUALITY_SOCIAL_DOCS=true ./scripts/full-ci.sh --skip=sleep --skip=docusaurus_clear

# Expose port 3000 for the node application
EXPOSE 3000

# Start the node application
CMD ["yarn", "start"]
