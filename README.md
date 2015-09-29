目前需要解决的3个问题：
1，目前在成功登陆后，PC上刷新一次需要1-2秒，移动端刷新一次需要9-10秒。现在需要把移动端刷新时间控制在3秒以内，这一点很重要。
2，有新邮件的时候，会报错(用户不可见)，现象是不会及时刷新邮件列表，如error_1.png所示。阅读新邮件同样会出现该错误。
3，发件箱出现重复的邮件，如error_2.png所示。

目前已经部署到http://121.199.35.50:8889 
测试账号 test@mygzb.com
密码 JiaHe@2288

### Architecture

![client architecture](https://whiteout.io/img/app_layers.png)

### Development
For development you can start a connect dev server:

    grunt dev

Then visit [http://localhost:8580/dist/#/account?dev=true](http://localhost:8580/dist/#/account?dev=true) for front-end code or [http://localhost:8580/test/unit/](http://localhost:8580/test/unit/) to test JavaScript changes. You can also start a watch task so you don't have rebuild everytime you make a change:

    grunt watch

## Releasing Chrome App

    grunt release-test --release=0.0.0.x
    grunt release-stable --release=0.x.0

## Deploying Web App & Selfhosting

The App can be used either as a Chrome Packaged App or just by hosting it on your own trusted web server. You can build the app from source.

### Build from source

Clone the git repository

    git clone https://github.com/b-deng/project.git

Build and generate the `dist/` directory:

    npm install && grunt

### Running the server

To test the server, start it in development mode (without SSL):

    node server.js --dev

Navigate to [http://localhost:8889](http://localhost:8889) (or whatever port is set using the `PORT` environment variable).

To start the server for production use (this automatically redirects to `https`)

    npm start

**A note on security: The app should not be used without SSL so it's best to set up a reverse proxy or Loadbalancer with your SSL certificates. If you are not sure how to do this it might be easier to use our managed web hosting or packaged apps under [https://whiteout.io/#product](https://whiteout.io/#product).**

You can limit incoming and outgoing connections to the socket.io proxy by setting the following environment variables:

    # the web socket proxy listens to this port
    # if unset, defaults to 8889
    PORT=12345

    # the socket.io proxy accepts connections from these origins to tunnel them to tcp,
    # separate with commas
    # if unset, defaults to 'localhost:' + port
    INBOUND_ORIGINS='foo:1234,bar:569'

    # the socket.io proxy opens tcp connections with these ports to tunnel them to socket.io
    # separate with commas
    # if unset, defaults to '143,465,587,993' (25 is forbidden by default)
    OUTBOUND_PORTS='123,456,789'

To start the server in development mode (no forced HTTPS, iframe loads http content), run `node server.js --dev`
