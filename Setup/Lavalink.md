Create the folder /Lavalink/

Download the jar from: https://ci.fredboat.com/repository/download/Lavalink_Build/3112:id/Lavalink.jar

Create the file, application.yaml

```yaml
server: # REST server
  port: 2334
  address: 0.0.0.0
lavalink:
  server:
    password: "LAVALINK from auth.js"
    ws:
      port: 2333
      host: 0.0.0.0
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      mixer: true
      http: true
      local: false
    sentryDsn: ""
    bufferDurationMs: 400
    youtubePlaylistLoadLimit: 600
```

Take the LAVALINK field from auth.js and put in the password

Start with
```shell
java -jar Lavalink.jar
```
