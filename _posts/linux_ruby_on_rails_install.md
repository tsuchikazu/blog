---
title: "LinuxにRuby on Railsをインストールする"
date: "2012-11-06"
categories:
  - "ruby"
tags:
  - "linux"
  - "ruby"
  - "ruby-on-rails"
  - "vps"
coverImage: "images/medium_176276714.jpg"
---

開発環境をMacにする人が最近はだいぶ増えてきました。MacでRuby on Railsをインストールするという記事は、探せばいくらでも出てくるので、今回はLinux上でインストールしてみます。VPS等で試してみてください。（Macもほとんど変わらないんですが）


#### 環境

- CentOS 6.3
- Rails 3.2.8

#### gitをインストール

rbenvのインストールにも使うし、いまどきgit入ってないとかなんなの。という感じなので、入れておきましょう。

```
$ sudo yum install git
$ git --version
git version 1.7.1
```

### rbenvのインストール

[rbenv](https://github.com/sstephenson/rbenv)は、簡単にrubyのバージョンを切り替えられるコマンドです。 Macの場合は、homebrewでインストールできてすごく楽です。今回はMacOSではないので、gitからcloneしてインストールします。基本的に [rbenv](https://github.com/sstephenson/rbenv)のREADMEに書かれている通りです。

1. githubから~/.rbenvにcloneします。

    ```
    $ cd
    $ git clone git://github.com/sstephenson/rbenv.git .rbenv
    ```

2. `~/.rbenv/bin`にrbenvコマンドが入っているので、そこにパスを通します。

    ```
    $ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bash_profile
    ```

    zsh使ってる場合は`~/.bash_profile`の代わりに`~/.zshenv`にして下さい。

3. `rbenv init`コマンドを呼び出すようにします。実際は`~/.rbenv/libexec/rbenv-init`のシェルを呼び出しているようです。

    ```
    $ echo 'eval "$(rbenv init -)"' >> ~/.bash_profile
    ```

    zsh使ってる場合は`~/.bash_profile`の代わりに`~/.zshenv`にして下さい。

4. インストール出来たか確認しましょう。

    ```
    $ exec $SHELL
    $ rbenv
    rbenv 0.3.0
    usage: rbenv <command> [<args>]
    ```


### ruby-buildのインストール

rbenvは単にrubyのバージョンを切り替えるだけなので、このままだと手動でrubyをダウンロードして、展開して、makeして`~/.rbenv/versions`に置く。というようなインストール作業が必要になります。その面倒なrubyインストールを簡単にしてくれるのが、[ruby-build](https://github.com/sstephenson/ruby-build)です。

ruby-buildはrbenvのプラグインとして提供されており、`~/.rbenv/plugins/`にcloneすることで、`rbenv install`コマンドで簡単にrubyをインストールすることができます。

```
    $ rbenv install # ruby-buildを入れる前は使えない
    rbenv: no such command `install`
    $ git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
    $ rbenv install
    usage: rbenv install [-k|--keep] [-v|--verbose] VERSION
           rbenv install [-k|--keep] [-v|--verbose] /path/to/definition
           rbenv install -l|--list
```

### ruby インストール

準備が整ったので、rubyをインストールしてみましょう。

1. インストール可能なバージョンを確認します。

    ```
    $rbenv install -l
    Available versions:
      1.8.6-p383
      1.8.6-p420
      1.8.7-p249
    ・・・
    ```

2. 現時点で最新の安定版1.9.3-p286をインストールします

    ```
    $ rbenv install 1.9.3-p286
    ```

3. 11月2日に出たばかりのruby2.0初のプレビュー版もインストールしてみましょう

    ```
    $ rbenv intall 2.0.0-preview1
    ```

4. インストールしたrubyは次のコマンドで確かめられます

    ```
    $ rbenv versions
      1.9.3-p286
      2.0.0-preview1
    ```

5. rubyの切り替えはglobalコマンドで指定します。このコマンドで`~/.rbenv/version`ファイルに書きこまれます。

    ```
    $ rbenv global 1.9.3-p286
    $ rbenv versions # *が今、選択されているrubyバージョンです
    * 1.9.3-p286 (set by /home/tsuchikazu/.rbenv/version)
      2.0.0-preview1
    $ ruby -v
    ruby 1.9.3p286 (2012-10-12 revision 37165) [x86_64-linux]
    ```


### Ruby on Rails インストール

さて、いよいよRuby on Railsのインストールです。Ruby on Railsは`gem`として配布されています。`gem`っていうのは、rubyのライブラリのことで、rails以外にも便利なgemがたくさんあります。`gem`コマンドで簡単にインストール、アンインストールすることができます。

1. Ruby on Railsのgemを検索してみます。

    ```
    $ gem search -r rails
    ・・・・
    rack-ssl-rails (0.0.2)
    radiant-rails3 (0.1)
    rails (3.2.8)
    rails-3-settings (0.1.1)
    rails-action-args (0.1.1)
    ・・・・
    ```

    めちゃくちゃいっぱい表示されますが、それだけRuby on Rails関係のライブラリが多いということです。 その中に`rails`が入っているはずです。それがRuby on Railsです。

2. railsをインストールします。

    ```
    $ gem install rails # --no-ri --no-rdoc を付けるとドキュメント生成を省略して、早くインストールできるし、かっこいいです
    $ rails -v # command not foundってエラーに成ったら、`exec $SHELL`してみて下さい。
    Rails 3.2.8
    ```

3. 最後に、お試しでアプリを作成してみましょう。

    ```
    $ rails new unko
    $ cd unko
    $ rails server
    ```

    サーバ起動できましたね。ブラウザで3000ポートを確認してみてください。


以上、いかがだったでしょうか。homebrew でインストールしなくても、gitがあれば簡単ですね。

\[amazonjs asin="4774165166" locale="JP" title="パーフェクト Ruby on Rails"\]
