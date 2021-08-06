---
title: "さくらVPSの初期設定をChef Soloでやってみた〜サードパーティcookbookの使い方〜"
date: "2013-10-21"
categories:
  - "chef"
tags:
  - "chef"
  - "gem"
  - "sakura"
  - "vps"
coverImage: "images/medium_7494123476.jpg"
---

[Chef Soloの正しい始め方 | tsuchikazu blog](https://tsuchikazu.net/chef_solo_start/)がどういうわけかgoogleさんに好かれているので、続編を書きました。入門Chef Soloと正しい始め方を読んで、じゃあ実際に色々やってみようかな。とはいえ、チュートリアル的なことでなく、もうちょっと実践的なことをして理解を深めたい。このような人を対象に、さくらVPSの初期設定を題材に、Chef Soloを説明していきます。

この記事でやることは以下のとおりです

- 一般ユーザの作成
- 鍵認証の設定
- sudo有効化
- sshの設定
- iptablesの設定

さくらVPSでよく行われる初期設定で、これを実施すればrootが乗っ取られてヤバイことになった。とかそういう事態は防げるはずです。AWSのEC2ですと、デフォルトで設定される内容になっていますので、さくらVPSをEC2レベルまでセキュリティ向上させるのを目標にします。

## 前提

自分のローカルの環境は以下のとおりです。

```
$ ruby -v
ruby 2.0.0p247 (2013-06-27 revision 41674) [x86_64-darwin11.4.0]
$ gem list | grep chef
chef (11.6.0)
$ gem list | grep knife
knife-solo (0.3.0)
$ gem list | grep berks
berkshelf (2.0.9)
```

今回、設定するさくらVPSのサーバ環境はCentOS 6.4で進めました。おそらくVagrantで作ったVM等でも問題なく動作するはずです。

## セットアップ

早速、Chef Soloを実行するためのベースとなるリポジトリを、`knife solo init`コマンドを使って作成します。

```
$  knife solo init vps-start-chef-cookbooks
Creating kitchen...
Creating knife.rb in kitchen...
Creating cupboards...
Setting up Berkshelf...

$ cd vps-start-chef-cookbooks/
```

今回、サードパーティのcookbookの管理には`berks`を使用します。berksのコマンドを使って、berksに必要なファイルを作成します。

```
$ berks init
      create  Berksfile
      create  Thorfile
    conflict  .gitignore
       force  .gitignore
    conflict  Gemfile
       force  Gemfile
      create  Vagrantfile
Successfully initialized
```

ローカルの準備は整ったので、次にサーバ側の設定を行います。さくらVPSの初期状態ですと、Chefがインストールされておらず、Chef Soloが実行できる状態ではありません。`knife solo prepare`コマンドを使用してChefをサーバにインストールします。
（VPSのIPが`133.242.191.168`という設定で進めます。自分の環境に合わせてIPを変更してください）

```
$ knife solo prepare root@133.242.191.168
Bootstrapping Chef...
Enter the password for root@133.242.191.168:
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
101  6790  101  6790    0     0   7495      0 --:--:-- --:--:-- --:--:-- 20764
Downloading Chef 11.6.0 for el...
Installing Chef 11.6.0
warning: /tmp/tmp.Wjdkgw9l/chef-11.6.0.x86_64.rpm: Header V4 DSA/SHA1 Signature, key ID 83ef826a: NOKEY
Preparing...                ########################################### [100%]
   1:chef                   ########################################### [100%]
Thank you for installing Chef!
Generating node config 'nodes/133.242.191.168.json'...
```

これで準備は完了です。

## 一般ユーザ作成＆鍵認証＆sudo有効化

初期状態ではrootユーザーしか存在しないため、通常作業用に一般ユーザーを作成します。

今回はサードパーティで用意されているcookbookを利用しながらChefの仕組みを理解していくために、積極的に採用していきます。やりたいこと + cookbook でググったり、[Opscode Community](http://community.opscode.com/)で検索すると、やりたいことが出来るcookbookが見つかるかと思います。
今回ユーザの追加用のcookbookとして、[fnichol/chef-user · GitHub](https://github.com/fnichol/chef-user)を利用します。まずサードパーティのcookbookを使うには、cookbookをダウンロードしてくる必要があります。そのためには`Berksfile`ファイルにダウンロードするcookbookを追加し、`berks install`コマンドを実行します。サードパーティのcookbookは`cookbooks`ディレクトリに置いておく慣習があるため`--path`オプションで`cookbooks`を指定しておきましょう。

```
$ vim Berksfile
site :opscode
# この一行を追加
cookbook 'user'

$ berks install --path cookbooks
Using user
```

さて、どうやってこれを利用していくかですが、サードパーティのcookbookには大きく３つあるようです。（この分類は自分が勝手に呼んでいるだけで、非公式です）

- LWRP型・・・recipeで何もせずに、LWRPを提供するもの（例：[fnichol/chef-user · GitHub](https://github.com/fnichol/chef-user)）
- Attribute型・・・recipeが提供され、Attributeが柔軟に定義されているもの（例：[opscode-cookbooks/mysql · GitHub](https://github.com/opscode-cookbooks/mysql)）
- ハイブリッド型・・・LWRP型とAttribute型の両方が提供されているもの

まずはLWRP型ですが、これはrecipeには何も書かれておらずLWRP(Lightweight Resources and Providers)だけが書かれているcookbookです。そもそもLWRPというのは、独自のResourceを定義する機能です。LWRPの細かい説明は省略しますが、要は標準で提供されているResourceより、便利になった独自Resourceが使えるようになるcookbook。それが、LWRP型です。[fnichol/chef-user · GitHub](https://github.com/fnichol/chef-user)はLWRP型のcookbookですので、実際に使用してみましょう。（Attribute型は後述します）

[README](https://github.com/fnichol/chef-user)を読むと、`user_account`というLWRPが使うことが出来ることがわかります。標準の`user`Resourceとの違いは、SSHの公開鍵を`authorized_keys`に置けるところです。それでは`user_account`を呼び出すためのcookbookを作って、recipeを編集していきます。

```
$  knife cookbook create site_user -o site-cookbooks/
** Creating cookbook site_user
** Creating README for cookbook: site_user
** Creating CHANGELOG for cookbook: site_user
** Creating metadata for cookbook: site_user
```

recipeを編集しましょう。`tsuchikazu`とユーザを作成してみます。ssh\_keysにはあらかじめ作成しておいた公開鍵を指定します。

```
$ vim site-cookbooks/site_user/recipes/default.rb
# LWRPの呼び出し
user_account 'tsuchikazu' do            # tsuchikazuというユーザを
  action :create                        # 作成するよ
  ssh_keys  ['ssh-rsa AAAAB3NzaC....']  # authorized_keysはこれで
end
```

今、追加したrecipeを適用するために、`knife solo prepare`を実行した時に作成されているJSON ファイル `nodes/ipaddress.json` の `run_list` にrecipeを追加しましょう。この時に、サードパーティのrecipeを先に書いておくことで、その後に指定したrecipeでサードパーティが提供しているLWRPを使用することが出来るようになります。

```
$ vim nodes/133.242.191.168.json
{
  "run_list":[
    "recipe[user]",
    "recipe[site_user]"
  ]
}
```

これで、userを追加する準備が整いました。さらに今追加しようとしているuserで`sudo`コマンドを使えるようにします。普通にやるとすると`visudo`コマンドで`sudoresファイル`を編集するでしょうか。それをChefでやるために、サードパーティのcookbookである[opscode-cookbooks/sudo · GitHub](https://github.com/opscode-cookbooks/sudo)を使うことにします。先ほどの[fnichol/chef-user · GitHub](https://github.com/fnichol/chef-user)と同様に`berks`で[opscode-cookbooks/sudo · GitHub](https://github.com/opscode-cookbooks/sudo)をダウンロードします

```
$ vim Berksfile
# この１行を追加
cookbook 'sudo'

$ berks install --path cookbooks
Using user (0.3.0)
Using sudo (2.0.4)
```

さて、このサードパーティcookbookを利用して`sudo`の設定を行いたいのですが、[opscode-cookbooks/sudo · GitHub](https://github.com/opscode-cookbooks/sudo)は、まだ説明していないAttribute型に分類されます。Attribute型というのはrecipeが記述されていますが、重要部分がAttributeが使用されており、そのAttributeの値を上書きすることで、思い通りにrecipeを実行するというものです。opscode-cookbooks/sudoでいうと、[sudo/recipes/default.rb at master · opscode-cookbooks/sudo · GitHub](https://github.com/opscode-cookbooks/sudo/blob/master/recipes/default.rb)のrecipeをみると、Attributeが使用されているのがわかるかと思います。LWRP型のrecipe、[chef-user/recipes/default.rb at master · fnichol/chef-user · GitHub](https://github.com/fnichol/chef-user/blob/master/recipes/default.rb)と見比べると一目瞭然です。

では、実際にJSONファイルでAttributeを指定しましょう。指定するAttributeは[README](https://github.com/opscode-cookbooks/sudo/blob/master/recipes/default.rb)を見て、調べましょう。ここでは、`tsuchikazu`ユーザをパスワード無しで`sudo`出来るような設定にしてあります。

```
$ vim nodes/133.242.191.168.json
{
  "run_list":[
    "recipe[user]",
    "recipe[site_user]",
    "recipe[sudo]"
  ],
  "authorization": {
    "sudo": {
      "users": ["tsuchikazu"],
      "passwordless": "true"
    }
  }
}
```

これでユーザ作成の準備完了です。実際にChef Soloを実行してみましょう。passwordを何度も聞かれますが、めげずに入力してください。

```
$ knife solo cook root@133.242.191.168
```

実際に作成されたか、試してみてください。PWなしでログイン出来るはずです。

```
$ ssh tsuchikazu@133.242.191.168
```

## SSHの設定、iptablesの設定

先ほどのユーザ作成でサードパーティの使い方は説明したので、復習のために設定を進めます。
まずはSSHの設定ということで、以下の設定をします。

- rootログインの禁止
- パスワードログインの禁止

この設定を[opscode-cookbooks/openssh · GitHub](https://github.com/opscode-cookbooks/openssh)のcookbookを使ってやってみます。このcookbookはAttribute型なため、JSONファイルでAttributeを指定します。

```
$ vim Berksfile
# この１行を追加
cookbook 'openssh'

$ berks install --path cookbooks
Using user (0.3.0)
Using sudo (2.0.4)
Using openssh (1.1.4)

$ vim nodes/133.242.191.168.json
{
  "run_list":[
    ....(省略)
    "recipe[openssh]"
  ],
  ....(省略)
  "openssh": {
    "server": {
      "permit_root_login":"no",
      "password_authentication":"no"
    }
  }
}
```

これでSSHの設定は完了です。
次にiptablesの設定ということで、以下の設定をします。

- SSH 22番とHTTP 80番とHTTPS 443番のポートを開ける

次にiptablesの設定を[dcrosta/cookbook-simple-iptables · GitHub](https://github.com/dcrosta/cookbook-simple-iptables)のcookbookを利用して、行います。[dcrosta/cookbook-simple-iptables · GitHub](https://github.com/dcrosta/cookbook-simple-iptables)はLWRP型のcookbookなので、cookbookを作成してrecipeからLWRP呼び出します。

```
$ vim Berksfile
# gitからもinstall出来ます
cookbook 'simple_iptables', git:"git://github.com/dcrosta/cookbook-simple-iptables.git"

$ berks install --path cookbooks

$ knife cookbook create site_simple_iptables -o site-cookbooks/

$ vim site-cookbooks/site_simple_iptables/recipes/default.rb
---- default.rb
# Exampleをコピりました
# Reject packets other than those explicitly allowed
simple_iptables_policy "INPUT" do
  policy "DROP"
end

# The following rules define a "system" chain; chains
# are used as a convenient way of grouping rules together,
# for logical organization.

# Allow all traffic on the loopback device
simple_iptables_rule "system" do
  rule "--in-interface lo"
  jump "ACCEPT"
end

# Allow any established connections to continue, even
# if they would be in violation of other rules.
simple_iptables_rule "system" do
  rule "-m conntrack --ctstate ESTABLISHED,RELATED"
  jump "ACCEPT"
end

# Allow SSH
simple_iptables_rule "system" do
  rule "--proto tcp --dport 22"
  jump "ACCEPT"
end

# Allow HTTP, HTTPS
simple_iptables_rule "http" do
  rule [ "--proto tcp --dport 80",
         "--proto tcp --dport 443" ]
  jump "ACCEPT"
end
---- default.rb

$ vim nodes/133.242.191.168.json
{
  "run_list":[
    ....(省略)
    "recipe[simple_iptables]",
    "recipe[site_simple_iptables]"
  ],
  ....(省略)
```

最後にChef Soloを実行してみましょう。ユーザには先ほど作成したユーザを指定してみてください。無事設定が反映されているでしょうか。

```
$ knife solo cook tsuchikazu@133.242.191.168
```

## まとめ

これで簡単なサードパーティのcookbookを利用できるようになったはずです。サードパーティのcookbookを利用する際のコツは、とにかくREADMEを読んでやってみて、エラーになったらcookbookを読む。しかないかなと。READMEもcookbookによっては、適当で不親切なものがありますので、直接ソースを読むかサードパーティを使わないという手を取るのもいいかと思います。ちなみに、自分はこうやって使っているというだけですので、間違い等あれば指摘していただきたいです。

今回、サードパーティのcookbookを使って初期設定を進めました。なぜサードパーティを使ったかというと、[naoyaさんの入門書](http://www.amazon.co.jp/%E5%85%A5%E9%96%80Chef-Solo-Infrastructure-as-Code-ebook/dp/B00BSPH158)を皮切りにChef入門記事が量産されました。[Chef Soloの正しい始め方 | tsuchikazu blog](https://tsuchikazu.net/chef_solo_start/)これもその１つです。が、それらを読んでも、サンプルを実行するぐらいで私は自前でrecipeなどを書ける気に全くなりませんでした。そこで、次にやったのが今回紹介したサードパーティcookbookを使いまくる。ということです。今回紹介したものに加え、nginxやmysqlなど色々なcookbookを読みながら使いまくりました。すると自然とLWRPやAttribute、Recipeの書き方が少しずつわかってきた（気がした）のです。
ということで、入門の次のステップとしてサードパーティのcookbookの使い方を書きました。今回作成したChefリポジトリは[tsuchikazu/vps-start-chef-cookbooks](https://github.com/tsuchikazu/vps-start-chef-cookbooks)で公開していますので、参考になれば幸いです。
