# OAuth Setup

This Spring Boot application is set up to use Github OAuth as it's authentication scheme.

Setting this up on localhost requires the first two steps below; getting this to work on Dokku requires additional 
steps.



Instructions for setting up Github OAuth can be found here:

* <https://github.com/ucsb-cs156/ucsb-cs156.github.io/blob/main/topics/oauth/oauth_github_setup.md>

1. Obtaining a Github *client id* and *client secret*, which is described here: 
   * <https://github.com/ucsb-cs156/ucsb-cs156.github.io/blob/main/topics/oauth/oauth_github_setup.md>
2. Configuring the `.env` file with these values.


# About the `.env` and `.env.SAMPLE` files.

* The `.env` file is created by copying it from `.env.SAMPLE` and then editing it, e.g.
  
  ```
  cp .env.SAMPLE .env
  ```
* Recall that `.env` and `.env.SAMPLE` will not show up in regular directory listings; files starting with `.` are considered
  hidden files.  Use `ls -a`, or configure your Mac finder/Windows explorer to show hidden files.
* As explained below, put your client-id and client-secret into `.env`, NOT in `.env.SAMPLE` 
* `.env` is never committed to the GitHub repo
* There is more information about `.env` vs. `.env.SAMPLE` on this page if you are interested: [docs/environment-variables](environment-variables.md).


   * For localhost, enter: `http://localhost:8080/login/oauth2/code/github`
     - Note that this *must* be `http` not `https`
   * For Dokku, enter: `https://myappname.dokku-xx.cs.ucsb.edu/login/oauth2/code/github`
     - Note that you should substitute in *your* app name in place of `my-app-name` and your dokku number for `xx`
     - Note that this *must* be `https` not `http`

   ![image](https://user-images.githubusercontent.com/1119017/149854295-8e1c4c63-929c-4706-972d-1962c644a40a.png)

   Then click the blue `CREATE` button.
   
   You will now see the client id and client secret values.
   
   Keep this window open, since you'll need these values in the next step.
   
## Step 2: Copy `.env.SAMPLE` to `.env` and enter values

In the frontend directory, use this command to copy `.env.SAMPLE` to `.env`.  Recall that you
may need to use `ls -a` to get the files to show up, since they are hidden files on Unix-like systems.

```
cp .env.SAMPLE .env
```

The file `.env.SAMPLE` **should not be edited;** it is intended to
be a template for creating a file called `.env` that contains
your repository secrets.

The `.env` is in the `.gitignore` because **a file containing secrets should NOT be committed to GitHub, not even in a private repo.

After copying, the file `.env` looks like this:

```
GITHUB_CLIENT_ID=see-instructions
GITHUB_CLIENT_SECRET=see-instructions
ADMIN_GITHUB_LOGINS=pconrad,phtcon
```

Replace `see-instructions` with the appropriate values.

For ADMIN_GITHUB_LOGINS, add your own github login and any teammates you are collaborating with after phtcon.ucsb.edu; you can separate multiple emails with commas, e.g.

```
ADMIN_GITHUB_LOGINS=pconrad,phtcon,cgaucho,ldelplaya
```

With this done, you should be all set to run on localhost.

For Dokku, there is one more step.

## Step 3: Copying `.env` values to Dokku

See: <https://ucsb-cs156.github.io/topics/dokku/environment_variables.html>

## Troubleshooting

If you see this:

<img src="https://user-images.githubusercontent.com/1119017/149856156-575fb638-7db8-460a-a344-9069145aa242.png" alt="Redirect URI Mismatch" width="600" />

Try clicking the little arrow to open up the additional message:

<img src="https://user-images.githubusercontent.com/1119017/149856193-512acb25-2bfc-4e53-991b-f61de37f1ed6.png" alt="Request Details" width="600" />

Now, you'll see  the Redirect URI that the app is expecting.

If you go back to the [GITHUB Developer Console](https://console.cloud.GITHUB.com/) you can see what you really entered.

For example, when I was getting this error message, it's because I put in this for my Redirect URI:

![image](https://user-images.githubusercontent.com/1119017/149856340-98acd5e4-8712-4723-a899-e3bf2f06d3fa.png)

Rookie mistake!  I literally had `myappname` instead of `demo-spring-react-example`. 

Change it to the correct URI, click save.  Then go back to the URL for the home page of your app and refresh the page (you don't need to restart the Heroku backend; just refresh your browser page.)  Click login again, and you should get something like this:

<img src="https://user-images.githubusercontent.com/1119017/149856532-b1cda813-bd3f-4fd1-a79e-630e5929d7be.png" alt="Choose an Account" width="600" />

Success!
  
