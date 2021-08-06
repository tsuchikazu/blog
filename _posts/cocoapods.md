---
title: "「CocoaPods」で便利なiOSライブラリ管理"
date: "2014-06-23"
categories: 
  - "ios"
tags: 
  - "cocoapods"
  - "ios"
---

最近、DeNAさんでのiOSライブラリのランキングが公開されていました。 [DeNAのiOSエンジニア内で利用頻度の高いライブラリをランキング化してみました #iOS #DeNA｜CodeIQ MAGAZINE](https://codeiq.jp/magazine/2014/06/11630/) 便利そうなライブラリがいっぱいあるんですね…初心者の自分には知らないものばかりで、勉強になりました。

さて、こういうライブラリを使いたいけど、どうやって使えばいいんだろう？ と思ってくれる初心者向けの記事です。

紹介されているような外部ライブラリは、[CocoaPods](http://cocoapods.org/)を使うことで、簡単に利用出来ます。 [CocoaPods](http://cocoapods.org/)とは、rubyでいうbundlerのようなもので、テキストファイルに必要なライブラリを書いてコマンドを打つだけで、 インストールされて使えるようになる。というものです。

さて、それでは実際に使ってみます。まずは、cocoapodsのインストールから。

```
$ sudo gem install cocoapods
```

sudoをつけないと、`pod install`時に以下のエラーが出たので、付けておいたほうが良さそうです。

```
$ pod install # 後半でエラーになる
Analyzing dependencies
[!] The `master` repo requires CocoaPods 0.32.1 -
Update CocoaPods,  or checkout the appropriate tag in the repo.
/Library/Ruby/Gems/2.0.0/gems/claide-0.4.0/lib/claide/command.rb:217:in `rescue in run': undefined method `verbose?' for nil:NilClass (NoMethodError)
```

cocoapodsのインストールが終わったら、xcodeのプロジェクトフォルダ直下に移動し、

```
$ pod init
```

を実行すると、Podfileというファイルが作成されるので、このファイルに必要なライブラリを追加します。 例えば、SDWebImageを使用するときは、以下の様に書いて保存します。

```
platform :ios, '6.1'
pod 'SDWebImage', '~>3.6'
```

Podfileを編集した後は、実際にライブラリをインストールします。

```
$ pod install
Analyzing dependencies
Downloading dependencies
Installing SDWebImage (3.6)
Generating Pods project
Integrating client project

[!] From now on use `TestApp.xcworkspace`.
```

アプリ名.xcworkspaceというファイルが出来ますので、今後はこれを開いて開発を進めます

```
$ open TestApp.xcworkspace
```

これで、簡単にライブラリを使うことが出来るようになりました。便利なライブラリを活用して、楽にiOS開発していきましょう。
