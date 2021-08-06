---
title: "Chef Soloの正しい始め方"
date: "2013-03-21"
categories: 
  - "chef"
tags: 
  - "chef"
  - "ec2"
  - "gem"
coverImage: "medium_271870440.jpg"
---

伊藤直也さんのブログ（[開発メモ#5 : Amazon Linux で knife-solo を使って chef-solo 実行 - naoyaのはてなダイアリー](http://d.hatena.ne.jp/naoya/20130204/1359971408) ）でchef-soloが紹介され、Vagrantと一緒にちょっとしたビッグウェーブが巻き起こりました。  
さらに昨日、[入門Chef Solo - Infrastructure as Code](http://tatsu-zine.com/books/chef-solo)が達人出版からも発売開始。本が出版される前に一度挫折したchef-soloですが、この本のお陰でchef-solo童貞を卒業することができました。

### 続編も書きましたので、よろしければこちらもどうぞ

続編：[さくらVPSの初期設定をChef Soloでやってみた〜サードパーティcookbookの使い方〜 | tsuchikazu blog](https://tsuchikazu.net/vps_chef_solo/)

なぜ挫折したかというと、Chefの[公式ドキュメント](http://www.opscode.com/chef/)が、量が多くてめちゃくちゃわかりにくいんです。naoyaさんのブログを見て、ちょっと試してみようかなという心はここで一度へし折られます。さらに、ネットで検索しても、ちゃんとまとまっているサイトがなく、情報がとても断片的。  
そこをカバーしているのが、[入門Chef Solo - Infrastructure as Code](http://tatsu-zine.com/books/chef-solo)です。網羅的でかつ、情報がChef Soloに限定されていて読みやすい本でした。Chef Soloを始める人の必読書です。

ひと通り読み終わった後、社内でも勉強会が開かれ、こういう風に進めればよかったのか。という形が見えたので、そのやり方をまとめてみました。詳しくは本を読んだほうがいいです。社内の勉強会はこちら（[社内で Chef 勉強会をして色々教えてもらった - banyan.github.com](http://banyan.github.com/2013/03/21/1/)）

今回の目標は

- ローカルからリモートへchef-solo実行
- サードパーティのcookbookを適用させる
- 自作のcookbookを適用させる

自分の環境は以下のとおりです。

- ローカル環境:Mac OS X 10.8.2
- chef 11.4.0
- knife-solo 0.2.0

## Chef、knife-solo のインストール

まずはChefのインストールから。Opscodeが提供しているスクリプトもありますが、gemでも配布されているので、そちらでインストールします。

```
 $ gem i chef --no-ri --no-rdoc
```

Chefをインストールすると、knifeっていうChefの便利コマンドがインストールされます。主にChefのclient-serverモデルで使用するコマンドですが、chef-soloで使う時も初期設定が必要です。

```
 $ knife configure
```

上を実行すると、`~/.chef/knife.rb`にknifeの設定ファイルが保存されます。色々と聞かれるけど全てデフォルトでOKです。

次に、[knife-solo](http://matschaffer.github.com/knife-solo/)をインストールします。knife-soloはknifeのプラグインで、knifeのサブコマンド(knife solo hogehoge)が使えるようになります。そのサブコマンドがchef-soloの肝となるコマンドで、ひな形を簡単に作れたり、ローカルで準備したレシピをリモートで実行出来たりすることができます。後で実際にやってみます。

```
 $ gem i knife-solo --no-ri --no-rdoc
```

## レポジトリを作ってみる

では、早速Chefでリポジトリを作ってみましょう。リポジトリとはChefの実行に必要なファイルの一番大きな入れ物です。リポジトリにcookbookが入り、cookbookにrecipeが入る構成になります。  
先ほどインストールした`knife-solo`のコマンド一発でひな形を作ることができます。

```
 $ knife solo init chef-repo
 $ tree chef-repo/
 chef-repo/
 ├── cookbooks
 ├── data_bags
 ├── nodes
 ├── roles
 ├── site-cookbooks
 └── solo.rb
```

今回はchef-repoという名前でリポジトリを作りました。バージョン管理しておきましょう。

```
 $ cd chef-repo
 $ git init
 $ git add .
 $ git commit -m 'first commit'
```

## cookbookを作ってみる

次はcookbookを作ってみます。cookbookにはrecipeがあって、templateがあって…と説明するとややこしくなるので、実際に見るのが早いです。[Opscode Community](http://community.opscode.com/cookbooks)等に多くのcookbookが公開されていて、一から書く必要はありません。

### サードパーティのcookbookをダウンロードしてみる

公開されているcookbookをダウンロードするには、Opscode Communityにユーザ登録し、秘密鍵をダウンロードしておく必要があります。秘密鍵をDownloadしたら、`~/.chef/username.pem`にパーミッション600で保存しておきましょう。更に`knife configure`で生成した`~/.chef/knife.rb`に以下の記述が無かったら、追記します。

```
 $ vim ~/.chef/knife.rb

 client_key       '/Users/tsuchikazu/.chef/username.pem' #この行追加
```

これで下の様なコマンドでcookbookフォルダにダウンロード出来ます。

```
 $ knife cookbook site vendor yum -o cookbooks/
```

でも、サードパーティのcookbookを扱うにはもっと便利な方法があって、それが[Berkshelf](http://berkshelf.com/)です。Berkshelfを使うと、サードパーティのcookbookをBundler風に扱う事ができて、任意のgithubからダウンロード出来たり、バージョン指定したりすることが出来るようになります。類似ツールとして[librarian](https://github.com/applicationsonline/librarian)もあります。

```
 $ gem i berkshelf --no-ri --no-rdoc
 $ vim Berksfile

 # 以下の3行を書いて保存
 site :opscode
 cookbook 'yum'
 cookbook 'nginx'

 $ berks install --path cookbooks
 Installing yum (2.2.0) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing nginx (1.4.0) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing bluepill (2.2.2) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing rsyslog (1.5.0) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing runit (0.16.2) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing build-essential (1.3.4) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing apt (1.9.0) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
 Installing ohai (1.1.8) from site: 'http://cookbooks.opscode.com/api/v1/cookbooks'
```

BerksfileがBundlerでいうGemfileになっていて、そこに必要なcookbookを書いておきます。breaks installコマンドでインストールが始まります。ログを見ると依存するcookbookも一緒にダウンロードされているのがわかります。サードパーティのcookbookはcookbooksフォルダに置く慣習なので、pathでcookbooksを指定してます。  
Berkshelfを使った場合、cookbookフォルダはrailsでいうvendor/bundleフォルダと同じ扱いなので、.gitignoreしておくといいそうです。

### 自分でcookbookを作ってみる

それでは自分でもcookbookを作ってみましょう。knife cookbookコマンドでcookbookのひな形が作成出来ます。baseという名前でcookbookを作成してみました。自分で作ったcookbookはsite-cookbooksに置きます。

```
 $ knife cookbook create base -o site-cookbooks/
 $ tree site-cookbooks/
 site-cookbooks/
 └── base
     ├── CHANGELOG.md
     ├── README.md
     ├── attributes
     ├── definitions
     ├── files
     │   └── default
     ├── libraries
     ├── metadata.rb
     ├── providers
     ├── recipes
     │   └── default.rb
     ├── resources
     └── templates
         └── default
```

色々ファイルやフォルダが出来るんですが、まずはrecipeだけを編集して、簡単なパッケージを入れてみるといいでしょう。

```
 $ vim site-cookbooks/base/recipes/default.rb

 # 適当にパッケージを入れてみる
 %w{zsh mosh}.each do |pkg|
   package pkg do
     action :install
   end
 end
```

## chef-soloを実行する

いよいよchef-soloを実行して、サーバにレシピを適用させていきましょう。ここでは試しにEC2に対して実行してみます。VPSでもVagrantで作った仮想マシンでも、やり方は同じです。sshでログイン出来るようにしておいてください。  
まずは、最初にインストールしたchef-soloの`knife solo prepare`を使って、サーバにchefをインストールします。これは最初に1回だけやればOKです。

```
  $ knife solo prepare -i ~/hoge.pem  ec2-user@xxx.xxx.compute.amazonaws.com
  Bootstrapping Chef...
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                   Dload  Upload   Total   Spent    Left  Speed
  100  6471  100  6471    0     0   6190      0  0:00:01  0:00:01 --:--:-- 8058
  Downloading Chef  for el...
  Installing Chef
  warning: /tmp/tmp.wDiTrysG/chef-.x86_64.rpm: Header V4 DSA/SHA1 Signature, key ID 83ef826a: NOKEY
  Preparing...                ########################################### [100%]
    package chef-11.4.0-1.el6.x86_64 is already installed
  Generating node config 'nodes/xxx.xxx.compute.amazonaws.com.json'...
```

実行が終わるとnodesフォルダにホスト名.jsonのファイルが作成されます。出来たファイルのrun\_listに実行したいcookbookを指定します。cookbooksか、site-cookbooksか、どちらのフォルダのcookbookでもOKです。

```
  $ vim nodes/xxx.xxx.compute.amazonaws.com.json

  # 実行したいcookbookを指定する。
  {
    "run_list":[
      "yum::epel", 
      "nginx", 
      "base"
    ]
  }
```

ついに、chef-soloの実行です。

```
  $ knife solo cook -i ~/hoge.pem ec2-user@xxx.xxx.compute.amazonaws.com
```

nginxが起動されたか、見てみましょう。

```
  $ open http://xxx.xxx.compute.amazonaws.com
```

エラー画面ではありますが、nginxが起動しているのがわかるかと思います。ほかのパッケージもインストールされているか試してみてください。

## サードパーティcookbookとの付き合い方

以上でcookbookを作って、サーバに適用する事ができました。今回は触れませんでしたが、Vagrantで作った仮想マシン上でテストをして、本番に適用するというのが便利そうです。残る疑問は、サードパーティのcookbookを使うべきか否か。サードパーティのcookbookを変更したい場合はどうするかという点です。

### サードパーティのcookbookを使うべきか

社内ではPuppetの方がよく使われていてPuppetマスターの人にそのへんの話を聞くと、そもそもサービスごとに求めているものが違うから、共通化出来るものではないんじゃないか。出来たとしても、提供されているものには品質にバラつきがあるし、カスタマイズしようとすると結構大変。それにどこまで設定されているかわからないものをそのまま使う気にはならない。参考にするのは全然ありだけど、結局0から自分で作るのが1番。とのこと。  
PuppetとChefの違いはあるけど、できる事はそんなに変わないので、Chefでもそんな感じになるんでしょうか。

### サードパーティのcookbookを変更したい場合は？

Berkshelfやlibrarianで、サードパーティのcookbookを扱う場合、Bundler風に扱うのが目的なので、ダウンロードしたcookbookを編集しないのが自然です。なので、変更したくなった場合はgemと同様にforkして、forkしたものをinstallしていく形がいいらしいです。（そうしなきゃダメってわけでは全然ありませんが）

```
# こんな感じでBerksfileには書いておく
cookbook "redis",  git: "git://github.com/kentaro/chef-redis.git"
```

## まとめ

繰り返しになりますが、[入門Chef Solo - Infrastructure as Code](http://tatsu-zine.com/books/chef-solo)は、Chefを始める人の必読書です。こんなブログ読むぐらいなら、さっさと買って読みましょう。

\[amazonjs asin="B00BSPH158" locale="JP" title="入門Chef Solo - Infrastructure as Code"\]
