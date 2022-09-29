FROM node:14
WORKDIR /app
ARG CI_SERVER_HOST
ARG CI_JOB_TOKEN
COPY yarn.lock package.json ./
RUN git config --global url."https://".insteadOf "git://"
RUN git config --global url."https:///gitlab-ci-token:$CI_JOB_TOKEN@$CI_SERVER_HOST/".insteadOf "git@$CI_SERVER_HOST:"
RUN yarn
COPY . .
RUN yarn build
CMD yarn start
