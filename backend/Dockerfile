FROM denoland/deno:latest

WORKDIR /app

COPY deno.json ./
RUN deno cache deno.json

COPY . .
RUN deno cache server.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "server.ts"]