---
title: "Google Analyticsデータ取得Gem「Garb」の使い方"
date: "2012-11-16"
categories: 
  - "ruby"
tags: 
  - "garb"
  - "gem"
  - "google-analytics"
  - "ruby"
coverImage: "large_7642089058.jpg"
---

最近、色々な数値を社内のIRCに自動投稿するツールを作るのにハマっています。投稿している数値とは、前日の売上とか、契約数とかですね。メールでも送信はされていますが、読んでくださいと言われても、埋もれて読まないことも多く、みんなが気軽に読める場所へアウトプットするのは結構便利です。さらに今回Google Analyticsからも数値を拾ってみましたので、その紹介です。

Google Analytics API用のgemとして、「Garb」があります。RubyGemsに登録されている本家のGarbは[vigetlabs/garb](https://github.com/vigetlabs/garb)なんですが、残念ながら2011年12月のversion 0.9.1を最後に更新が止まってしまっていて、今(2012/11)は動きません。[issue](https://github.com/vigetlabs/garb/issues/127)を見ると、俺のを使えよ！というコメントがありますので、[Sija/garb](https://github.com/Sija/garb)version 0.9.7を使います。

普通に

```
 $ gem install garb 
```

すると、動作しない(0.9.1)がインストールされるので、下記手順でお試しください。

### fork先の[Sija/garb](https://github.com/Sija/garb)をインストール

1. cloneしてソースをダウンロードします
    
    ```
      $ git clone https://github.com/Sija/garb.git
      $ cd garb
    ```
    
2. gemをビルドしてインストール  
    あとはrake installを叩くだけ
    
    ```
      $ rake install
      garb 0.9.7 built to pkg/garb-0.9.7.gem
      garb (0.9.7) installed
    ```
    
    もしくは、手動でGemをビルド&インストールしてもOKです
    
    ```
      $ gem build garb.gemspec
      WARNING:  no description specified
        Successfully built RubyGem
        Name: garb
        Version: 0.9.7
        File: garb-0.9.7.gem
      $ gem i garb-0.9.7.gem
      Successfully installed garb-0.9.7
      1 gem installed
      Installing ri documentation for garb-0.9.7...
      Installing RDoc documentation for garb-0.9.7...
    ```
    

### Garbを使ってみよう

1. ログイン
    
    OAuthのやり方もありますが、ID/Passwordでのログインの方が簡単なのでそちらでやります。
    
    ```
      Garb::Session.login(username,  password)
    ```
    
2. Profileの特定
    
    1つのアカウントで複数のサイトを管理していることが多いので、トラッキングIDで調べたいサイトを絞り込みます。
    
    ```
      profile = Garb::Management::Profile.all.detect do
        |p| p.web_property_id == 'UA-XXXXXXXX'
      end
    ```
    
3. 指標とディメンションを設定
    
    指標とディメンションをGarb::Modelをextendしたクラスに定義します。  
    何を指定すればいいかは、カスタムレポートを作る場合と一緒です。こちらの[Google Analyticsのカスタムレポートを使い倒す為の第一歩！時間／日付／曜日、各時間軸のカスタムレポートを作ってみる！](http://webya.opdsgn.com/webtech/customreportisoneofthegreatesttoolintheworld/)  
    を見れば、大変わかりやすいです。実際に指定するシンボルは、[Dimensions & Metrics Reference](https://developers.google.com/analytics/devguides/reporting/core/dimsmets#cats=time)の「ga:」を除いた文字でOKです。
    
    試しに、何日にアクセスが多いか調べてみます。指標には知りたい数値、ページビューを指定します。ディメンションには何を基準に解析結果をまとめるか、日付を指定します。
    
    ```
      class Pageviews
        extend Garb::Model
    
        metrics :pageviews
        dimensions :date
      end
    ```
    
4. 結果を表示する
    
    指標とディメンションを指定したクラス名をprofileのメソッドとして、呼び出すことが出来ます。引数で結果をフィルタリングすることも出来ます。
    
    ```
      results = profile.pageviews(limit: 10, sort: :pageviews.desc)
      results.each do |result|
        p "pageviews:#{result.pageviews} date:#{result.date} title:#{result.page_title}"
      end
    ```
    
    または、こんな呼び出し方も出来ます。
    
    ```
      results = Pageviews.results(profile, limit: 10, sort: :pageviews.desc)
      results.each do |result|
        p "pageviews:#{result.pageviews} date:#{result.date} title:#{result.page_title}"
      end
    ```
    

### 最後にサンプルプログラム

```
 # -*- encoding: utf-8 -*-
 require "rubygems"
 require "garb"

 username = "xxxxxxxxx"
 password = "xxxxxxxxx"

 Garb::Session.login(username,  password)
 profile = Garb::Management::Profile.all.detect do
   |p| p.web_property_id == 'UA-36258133-1'
 end

 class Pageviews
   extend Garb::Model
   metrics :pageviews
   dimensions :date,  :page_title
 end

 results = profile.pageviews(limit: 10, sort: :pageviews.desc)
 results.each do |result|
   p "pageviews:#{result.pageviews} date:#{result.date} title:#{result.page_title}"
 end

 # >> "pageviews:60 date:20121114 title:tsuchikazu blog"
 # >> "pageviews:55 date:20121112 title:ActiveRecordを単体で使うには | tsuchikazu blog"
 # >> "pageviews:49 date:20121112 title:tsuchikazu blog"
 # >> "pageviews:37 date:20121113 title:tsuchikazu blog"
 # >> "pageviews:33 date:20121116 title:ActiveRecordを単体で使うには | tsuchikazu blog"
 # >> "pageviews:29 date:20121113 title:LinuxにRuby on Railsをインストールする | tsuchikazu blog"
 # >> "pageviews:28 date:20121114 title:Javaの人間がRubyの世界に入って一番感じる1つの違いtsuchikazu blog | tsuchikazu blog"
 # >> "pageviews:24 date:20121116 title:tsuchikazu blog"
 # >> "pageviews:19 date:20121112 title:LinuxにRuby on Railsをインストールする | tsuchikazu blog"
 # >> "pageviews:18 date:20121112 title:WordPressでMarkdown + Syntaxハイライトするには | tsuchikazu blog"
```

ということで、現在アクセス数は少なくて悲しいけど、簡単にGoogle AnalyticsもRubyから使えて便利ですね。
