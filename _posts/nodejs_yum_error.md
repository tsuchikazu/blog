---
title: "Node.jsのyumリポジトリが削除されてyumコマンドがエラー"
date: "2013-03-12"
categories: 
  - "開発環境"
tags: 
  - "error"
  - "node"
  - "yum"
---

久しぶりに放置していたVPSで`sudo yum update`や`yum list`など実行してみると、以下のエラーが発生した。

```
Loaded plugins: downloadonly,  fastestmirror
Determining fastest mirrors
epel/metalink
Could not retrieve mirrorlist http://nodejs.tchol.org/mirrors/nodejs-stable-el6 error was
14: PYCURL ERROR 6 - "Couldn't resolve host 'nodejs.tchol.org'"
Error: Cannot find a valid baseurl for repo: nodejs-stable
```

[http://nodejs.tchol.org/mirrors/nodejs-stable-el6](http://nodejs.tchol.org/mirrors/nodejs-stable-el6)に繋がらないよエラーで、確かにアクセスしても繋がらない。 これは以前、Node.jsをインストールするときに追加したyumリポジトリでした。

調べてみると2012年5月以降、nodejs.tchol.orgのyumリポジトリが更新されなくなって、nodeの[パッケージマネージャでのインストール方法Wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)からも削除されたようです。  
[Compare Revisions · joyent/node Wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager/_compare/38057aecf67df27f4097486b79077c311ce9f19d...7c167c56a18b5cbdd9d79c8fe082f3303ebd22ec)

なので、このリポジトリを参照しないように削除したら、`yum`が使えるようになりました。

```
$ sudo rm /etc/yum.repos.d/nodejs-stable.repo
$ yum list
```

なお、これからCentOSにNode.jsをインストールするときは、ソースからインストールすればいいじゃん。簡単だよ。という話らしいです。
