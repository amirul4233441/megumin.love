>Original: https://megumin.love

# Megumin.love

[![Build Status](https://travis-ci.org/robflop/megumin.love.svg?branch=master)](https://travis-ci.org/robflop/megumin.love)

A site committed to worshipping best girl Megumin!

Runs under [NodeJS](https://nodejs.org/en/) mainly with [Express](https://expressjs.com), [SQLite3](https://www.sqlite.org/) and [uws](https://www.npmjs.com/package/uws).

## Self-hosting Usage
- Navigate into the folder you downloaded the repo to
- Rename `src/config.sample.json` to `src/config.json`
- Configure the website's settings (**Make sure to change the admin password and session secret**)
- Run `npm install` in a terminal to install dependencies
- Navigate into the `src` folder (to set the cwd properly)
- Start the website using `node server.js` (or `pm2 start server.js` if you use pm2)
- Click!

      A maintenance mode that will route every request to a 503 page is also
	  available. Simply pass "--maintenance" as node arg when launching the
	  server.

### Adding new sounds

There are two ways to add new sounds starting with version 5.0.0 -- via interface or manually.

#### Interface:
- Open the admin panel at `/admin` and log in.
- Fill out the form for uploads on the very left and click "Upload sound".

#### Manually:
- Put your new sound files in the `src/resources/sounds/` folder (in ogg and mp3 format)
- Run this query with the values you want to use for the sound:
  - `INSERT OR IGNORE INTO sounds ( filename, displayname, source, count ) VALUES ( <your>, <values>, <here>, 0 );`

And that's it. Your sound will automatically be added to the main button's available sounds, the soundboard and the rankings after a restart.

### Renaming sounds

There are also two ways to rename a sound, again via interface or manually.

#### Interface:
- Open the admin panel at `/admin` and log in.
- Fill out the form for renaming in the center and click "Update sound".

#### Manually:
- Rename the files in the `/src/resources/sounds` folder
- Run this query with with the new values you want to use for the sound:
  - `UPDATE sounds SET filename = <your>, displayname = <values>, source = <here> WHERE filename = <old filename>;`

### Important Information

- #### Using the master branch instead of releases does not guarantee receiving a working version of the website. I work on the site on my own pace and don't always update the master branch to a working state (especially when i am working on new features), so if you want a version that's guaranteed to work, use a release version -- optimally the latest.

- If upgrading to a new version (especially a new major, e.g. 3.x -> 4.x), be sure to check if the release notes mention anything regarding changes that need to be made to the database. If something like that is needed instructions on how to adjust the database will be given, be sure to follow those.

- If you add to the errorTemplates, you will have to create the actual html files for these in the `src/pages/errorTemplates/` folder as well, otherwise this setting will not take effect.

- Update interval in the config represents minutes, following the cronjob syntax, so the max value is 60 (meaning once every hour).
  - `1` would mean once every minute, `10` once every 10 minutes etc. Commas will be rounded (this is due to scheduling).

- It is also advised to check out the [Wiki](https://github.com/robflop/megumin.love/wiki) for more information.

#### Important for proxying to 443 (SSL)

If you want to proxy the website to the SSL port (443), so that users can access the site via `https://<domain>` instead of `http://<domain>:<port>`, then flip on the `SSLproxy` setting in the config.
This will make the front-end WebSocket connections connect to `wss://<domain>` instead of `ws://<domain>:<port>`.
Not changing this setting but still proxying to the SSL port (443) will result in every counter of the page being unresponsive, as the WebSocket connections will fail.

If you're not going to be running the site with SSL just leave the setting at the default `false` value and everything should be fine.

Nginx proxy example:
-

```nginx
server {
    # proxy-unrelated settings left out

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_http_version 1.1;
        proxy_pass http://127.0.0.1:<port>;
        proxy_store off;
        proxy_redirect off;
    }
}
```

>I used to have an Apache example too, but I couldn't figure out how to get it working after switching to uws, so i removed it instead of providing false info. Apologies for those who need it.

You will have to insert the port you chose in the `src/config.json` file in place of the `<port>` placeholders here.

#### License

Licensed under the [MIT License](LICENSE.md).
