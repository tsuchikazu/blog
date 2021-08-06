---
title: "AWS Amazon EC2 + Amazon RDSを使ってWordPressを構築する"
date: "2012-11-18"
categories: 
  - "aws"
tags: 
  - "aws"
  - "ec2"
  - "rds"
  - "wordpress"
coverImage: "origin_3187666412.jpg"
---

今頃ですが、初めてAWSを触ってみました。前提知識は全くのゼロからのスタートでしたが、WordPressを構築するところまで出来ましたので、その時の流れをまとめました。

まず、公式サイトやGoogleで調べてもわけがわからないので[ドットインストール Amazon Web Servicesの基礎](http://dotinstall.com/lessons/basic_aws)をひと通り見てください。これでAWSの大体のイメージが掴めるかと思います。

### WordPressの構築方法

では、早速WordPressの構築に入りますが、調べたところ3つの方法があります。

- WordPress用のAMIを使用する
- CloudFormationのWordPressテンプレートを使用する
- 手動でEC2+RDSを構築する

一つづつ説明していきます。

1. WordPress用のAMIを使用する
    
    Amazon EC2ではインスタンスを作成するときに、どのような環境を構築するのか、AMI(Amazon Mchine Image)を選択します。デフォルトではAmazon Linux、Ubuntu、WindowsなどのAMIから選択出来るのですが、有志が作ったAMIを使用することもできます。その中に、WordPressが構築済みでパフォーマンスチューニングまでされているものがあり、そのAMIを使用するという方法です。
    
    ものすごく簡単に構築できるという点は素晴らしいのですが、注意点としてはEC2のAMIで完結していますので、DBはEC2内に構築されており、RDSを使用するものではないという点です。RDSを使用するとバックアップやスケールアップが簡単に出来るので、どうせならRDSを使いたいものです。（インスタンス作成後にRDSを使うように変更すればいいんですが）さらに個人的には、どういう設定がされているのかわからないものを使うのは、ハマってしまったら調査が面倒だし、WordPress高速化ぐらいは自分でやっちゃえばいいかと思います。
    
    WordPress環境が今すぐ欲しいという時に使ってみるといいでしょう。
    
    - 参考サイト
    - [AWS + 網元で、超高速 WordPress を手に入れよう、そうしよう | 8bitodyssey.com](http://8bitodyssey.com/archives/3344)
2. CloudFormationのWordPressテンプレートを使用する
    
    CloudFormationとは、EC2やRDSなどAWSの各サービスの構築を、テンプレートという設定ファイルを元に行えるサービスです。AMIがEC2のみのコピーが出来るのに対して、CloudFormationはEC2以外のAWS全てのコピーが瞬時に出来る。というイメージです。EC2にはこれをインストールしておいて何個インスタンス作って、ELBも作って、RDSでMySQL使って、S3にバックアップするぜ。などの設定内容をテンプレート化しておけば、いつでも簡単にそれと同じ環境が作れます。WordPress用のテンプレートもデフォルトで用意されており、それを利用することができます。
    
    WordPress用のテンプレートでも、EC2にDBを構築するものや、RDSを使用するものがあったり、有志が作ったものも含めれば、無数のテンプレートが存在します。AMIと同様に、どんなテンプレがどんな設定になっているかわからないという事になりそうですが、テンプレートの設定内容は簡単なJSON形式で書いてあり、AMIよりだいぶホワイトボックスで、環境構築の際には有力な選択肢になります。
    
3. 手動でEC2+RDSを構築する
    
    これは説明の必要もありませんが、手動でEC2とRDSを作って色々設定していく方法です。非効率的ですが、誰かが自動化したものを使ってるだけでは、自分じゃ何も理解できないし、自動化できることのメリットも感じられないし、何より自分で一からやった方が楽しいので、今回は手動で構築していきます。
    

### 前提

- EC2インスタンスが作成済み（Amazon AMI, SSHとHTTPポートが開いている状態）
- RDSインスタンスが作成済み（MySQL）

[ドットインストール Amazon Web Servicesの基礎](http://dotinstall.com/lessons/basic_aws)に全てやり方は書いてあります。

### EC2の設定

1. SSHでログイン
    
    ```
    ssh -i keyname.pem ec2-user@ec2-XXXXXXXXXXXXXXXXXX.ap-northeast-1.compute.amazonaws.com
    ```
    
    keynameとホストは自分のに変えてください
    
2. まずはじめに、updateしなさいと言われるのでyum update
    
    ```
    $ sudo yum update
    ```
    
3. すでにインストール済みのパッケージを確認しておきましょう
    
    ```
      $ yum list installed
    ```
    
4. Apacheの設定  
    Apacheをインストールし、使う上で必要な設定をしていきます
    
    1. インストール
        
        ```
           $ sudo yum install httpd
        ```
        
    2. 自動起動するようにしておく
        
        ```
           $ sudo chkconfig httpd on
        ```
        
    3. 設定ファイル編集
        
        一応バックアップとっておいて
        
        ```
           $ sudo cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd.conf.org
        ```
        
        必須であろう設定をしていきます
        
        ```
           $ sudo vim /etc/httpd/conf/httpd.conf
        ```
        
        編集点はこちらです。これは[ドットインストール さくらのVPSの基礎](http://dotinstall.com/lessons/basic_sakura_vps)を参考にしています。
        
        ```
           ServerTokens Prod
           ServerSignature Off
           Options -Indexes FollowSymLinks
        ```
        
    4. 起動
        
        ```
           $ sudo service httpd start
        ```
        
5. PHPの設定  
    PHPをインストールし、日本語を使う上等で必要な設定をしていきます
    
    1. インストール
        
        ```
           $ sudo yum install php php-devel php-mysql php-mbstring php-gd
        ```
        
    2. 設定ファイル編集
        
        一応バックアップを取っておいて
        
        ```
           $ sudo cp /etc/php.ini /etc/php.ini.org
        ```
        
        必須であろう設定を
        
        ```
           $ sudo vim /etc/php.ini
        ```
        
        編集点はこちらです。こちらも[ドットインストール さくらのVPSの基礎](http://dotinstall.com/lessons/basic_sakura_vps)を参考にしています。
        
        ```
           error_log = /var/log/php_errors.log
           mbstring.language = Japanese
           mbstring.internal_encoding = UTF-8
           mbstring.http_input = auto
           mbstring.detect_order = auto
           expose_php = Off
           date.timezone = Asia/Tokyo
        ```
        
    3. Apache再起動
        
        ```
           $ sudo service httpd restart
        ```
        
6. WordPressのインストール
    
    1. WordPress日本語版(最新版)をダウンロードします。
        
        ```
           $ wget http://ja.wordpress.org/latest-ja.tar.gz
        ```
        
    2. Document Rootにダウンロードファイルを展開して、オーナーをapacheに変更
        
        ```
           $ tar zxvf latest-ja.tar.gz -C /var/www/html/
           $ sudo chown -R apache /var/www/html/wordpress/
        ```
        
        apacheに変更しておくことで、WordPress上でThemeやPluginのインストールが可能になります。
        
    3. ブラウザで [http://ec2-XXXXXXXXXXXXXXXXXX.ap-northeast-1.compute.amazonaws.com/wordpress](http://ec2-XXXXXXXXXXXXXXXXXX.ap-northeast-1.compute.amazonaws.com/wordpress) にアクセスしてみましょう
        
        最初にwp-config.phpがないエラーが表示されます。ウェブインターフェース経由で作成できるので、そのまま進めます。 [![WordPress › エラー](images/7fa5dcd197cff4174f16af8a380c9bdf.jpg "WordPress › エラー")](https://tsuchikazu.net/wp-content/uploads/2012/11/7fa5dcd197cff4174f16af8a380c9bdf.jpg)
        
        さぁ、始めましょう！
        
        [![WordPress › 設定構成ファイル](images/138126e52159251972970a2bfe18a689.jpg "WordPress › 設定構成ファイル")](https://tsuchikazu.net/wp-content/uploads/2012/11/138126e52159251972970a2bfe18a689.jpg)
        
        ここでデータベースの情報を設定します。[AWSのRDS管理画面](https://console.aws.amazon.com/rds/)から作成しておいたRDSインスタンスの情報を確認しましょう。
        
        ```
           データベース名：DB Name
           ユーザー名：Master Username
           パスワード：入力したパスワード
           データベースのホスト名：Endpoint
        ```
        
        [![WordPress › 設定構成ファイル-2](images/e7bb8018f0f644f9dfb143648dd398c5.jpg "WordPress › 設定構成ファイル-2")](https://tsuchikazu.net/wp-content/uploads/2012/11/e7bb8018f0f644f9dfb143648dd398c5.jpg)
        
        あとは画面に沿ってWordPressの情報を入力していくだけで、インストールが完了します。 [![WordPress › インストール](images/3bb927d50bb1567531c1cda4681aa5e2.jpg "WordPress › インストール")](https://tsuchikazu.net/wp-content/uploads/2012/11/3bb927d50bb1567531c1cda4681aa5e2.jpg)
        

ということで、AWSでのWordPressのインストールについて書いてきました。ここまで書いておいてあれですが、ただ単にWordPressを使いたいだけだったら、簡単だし、どこまで設定されているかも調査できるので、CloudFormationが一番良さげだと思います。

今回のように手動で構築していく場合は、EC2インスタンスを作成してSSH接続した後は、VPSと全く同じ感じです。ただし、AWSの真価が発揮されるのはここからです。

ここで一旦Snapshotを取っておいて、色々設定したけど、やっぱりSnapshotに戻そう。とか、このインスタンスではApacheで動かして置きながら、別のインスタンスではNginxなど別の挑戦を試して、設定完了したら瞬時に切り替える。とか、妄想するだけでも楽しくなってきますね。多額の課金がされないようにだけ注意して存分に遊んでいきましょう。

\[amazonjs asin="482226999X" locale="JP" title="Amazon Web Services 徹底活用ガイド (日経BPムック)"\]
