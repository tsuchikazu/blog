---
title: "ActiveRecordを単体で使うには"
date: "2012-11-10"
categories:
  - "ruby"
tags:
  - "activerecord"
  - "gem"
  - "mysql"
  - "ruby"
coverImage: "images/large_368519992.jpg"
---

さくっとDBにアクセスするバッチやスクリプトを、rubyで書きたいなぁと思うことはないですか？
Railsで使われている O/Rマッピングのライブラリ「ActiveRecord」ですが、Railsではなくただのrubyプログラムから単体で使うことが出来ます。

今回は、「ActiveRecord」を単体で使用して、MySQLにアクセスするスクリプトを書いてみます。

#### 環境

- ruby 1.9.3
- activerecord 3.2.8

#### ActiveRecordを使ってみる

1. ActiveRecordをインストール

    ```sh
    $ gem install activerecord
    ```

2. MySQLに接続するためのアダプタインストール

    ```sh
    $ gem install mysql2
    ```

    下のようなエラーが出る場合、

    ```sh
    Building native extensions.  This could take a while...
    ERROR:  Error installing mysql2:
        ERROR: Failed to build gem native extension.

            /home/tsuchikazu/.rbenv/versions/1.9.3-p286/bin/ruby extconf.rb
    checking for rb_thread_blocking_region()... yes
    checking for rb_wait_for_single_fd()... yes
    checking for mysql.h... no
    checking for mysql/mysql.h... no
    ```

    MySQL開発用のライブラリである、mysql-develをインストールしなければなりません。

    ```sh
    $ sudo yum info mysql-devel
    ```

3. まず、最初はハードコーディングしてみます

    main.rb

    ```rb
    # -*- encoding: utf-8 -*-
    require "rubygems"
    require "active_record"

    # DB接続設定
    ActiveRecord::Base.establish_connection(
      adapter:  "mysql2",
      host:     "localhost",
      username: "xxxxxx",
      password: "xxxxxxx",
      database: "xxxxxx",
    )

    # テーブルにアクセスするためのクラスを宣言
    class User < ActiveRecord::Base
      # テーブル名が命名規則に沿わない場合、
      self.table_name = 'wp_users'  # set_table_nameは古いから注意
    end

    # レコード取得
    p User.all
    ```

4. 本番環境や、テスト環境など簡単にDB接続設定を簡単に切り替え出来るように、YAMLに外出ししてみましょう

    database.yml

    ```yml
    db:
      production:
        adapter:  mysql2
        host:     localhost
        username: xxxxxxxx
        password: xxxxxxxx
        database: xxxxxxxx

      development:
        adapter:  mysql2
        host:     localhost
        username: xxxxxxxx
        password: xxxxxxxx
        database: xxxxxxxx
        database: xxxxxx
    ```

    修正したmain.rb

    ```rb
    # -*- encoding: utf-8 -*-
    require "rubygems"
    require "active_record"

    config = YAML.load_file( './database.yml' )
    # 環境を切り替える
    ActiveRecord::Base.establish_connection(config["db"]["development"])

    # テーブルにアクセスするためのクラスを宣言
    class User < ActiveRecord::Base
      # テーブル名が命名規則に沿わない場合、
      self.table_name = 'wp_users'  # set_table_nameは古いから注意
    end

    # レコード取得
    p User.all
    ```

    `config["db"]["development"]`の部分は、Railsと同様に管理するなら環境変数に入れて

    ```rb
    config["db"][ENV["RAILS_ENV"]]
    ```

    こんな感じにするのもいいかもしれません。


こんな感じで、簡単にrubyでDBアクセス出来ますね。ActiveRecordは色々APIもあるし便利です。既存アプリは他の言語で書かれているけど、小さなところから徐々にruby化したい。っていう時とかにもいいかもしれません。
