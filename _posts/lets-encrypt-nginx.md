---
title: "Let's Encryptの証明書をnginxに設定してhttps化した"
date: "2016-02-21"
categories:
  - "life"
tags:
  - "wordpress"
---

今頃ではありますが、このブログを[Let's Encrypt](https://letsencrypt.org/)の証明書を使って、https化してみました。

## Let's Encryptとか、ACMEプロトコルってなに？

[Let's Encrypt](https://letsencrypt.org/)は、無料で証明書を発行してくれるCA(Certificate Authority:認証局)です。日本で有名なCAといえば、GlobalSignやシマンテック(旧ベリサイン)でしょうか。

CAが発行する証明書の種類として、以下の3つがあります。

- DV (Domain Validation)

    - ドメインの所有を確認して発行
- OV (Organization Validation)

    - 組織の実在の確認をして発行
- EV (Extended Validation)

    - より厳密な実在確認をして発行

Let's Encryptが発行できる証明書は、DVの証明書のみです。これは、証明書を発行したい人が、本当にそのドメインの所有者かのみを確認して発行する証明書になります。この発行フローを、ACMEによって自動化できる。というのがLet's Encriptの大きな魅力です。

一般的にDV証明書の申込から、サーバへの設定まで以下の様なフローになるんじゃないでしょうか。

- CSRを生成
- CSRをコピペして、申し込みフォームで申し込み
- ドメイン所有者であることを証明する

    - CAに指定されたコンテンツを、そのドメインで公開する
    - CAに指定された値を、DNSのTXTレコードに設定する
    - CAから送られてくる admin@mydomain.com 宛のメールのURLをクリックする
- CAはそれらを確認して証明書を発行する
- 証明書をダウンロードして、サーバへ設定する

これらの発行依頼者とCAとのやり取りを、完全に自動化しましょう。そのために、JSONをHTTPで送り合うWeb APIとして、仕様を標準化しましょう。というのが[ACME(Automatic Certificate Management Environment)](https://github.com/ietf-wg-acme/acme/)です。

これから使っていく[letsencript](https://github.com/letsencrypt/letsencrypt)はACME ClientをPythonで実装したものです。公式Client以外にも、すでに多くのClientが実装されています([List of Client Implementations - Documentation - Let's Encrypt Community Support](https://community.letsencrypt.org/t/list-of-client-implementations/2103))。CA側のACME実装も、[letsencrypt/boulder](https://github.com/letsencrypt/boulder/)がLet's Encriptによって公開されています。

発行フローの自動化は、今に始まったわけではなく、既存のCAでも代理店向けに、それぞれ独自のAPIを提供しているようです。それが、ACMEによって大統一されれば、Let's Encript以外でも簡単に自動で証明書を発行できるようになり、便利になりそうな気がします。

## 実際にやってみる

### Let's Encrypt client の install

```
$ git clone https://github.com/letsencrypt/letsencrypt
$ cd letsencrypt
$ ./letsencrypt-auto --help
install packages....

  letsencrypt-auto [SUBCOMMAND] [options] [-d domain] [-d domain] ...

The Let's Encrypt agent can obtain and install HTTPS/TLS/SSL certificates.  By
default, it will attempt to use a webserver both for obtaining and installing
the cert. Major SUBCOMMANDS are:

  (default) run        Obtain & install a cert in your current webserver
  certonly             Obtain cert, but do not install it (aka "auth")
  install              Install a previously obtained cert in a server
  renew                Renew previously obtained certs that are near expiry
  revoke               Revoke a previously obtained certificate
  rollback             Rollback server configuration changes made during install
  config_changes       Show changes made to server config during installation
  plugins              Display information about installed plugins

Choice of server plugins for obtaining and installing cert:

  --apache          Use the Apache plugin for authentication & installation
  --standalone      Run a standalone webserver for authentication
  (nginx support is experimental, buggy, and not installed by default)
  --webroot         Place files in a server's webroot folder for authentication

OR use different plugins to obtain (authenticate) the cert and then install it:

  --authenticator standalone --installer apache

More detailed help:

  -h, --help [topic]    print this message, or detailed help on a topic;
                        the available topics are:

   all, automation, paths, security, testing, or any of the subcommands or
   plugins (certonly, install, nginx, apache, standalone, webroot, etc)

```

./letsencrypt-auto の初回実行時に必要なパッケージが全てinstallされます。

### 証明書の取得

helpを見る限り、subcommandを指定しないと、defaultでcertonlyとinstallが実行されるようです。

- certonly

    - ドメインの確認、証明書の取得まで
- install

    - apacheやnginxの設定ファイルを書き換えて、sslを有効にする

install については ACME をざっと見ても、書かれていないので、letsencriptの独自の機能かもしれません。今のところdebianベースのapacheにのみ対応していて、将来的には[nginxも対応していく](http://letsencrypt.readthedocs.org/en/latest/using.html#nginx)ようです。

```
# nginx はまだ未対応
$ ./letsencrypt-auto --nginx
The requested nginx plugin does not appear to be installed
```

さて、それでは証明書の取得を行いましょう。

すでにhttpサーバがnginxで起動しているため、webroot plugin を利用しました。webroot pluginでは、webroot以下にファイル(.well-known/acme-challenge/) を配置することで、ドメインの所有確認がされていそうです。

まだ、httpサーバを動かしていない場合は、standalone plugin を利用することで、一時的にhttpサーバが起動しドメインの所有確認ができます。

```
$ ./letsencrypt-auto certonly --webroot -w /var/www/wordpress -d tsuchikazu.net
```

途中でメアド入力と利用規約へ同意をすると処理が完了し、証明書が発行されます。このコマンド一発で、ドメイン所有者の証明など諸々を自動でやってくれるわけです。実際に作成されたファイルたちは以下です。

```
$ sudo tree /etc/letsencrypt/
/etc/letsencrypt/
|-- accounts
|   `-- acme-v01.api.letsencrypt.org
|       `-- directory
|           `-- xxxxxxxxxxxxx
|               |-- meta.json
|               |-- private_key.json
|               `-- regr.json
|-- archive
|   `-- tsuchikazu.net
|       |-- cert1.pem
|       |-- chain1.pem
|       |-- fullchain1.pem
|       `-- privkey1.pem
|-- csr
|   `-- 0000_csr-letsencrypt.pem
|-- keys
|   `-- 0000_key-letsencrypt.pem
|-- live
|   `-- tsuchikazu.net
|       |-- cert.pem -> ../../archive/tsuchikazu.net/cert1.pem
|       |-- chain.pem -> ../../archive/tsuchikazu.net/chain1.pem
|       |-- fullchain.pem -> ../../archive/tsuchikazu.net/fullchain1.pem
|       `-- privkey.pem -> ../../archive/tsuchikazu.net/privkey1.pem
`-- renewal
    `-- tsuchikazu.net.conf
```

/etc/letsencrypt/live/tsuchikazu.net に証明書が発行されています。

### 証明書を nginx へ設定

nginxの設定を変更してSSLを有効にしましょう。設定ファイルはこんな感じになります。

```nginx
# httpはhttpsへリダイレクト
server {
  listen 80;
  server_name tsuchikazu.net;
  rewrite ^ https://$server_name$request_uri? permanent;
}
server {
    listen 443 ssl;

    server_name tsuchikazu.net;

    ssl_certificate /etc/letsencrypt/live/tsuchikazu.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tsuchikazu.net/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets on;

    ssl_dhparam /etc/ssl/private/dhparam.pem;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA';
    ssl_prefer_server_ciphers on;
```

nginx の再起動を行えば、https化することができました！

### 証明書の更新

証明書は90日で有効期限切れになるため更新し続ける必要がありますが、それも自動化されているため、更新コマンドを実行するだけになります。

```
$ ./letsencrypt-auto renew
Processing /etc/letsencrypt/renewal/tsuchikazu.net.conf

The following certs are not due for renewal yet:
  /etc/letsencrypt/live/tsuchikazu.net/fullchain.pem (skipped)
No renewals were attempted.
```

最初に発行した時の設定が、設定ファイルに書かれており、それを読み込んでくれるようです。今は発行したばかりなので、何も起きませんが、更新時期が近づけば証明書が更新されるはず。 なので、これの実行とnginxの再起動をcronに設定してみました。

### ついでにhttp2

nginx1.9.5からhttp2に対応しているようなので、mainline versionにyum updateしてhttp2化もやってみました。

nginxのバージョンアップ

```
$ # mainlineをinstallするためにbaseurlを書き換え
$ sudo vim /etc/yum.repos.d/nginx.repo
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=0
enabled=1

$ # install する verison の確認
$ yum list nginx
Installed Packages
nginx.x86_64                                  1.8.1-1.el6.ngx                                   @nginx
Available Packages
nginx.x86_64                                  1.9.11-1.el6.ngx                                  nginx

$ # update
$ sudo yum update nginx
Updated:
  nginx.x86_64 0:1.9.11-1.el6.ngx

Complete!
$ nginx -v
nginx version: nginx/1.9.11
```

最後に、nginxの設定にhttp2を追加して完了。

```
server {
    listen 443 ssl http2;
```

## おわりに

無料でhttps化。便利な時代になりました。ACMEが色々なCAでサポートされれば、証明書の管理が今後簡単になっていきそうな気がします。(https化されると、はてブなどのカウントが引き継がれないんですね…これ悲しいので、はてなやfacebook側で対応していただけるとうれしいです)

参考記事
* [Let's Encrypt を支える ACME プロトコル - Block Rockin’ Codes](http://jxck.hatenablog.com/entry/letsencrypt-acme)
* [光の速さのWEBサーバー(nginx)をlet's encryptでSSL化及びHTTP/2化。ついでにセキュリティ評価をA＋にする。 - Qiita](http://qiita.com/sak_2/items/ff835b669c0a7e110b09)

\[amazonjs asin="4774178667" locale="JP" title="nginx実践入門 (WEB+DB PRESS plus)"\]
