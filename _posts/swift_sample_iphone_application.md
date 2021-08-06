---
title: "Swiftを学べるサンプルiPhoneアプリを集めてみた"
date: "2014-07-26"
categories:
  - "ios"
tags:
  - "swift"
coverImage: "images/swift1.jpg"
---

今月のはじめにXCode6 beta3がリリースされ、それ以降お布施をしなくても、Swiftが試せるようになりました。今週もbeta4がリリースされ、日々進化していっているSwiftです。

これを機会にSwiftでiPhoneアプリデビューをしたい人も多いのではないでしょうか。自分もその一人で、Swiftのドキュメントを読んだり、[Swift Cheat Sheet and Quick Reference | Ray Wenderlich](http://www.raywenderlich.com/73967/swift-cheat-sheet-and-quick-reference)を張り出して、勉強していますが、いざアプリを作ろうとなると、Objective-C時代のiPhoneアプリ開発の知識もないため、なかなか難しいものです。

そこで、GitHubなどに公開されているSwiftで書かれているiPhoneアプリを集めてみました。これを見て、触って、いじって、少しずつアプリが作れるようにしていきたいです。

## Apple公式のサンプルコード

まず最初に押さえておくべきものは、公式です。[Swift BlogのResources](https://developer.apple.com/swift/resources/)に今後も追記されるんじゃないかと思います。
まだ、OSXのものも混じっており、iOSのサンプルになりそうなのはUICatalogぐらいしか公開されていないようです。
同じものですが、[iOS Developer Library - Pre-Release](https://developer.apple.com/library/prerelease/ios/navigation/)からも「Sample Code」で検索すると探すことが出来ます。

## GitHubに公開されているアプリ

すでにライブラリやらアプリやら、多くのRepositoryが公開されています。
今回は、[SwiftのStarが多い順](https://github.com/search?l=Swift&o=desc&q=swift&ref=searchresults&s=stars&type=Repositories)で検索して、サンプルアプリを探してみました。
(Star数は2014/07/26時点）

### [fullstackio/FlappySwift(★6,167)](https://github.com/fullstackio/FlappySwift)

Swift発表後に話題になった、FlappyBirdのSwift版です。
SpriteKitを使って、ものすごくシンプルに実装されているように見えます。

![](https://camo.githubusercontent.com/867dfad61329bd77258f00d586b16476c7bc405a/687474703a2f2f692e696d6775722e636f6d2f314e4c6f546f552e676966)

### [austinzheng/swift-2048(★1,296)](https://github.com/austinzheng/swift-2048)

これも以前ちょっと流行った[2048](http://gabrielecirulli.github.io/2048/)ゲームのSwift版です。

### [acani/Chats(★713)](https://github.com/acani/Chats)

チャットアプリ。

![](images/Chats.png)![](images/Chat.png)

### [JakeLin/SwiftWeather(★416)](https://github.com/JakeLin/SwiftWeather)

天気情報を表示するだけのアプリ。CocoapodsのAFNetworkingをBridgeして使っていて、1つのclassだけで完結してるっぽい。

![](images/Swift-Weather-33.png)

### [Dimillian/SwiftHN(★401)](https://github.com/Dimillian/SwiftHN)、[amitburst/HackerNews(★196)](https://github.com/amitburst/HackerNews)

[Hacker News](https://news.ycombinator.com/)を見るアプリ。一覧→詳細WebViewのようなニュースアプリ系の参考になりそう。

![](images/images.png) ![](https://camo.githubusercontent.com/3292240121f060442a5baa6784e74923e836fcd3/687474703a2f2f69647a722e6f72672f706b6962)![](https://camo.githubusercontent.com/e4220bbb67ec986cf868559ecc840bea4e080973/687474703a2f2f69647a722e6f72672f7a6b7a64)

### [wantedly/swift-rss-sample(★210)](https://github.com/wantedly/swift-rss-sample)

[iPhone - SwiftのRSS Readerを100行で作ったよ - Qiita](http://qiita.com/susieyy/items/749c4ac5d82d765c12c6) こちらで公開されていたRSS Reader。こちらもSwift発表後すぐに開発され、話題になりました。

![](images/movie.gif)

### [demon1105/PinterestSwift(★143)](https://github.com/demon1105/PinterestSwift)

[Pinterest](https://www.pinterest.com/)アプリのUIを再現したアプリ。面白い動き。

![](images/compressed.gif)

### [synboo/SwiftFlickrApp(★71)](https://github.com/synboo/SwiftFlickrApp)

[SwiftでFlickrの人気写真を見るアプリを100行で作ったよ - synblog](http://synboo.hatenablog.com/entry/2014/06/05/235618) で公開されていたFlickerアプリ。

![](images/Video.gif) ということで、探せば他にも色々あるので、自分の作りたいものに似ているアプリを探して、それをカスタマイズしていく。っていうのが、上達への道じゃないかなと思います。さぁパクって作ろう（ライセンスにはご注意を！）

\[amazonjs asin="4800710707" locale="JP" title="詳細! Swift iPhoneアプリ開発 入門ノート Swift 1.1+Xcode 6.1+iOS 8.1対応"\] \[amazonjs asin="4797380497" locale="JP" title="詳解 Swift"\]
