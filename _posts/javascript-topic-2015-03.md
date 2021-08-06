---
title: "2015年3月のJavaScriptトピック"
date: "2015-04-02"
categories: 
  - "フロントエンド"
tags: 
  - "angularjs"
  - "javascript"
  - "react"
---

今年の1/4が終わってしまいました。3月も色々ありましたね。  
さて、私の独断と偏見による3月のJavaScriptトピックを紹介します。

## [ng-conf](http://www.ng-conf.org/) & [ng-japan](http://ngjapan.org/)

ng-confが3/5〜3/6にソルトレイクで、ng-japanが3/21にサイバーエージェントで開催されました。  
主なトピックは、近々リリース予定のAngular1.4と、次世代のAngular2についてです。(近々リリースすると言い続けているAngular1.4は、一体いつリリースされるんでしょうか)

中でも興味深かったのは、Angular2で導入が予定されていたAtScriptがTypeScriptに統合されることです。  
前からTypeScriptチームとAngularチームが協力している話はありましたが、AtScriptの機能であったアノテーションなどがTypeScriptに入ることになり、AtScriptというAngularに対する変な障壁が無くなったことは良かったなと思っています。

また、Angular1.4のリリースと同時にNew Routerがリリースされる予定となっており、それによってAngular1系と2系が共存可能となります。  
Angularチームは、1系から2系へのmigrationに相当気を使っているようで、これからも徐々に2系へのmigrationプランが示されていきそうです。  
ちなみに、Google社内では今年の5月にはAngular2を使いはじめ、社内やコミュニティからのフィードバックを受け、今後のロードマップを決定するとのことでした。

- [Angular - ng-conf 2015 media](https://medium.com/angularjs-meetup-south-london/angular-ng-conf-2015-media-25dbe6250154) ng-confの動画やslideまとめ
- [連載 | ng-japan 2015 特集 | HTML5Experts.jp](https://html5experts.jp/series/ngjapa2015/)

## [React Native](http://facebook.github.io/react-native/)

今年の1月末にReact.js Confで発表されたReact Nativeが、ついに公開され誰でも使えるようになりました。  
似たようなものにTitanium Mobileがありましたが、Learn Once, Write anywareというコンセプトにもある通り、Webと同じ感覚でアプリも作れる。というのがTitaniumとは違うし一番の売りの様子。  
Web寄りの人間としては期待はしているため、今後の動向は追っていきたいです。

- [React Native | A framework for building native apps using React](http://facebook.github.io/react-native/)
- [React Native ファーストインプレッション - Qiita](http://qiita.com/naoya@github/items/ecda4d3089902dcbea53)
- [元某エヴァンジェリストが 見るReactNative](https://speakerdeck.com/masuidrive/yuan-mou-evuanzierisutoga-jian-rureactnative)

## [Push Notifications on the Open Web](http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web)

Android版Chromeでプッシュ通知が送れるようになりました。  
まぁWeb開発者にとっては念願ですよね。未来の話ではなく、もう現実になってきています。

- [Push Notifications on the Open Web](http://updates.html5rocks.com/2015/03/push-notificatons-on-the-open-web)
- [アプリを使わなくてもPush通知が来る！ | 株式会社VASILY(ヴァシリー)](http://tech.vasily.jp/android_chrome_push/)
- [ウェブのプッシュ通知、何がそんなにすごいのか？: Tender Surrender](https://blog.agektmr.com/2015/03/mobile-web-app.html)

## [Dart for the Entire Web](http://news.dartlang.org/2015/03/dart-for-entire-web.html)

Dartがお亡くなりになられた。と思いきや、AltJSとして生き残る様子。Dartが描いた壮大な夢は夢として終わってしまいました。  
個人的に今のところAltJSは、きっちり型が欲しい場合はTypeScript。それ以外はES6でいいという気持ち。

- [Dart News & Updates: Dart for the Entire Web](http://news.dartlang.org/2015/03/dart-for-entire-web.html)
