FROM denoland/deno:1.46.3

WORKDIR /app

COPY deno.json deno.lock ./
RUN deno cache --lock=deno.lock deno.json

COPY . .
RUN deno cache server.ts

EXPOSE 8000

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "server.ts"]